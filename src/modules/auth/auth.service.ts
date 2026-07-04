import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { pool } from "../../db";
import type { ILoginResponse, IUser } from "./auth.interface";

const createUserIntoDB = async (payload: Partial<IUser>): Promise<Omit<IUser, "password">> => {
  const { name, email, password, role } = payload;
  
  if (!name || !email || !password) {
    const error: any = new Error("Name, email and password are required");
    error.statusCode = 400;
    throw error;
  }

  // ইমেইল অলরেডি আছে কিনা চেক
  const userExists = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
  if (userExists.rows.length > 0) {
    const error: any = new Error("Email already registered");
    error.statusCode = 409; // Conflict
    throw error;
  }

  // এখানে AWAIT ব্যবহার করা বাধ্যতামূলক!
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role || "contributor";

  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
  `;
  
  const result = await pool.query(query, [name, email, hashedPassword, userRole]);
  return result.rows[0];
};

const getUserIntoDB = async (payload: Pick<IUser, "email" | "password">): Promise<ILoginResponse> => {
  const { email, password } = payload;

  if (!email || !password) {
    const error: any = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  const user = result.rows[0];

  if (!user) {
    const error: any = new Error("Invalid credentials");
    error.statusCode = 401; 
    throw error;
  }


  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const error: any = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    config.jwt_secret as string,
    { expiresIn: "1d" }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
};

export const authService = {
  createUserIntoDB,
  getUserIntoDB,
};