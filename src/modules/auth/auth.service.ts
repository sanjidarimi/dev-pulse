import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { pool } from "../../db";
import type { ILoginResponse, IUser } from "./auth.interface";
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
const getUserIntoDB = async (
  payload: Pick<IUser, "email" | "password">,
): Promise<ILoginResponse> => {
  const { email, password } = payload;
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  const user = result.rows[0];
  if (!user) {
    throw new Error("Invalid credentials");
  }
  const isPasswordMatch = await bcrypt.compare(
    password as string,
    user.password,
  );
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    config.jwt_secret,
    { expiresIn: "1d" },
  );
  const { password: _,...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
};

export const authService = {
  createUserIntoDB,
  getUserIntoDB,
};
