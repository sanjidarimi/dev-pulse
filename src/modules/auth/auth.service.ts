import bcrypt from "bcryptjs";
import { pool } from "../../db";

const createUserIntoDB = async (payload: any) => {

  const { name, email, password, role } = payload;
  const hashpassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4)
    RETURNING *
    `,
    [name, email, hashpassword, role],
  );
  delete result.rows[0].password;
  return result;
};
export const authService = {
  createUserIntoDB,
};
