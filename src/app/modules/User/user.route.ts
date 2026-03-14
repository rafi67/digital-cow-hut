import express from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/auth/signup",
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser,
);
router.get(
  "/my-profile",
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  UserController.getMyProfile,
);
router.patch(
  "/my-profile/:phone",
  validateRequest(UserValidation.updateUserProfileZodSchema),
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  UserController.updateMyProfile,
);
router.get("/:id", auth(ENUM_USER_ROLE.ADMIN), UserController.getSingleUser);
router.get("/", auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);
router.patch(
  "/:id",
  validateRequest(UserValidation.updateUserZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.updateUser,
);
router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser);

export const UserRoutes = router;
