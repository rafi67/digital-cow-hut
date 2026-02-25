import express from "express";
import { UserRoutes } from "../modules/User/user.route";
import { CowRoutes } from "../modules/Cow/cow.route";
import { OrderRoutes } from "../modules/Order/order.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users/",
    route: UserRoutes,
  },
  {
    path: "/cows/",
    route: CowRoutes,
  },
  {
    path: "/orders/",
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
