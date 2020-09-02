const express = require("express");

const router = express.Router();

const {
  topStories,
  getStoryComments,
  getPastStories,
} = require("../controllers/index");

const { memcachedMiddleware } = require("../middlewares/cache");

router.get("/top-stories", memcachedMiddleware(process.env.CACHE_DURATION), topStories);
router.get("/comments/:storyID", getStoryComments);
router.get("/past-stories", getPastStories);

module.exports = router;
