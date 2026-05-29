import { pool } from "../../db";
import type { IIssue } from "./issues.interface";

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

export const issuesService = {
  createIssueIntoDB,
};
