import { Pool } from "pg";
import { config } from "../config";

export const pool = new Pool({
  connectionString: config.connection_string,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const initDB = async () => {
  try {
    await pool.query(
      `
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name VARCHAR(40) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL, 
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'contributor',
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
