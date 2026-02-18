import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.post("/createBuyer", UserController.createBuyer);
router.get("/:id", UserController.getSingleUser);
router.get("/", UserController.getAllUsers);

export const UserRoutes = router;
