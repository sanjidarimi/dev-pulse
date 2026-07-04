import { Pool } from "pg";
import { config } from "../config";

export const pool = new Pool({
  connectionString: config.db_url,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createUserTable = `
CREATE TABLE IF NOT EXISTS users(
id SERIAL PRIMARY KEY,
name VARCHAR(150) NOT NULL,
email VARCHAR(200) UNIQUE NOT NULL,
password VARCHAR(250) NOT NULL,
role VARCHAR(50) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
const createIssuesTable = `
CREATE TABLE IF NOT EXISTS issues(
id SERIAL PRIMARY KEY,
title VARCHAR(100) NOT NULL,
description TEXT NOT NULL,
type VARCHAR(50) NOT NULL CHECK (type IN('bug', 'feature_request')),
status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_process', 'resolved')),
reported_id INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
export const initDB = async (): Promise<void> => {
  try {
    await pool.query(createUserTable);
    await pool.query(createIssuesTable);
    console.log("Database tables checked/created successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1)
  }
};
