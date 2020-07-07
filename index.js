const express = require("express");
const postsRouter = require("./hubs/hubs-router.js");
const server = express();

server.use(express.json());

const PORT = 5000;

server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send("<p>the API is up and running!</p>");
});

server.listen(Port, () => {
  console.log(`**** listening on port ${PORT}`);
});
