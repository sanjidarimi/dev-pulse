import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
export const config = {
  port: process.env.PORT,
  db_url: process.env.CONNECTION_STRING_URL,
  jwt_secret: process.env.JWT_SECRET,
};
