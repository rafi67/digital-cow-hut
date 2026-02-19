import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.post("/auth/signup", UserController.createUser);
router.get("/:id", UserController.getSingleUser);
router.get("/", UserController.getAllUsers);
router.patch("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export const UserRoutes = router;
