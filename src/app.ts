import express, { type Request, type Response } from "express";
const app = express();
const port = 3000;
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({
    author: "dev pulse",
    message: "Track your issues in the best way",
  });
});

export default app;
