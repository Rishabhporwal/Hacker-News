# Hacker-News
Hacker new api implementation for fetching data and play with api

# Steps for installation

- Install memcache in system and start it.
- Clone Repository
- npm install
- npm start

# Endpoints

--- API for getting top 10 stories ranked by scores ---
- [GET] http://localhost:3000/v1/top-stories

--- API for top 10 parent comments on a given story ---
- [GET] http://localhost:3000/v1/comments/:storyID 
- Ex: http://localhost:3000/v1/comments/24350647

--- all the past top stories that were served previously ---
- [GET] http://localhost:3000/v1/past-stories
