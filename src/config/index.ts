import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
export const config = {
    port : process.env.PORT,
    connection_string : process.env.CONNECTION_STRING_URL

};
