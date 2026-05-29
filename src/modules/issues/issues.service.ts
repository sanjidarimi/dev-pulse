import { pool } from "../../db";
import type { IAuthUser } from "../../middlewares/auth.middleware";
import type { IIssue, IIssueWithReporter } from "./issues.interface";

const createIssueIntoDB = async (
  payload: Partial<IIssue>,
  reporterId: number,
): Promise<IIssue> => {
  const { title, description, type } = payload;
  if (!title || title.length > 150) {
    throw new Error("Title is required and max 150 characters");
  }
  if (!description || description.length < 20) {
    throw new Error("Description is required and min 20 characters");
  }
  if (!type || !["bug", "feature_request"].includes(type)) {
    throw new Error("Invalid type");
  }

  const query = `
      INSERT INTO issues (title, description, type, reporter_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
  const result = await pool.query(query, [
    title,
    description,
    type,
    reporterId,
  ]);
  return result.rows[0];
};
const getAllIssues = async (filters: {
  sort?: string;
  type?: string;
  status?: string;
}): Promise<IIssueWithReporter[]> => {
  let queryText = "SELECT * FROM issues WHERE 1=1";
  const queryParams: string[] = [];
  let paramIndex = 1;

  if (filters.type) {
    queryText += ` AND type = $${paramIndex}`;
    queryParams.push(filters.type);
    paramIndex++;
  }

  if (filters.status) {
    queryText += ` AND status = $${paramIndex}`;
    queryParams.push(filters.status);
    paramIndex++;
  }
  const sortOrder = filters.sort === "oldest" ? "ASC" : "DESC";
  queryText += ` ORDER BY created_at ${sortOrder}`;

  const issuesResult = await pool.query(queryText, queryParams);
  const issues: IIssue[] = issuesResult.rows;

  if (issues.length === 0) return [];

  const reporterIds = Array.from(new Set(issues.map((i) => i.reporter_id)));
  const reportersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporterIds],
  );

  const reporterMap = new Map(reportersResult.rows.map((r) => [r.id, r]));

  return issues.map((issue) => {
    const reporter = reporterMap.get(issue.reporter_id) || {
      id: issue.reporter_id,
      name: "Unknown",
      role: "contributor",
    };
    const { reporter_id, ...issueData } = issue;
    return { ...issueData, reporter };
  });
};
const getSingleIssue = async (id: number): Promise<IIssueWithReporter> => {
  const issueResult = await pool.query("SELECT * FROM issues WHERE id = $1", [
    id,
  ]);
  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }
  const userResult = await pool.query(
    "SELECT id, name, role FROM users WHERE id = $1",
    [issue.reporter_id],
  );
  const reporter = userResult.rows[0] || {
    id: issue.reporter_id,
    name: "Unknown",
    role: "contributor",
  };

  const { reporter_id, ...issueData } = issue;
  return { ...issueData, reporter };
};

const updateIssus = async (
  id: number,
  payload: Partial<IIssue>,
  user: IAuthUser,
): Promise<IIssue> => {
  const currentIssueResult = await pool.query(
    "SELECT * FROM issues WHERE id = $1",
    [id],
  );
  const currentIssue = currentIssueResult.rows[0];

  if (!currentIssue) {
    throw new Error("Issue not found");
  }

  // Role dynamic validation logic
  if (user.role === "contributor") {
    if (currentIssue.reporter_id !== user.id) {
      throw new Error("You can only update your own issues");
    }
    if (currentIssue.status !== "open") {
      throw new Error("Contributors can only edit issues with open status");
    }
  }

  const title = payload.title || currentIssue.title;
  const description = payload.description || currentIssue.description;
  const type = payload.type || currentIssue.type;
  const status =
    user.role === "maintainer" && payload.status
      ? payload.status
      : currentIssue.status;

  const query = `
      UPDATE issues 
      SET title = $1, description = $2, type = $3, status = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
  const result = await pool.query(query, [
    title,
    description,
    type,
    status,
    id,
  ]);
  return result.rows[0];
};

const deleteIssues = async (id: number): Promise<void> => {
  const checkResult = await pool.query("SELECT id FROM issues WHERE id = $1", [
    id,
  ]);
  if (checkResult.rows.length === 0) {
    throw new Error("Issue not found");
  }
  await pool.query("DELETE FROM issues WHERE id = $1", [id]);
};

export const issuesService = {
  createIssueIntoDB,
  getAllIssues,
  getSingleIssue,
  updateIssus,
  deleteIssues,
};
