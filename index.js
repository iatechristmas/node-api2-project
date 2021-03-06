const express = require("express");
const postsRouter = require("./posts/posts-router.js");
const server = express();

server.use(express.json());

const PORT = 5000;

server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send("<p>the API is up and running!</p>");
});

server.listen(PORT, () => {
  console.log(`**** listening on port ${PORT}`);
});
