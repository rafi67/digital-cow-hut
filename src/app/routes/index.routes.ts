import express, { Request, Response } from "express";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: router.get("/", async (req: Request, res: Response) => {
      res.send("Express typescript is running");
    }),
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
