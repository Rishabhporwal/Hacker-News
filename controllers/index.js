const axios = require("axios");
const fs = require("fs");

const baseUrl = process.env.BASE_URL;

const getStory = async (id) => {
  try {
    const story = await axios.get(baseUrl + "item/" + id + ".json");
    return await story.data;
  } catch (error) {
    return res.status(400).json({
      statuscode: 400,
      status: "fail",
      message: "Something went wrong!!",
      error: error,
    });
  }
};

const getCommentById = async (commentid) => {
  try {
    const comment = await axios.get(baseUrl + "item/" + commentid + ".json");

    return await comment.data;
  } catch (error) {
    return res.status(400).json({
      statuscode: 400,
      status: "fail",
      message: "Something went wrong!!",
      error: error,
    });
  }
};

const getUserdetailsByUsername = async (username) => {
  try {
    const user = await axios.get(baseUrl + "user/" + username + ".json");
    return await user.data;
  } catch (error) {
    return res.status(400).json({
      statuscode: 400,
      status: "fail",
      message: "Something went wrong!!",
      error: error,
    });
  }
};

const writeFileInJson = async (path, data) => {
  try {
    if (!fs.existsSync(path)) {
      return await fs.writeFileSync(path, JSON.stringify(data));
    }

    let storiesData = await fs.readFileSync(path);
    let storiesDataJson = JSON.parse(storiesData);
    storiesDataJson.push(...data);
    return await fs.writeFileSync(path, JSON.stringify(storiesDataJson));
  } catch (error) {
    return res.status(400).json({
      statuscode: 400,
      status: "fail",
      message: "Something went wrong!!",
      error: error,
    });
  }
};

const readFileFromJson = async (path) => {
  try {
    var storiesDataJson;
    let storiesData = await fs.readFileSync(path, "utf8");

    if (storiesData !== "") {
      storiesDataJson = JSON.parse(storiesData);
    }
    return storiesDataJson;
  } catch (error) {
    return res.status(400).json({
      statuscode: 400,
      status: "fail",
      message: "Something went wrong!!",
      error: error,
    });
  }
};

exports.topStories = async (req, res) => {
  try {
    let stories = [];
    let limit = 10;
    const topStories = await axios.get(baseUrl + "topstories.json");

    let storiesData = await Promise.all(
      topStories.data.map(async (element) => {
        return await getStory(element);
      })
    );

    var sortByScore = storiesData.slice(0);
    sortByScore.sort(function (a, b) {
      return b.score - a.score;
    });

    const top10stories = sortByScore.slice(0, limit);

    await Promise.all(
      top10stories.map((story) => {
        stories.push({
          title: story.title,
          url: story.url,
          score: story.score,
          time: new Date(story.time * 1000).toUTCString(),
          user: story.by,
        });
      })
    );
    await writeFileInJson("./data/storiesdata.json", stories);

    return res.status(200).json({
      statuscode: 200,
      status: "success",
      message: "Top 10 stories by scores fetched successfully",
      data: stories,
    });
  } catch (error) {
    return res.status(400).json({
      statuscode: 400,
      status: "fail",
      message: "Something went wrong!!",
      error: error,
    });
  }
};

exports.getStoryComments = async (req, res) => {
  try {
    const storyId = req.params.storyID;
    const limit = 10;
    const comments = [];
    const storyDetails = await getStory(storyId);
    const getStoryCommentIds = storyDetails.kids;
    const totalComments = getStoryCommentIds.length;
    const top10Comments = getStoryCommentIds.slice(0, limit);

    await Promise.all(
      top10Comments.map(async (element) => {
        const comment = await getCommentById(element);
        const userDetail = await getUserdetailsByUsername(comment.by);

        comments.push({
          text: comment.text,
          user: comment.by,
          userCreated: new Date(userDetail.created * 1000).toUTCString(),
        });
      })
    );

    return res.status(200).json({
      statuscode: 200,
      status: "success",
      message: "Top 10 comments by on given story fetched successfully",
      data: {
        totalComments: totalComments,
        comments,
      },
    });
  } catch (error) {
    return res.status(400).json({
      statuscode: 400,
      status: "fail",
      message: "Something went wrong!!",
      error: error,
    });
  }
};

exports.getPastStories = async (req, res) => {
  try {
    let previousStoriesdata = await readFileFromJson("./data/storiesdata.json");
    
    if (previousStoriesdata == undefined) {
      previousStoriesdata = [];
    } else {
      previousStoriesdata = previousStoriesdata;
    }
    return res.status(200).json({
      statuscode: 200,
      status: "success",
      message: "Previous stories fetched successfully",
      data: previousStoriesdata,
    });
  } catch (error) {
    return res.status(400).json({
      statuscode: 400,
      status: "fail",
      message: "Something went wrong!!",
      error: error,
    });
  }
};
