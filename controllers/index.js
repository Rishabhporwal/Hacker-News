const axios = require("axios");
const fs = require("fs");

const baseUrl = process.env.BASE_URL;

const getStory = async (id) => {
  try {
    const story = await axios.get(baseUrl + "item/" + id + ".json");
    return await story.data;
  } catch (error) {
    console.log("something went wrong");
  }
};

const getCommentById = async (commentid) => {
  try {
    const comment = await axios.get(baseUrl + "item/" + commentid + ".json");

    return await comment.data;
  } catch (error) {
    console.log("something went wrong");
  }
};

const getUserdetailsByUsername = async (username) => {
  try {
    const user = await axios.get(baseUrl + "user/" + username + ".json");
    return await user.data;
  } catch (error) {
    console.log("something went wrong");
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
    console.log("file not able to write", error);
  }
};

const readFileFromJson = async (path) => {
  try {
    var storiesDataJson;
    let storiesData = await fs.readFileSync(path, "utf8");

    if(storiesData !== ""){
        storiesDataJson = JSON.parse(storiesData);
    }
    return storiesDataJson;
  } catch (error) {
    console.log("file not able to read", error);
  }
};

exports.topStories = async (req, res) => {
  try {
    let stories = [];
    let limit = 10;
    const topStories = await axios.get(baseUrl + "topstories.json");

    const top10stories = topStories.data.slice(0, limit);

    await Promise.all(
      top10stories.map(async (element) => {
        const story = await getStory(element);
   
        stories.push({
          title: story.title,
          url: story.url,
          score: story.score,
          time: story.time,
          user: story.by,
        });
      })
    );
    
    await writeFileInJson("./data/storiesdata.json", stories);

    return res.status(200).json({
      data: stories,
    });
  } catch (error) {
    return res.status(400).json({
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
    const top10Comments = getStoryCommentIds.slice(0, limit);

    top10Comments.forEach(async (element) => {
      const comment = await getCommentById(element);
      const userDetail = await getUserdetailsByUsername(comment.by);

      comments.push({
        text: comment.text,
        user: comment.by,
        userCreated: userDetail.created,
      });
      console.log({
        text: comment.text,
        user: comment.by,
        userCreated: userDetail.created,
      });
    });
    console.log(comments);
    return res.status(200).json({
      data: comments,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

exports.getPastStories = async (req, res) => {
  try {
    let previousStoriesdata = await readFileFromJson(
      "./data/storiesdata.json"
    );

    if(previousStoriesdata == undefined){
        previousStoriesdata = [];
    }else{
        previousStoriesdata = JSON.parse(previousStoriesdata);
    }
    return res.status(200).json({
      data: previousStoriesdata,
    });
  } catch (error) {
    return res.status(400).json({
        msg:"message",
      error: error,
    });
  }
};
