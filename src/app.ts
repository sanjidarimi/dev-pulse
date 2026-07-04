import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRoute } from "./modules/auth/auth.route";
import { IssuesRoute } from "./modules/issues/issues.route";

const app: Application = express();
app.use(express.json());
app.use("/api/auth", authRoute);

app.use("/api/issues", IssuesRoute);
app.get("/", (req: Request, res: Response) => {
  res.send({
    author: "dev pulse",
    message: "Track your issues in the best way",
  });
});

export default app;
