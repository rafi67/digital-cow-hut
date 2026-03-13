import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidation } from "./order.validation";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/",
  validateRequest(OrderValidation.createOrderZodSchema),
  auth(ENUM_USER_ROLE.BUYER),
  OrderController.createOrder,
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
  OrderController.getSingleOrder,
);

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  OrderController.getAllOrder,
);

export const OrderRoutes = router;
