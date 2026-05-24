import { Pool } from "pg";
import { config } from "../config";
const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDB = async () => {
  try {
    await pool.query(
      `   
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(40),
        email VARCHAR(100) UNIQUE NOT NULL, 
        password TEXT NOT NULL,
        role TEXT DEFAULT contributor,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `,
    );
    console.log("database connected");
  } catch (error) {
    console.error(error);
  }
};
