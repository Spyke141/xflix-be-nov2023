const express = require("express");
const videoController = require("../../controllers/video.controller");

const router = express.Router();

router.get("/", videoController.getVideos);
router.get("/:videoId", videoController.getVideoById);
router.post("/", videoController.postVideos);
router.patch("/:videoId/votes", videoController.updateVotesCount);
router.patch("/:videoId/views", videoController.updateViewCount);

module.exports = router;