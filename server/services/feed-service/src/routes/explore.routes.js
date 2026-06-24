import express from "express";
import { search, trending, trainers, videos, articles } from "../controllers/explore.controller.js";

const router = express.Router();

router.get("/search", search);
router.get("/trending", trending);
router.get("/trainers", trainers);
router.get("/videos", videos);
router.get("/articles", articles);

export default router;
