import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./auth.interface";

const createUserIntoDB = async (payload:any) => {
  console.log("payload",payload);
  const { name, email, password } = payload;
  const hashpassword = bcrypt.hash(password, 10);
  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4)
    RETURNING *
    `,
    [name, email, hashpassword],
  );
  console.log(result);
};
export const authService = {
  createUserIntoDB,
};
