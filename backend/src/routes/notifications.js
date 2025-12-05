import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from "../controllers/notificationController.js";

const router = express.Router();

router.use(auth);

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

export default router;