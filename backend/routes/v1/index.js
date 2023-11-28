const express = require("express");
const videoRoute = require('./video.route');

const router = express.Router();

router.use("/videos", videoRoute);

module.exports = router;