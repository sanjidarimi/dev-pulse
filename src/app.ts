import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRoute } from "./modules/auth/auth.route";

const app: Application = express();
app.use(express.json());
app.use("/api/auth/signup", authRoute);
app.use("/api/auth/login",authRoute)
app.get("/", (req: Request, res: Response) => {
  res.send({
    author: "dev pulse",
    message: "Track your issues in the best way",
  });
});

export default app;
