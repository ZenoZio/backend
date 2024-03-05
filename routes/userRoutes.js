import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUserForSideBar } from "../controllers/usercontroller.js";

const router = express.Router();

router.get("/", protectRoute, getUserForSideBar);

export default router;
