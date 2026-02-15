import express, { Request, Response } from "express";
import { UserRoutes } from "../modules/User/User.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: router.get("/", async (req: Request, res: Response) => {
      res.send("Express typescript is running");
    }),
  },
  {
    path: "/users/",
    route: UserRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
