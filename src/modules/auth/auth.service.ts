import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./auth.interface";

// const createUserIntoDB = async (payload: any) => {
//   const { name, email, password, role } = payload;
//   const hashpassword = await bcrypt.hash(password, 10);
//   const result = await pool.query(
//     `
//     INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4)
//     RETURNING *
//     `,
//     [name, email, hashpassword, role],
//   );
//   delete result.rows[0].password;
//   return result;
// };

const createUserIntoDB = async (
  payload: Partial<IUser>,
): Promise<Omit<IUser, "password">> => {
  const { name, email, password, role } = payload;
  if (!name || !email || !password) {
    throw new Error("name, email and password are required");
  }
  const userExists = await pool.query(
    `
      SELECT id FROM users WHERE email = $1 
      `,
    [email],
  );
  if (userExists.rows.length > 0) {
    throw new Error("email already registed");
  }
  const hasedPassword = bcrypt.hash(password, 10);
  const userRole = role || "contributor";
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1,$2,$3,$4)
    RETURNING id, name, email, role, created_at, updated_at
    `;
  const result = await pool.query(query, [
    name,
    email,
    hasedPassword,
    userRole,
  ]);

  return result.rows[0];
};

export const authService = {
  createUserIntoDB,
};
