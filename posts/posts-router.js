const router = require("express").Router();
const db = require("../data/db");

router.get("/", (req, res) => {
  db.find()
    .then((response) => {
      console.log(response);
      res.status(201).json({ message: response });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
  db.insert({ title, contents })
    .then(({ id }) => {
      db.findById(id).then(([posts]) => {
        res.status(201).json(posts);
      });
    })
    .catch((error) => {
      res
        .status(500)
        .json(
          { error: "There was an error while saving the post to the database" },
          error.message
        );
    });
});

router.post("/:id/comments", (req, res) => {
  const post_id = req.params.id;
  const text = req.body.text;

  if (!text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
  db.insertComment({ post_id, text })
    .then(({ id: comment_id }) => {
      db.findCommentById(comment_id).then(([comment]) => {
        comment
          ? res.status(201).json(comment)
          : res.status(404).json({
              message: "The post with the specified ID does not exist.",
            });
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: "There was an error while saving the comment to the database",
      });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then((response) => {
      const findMethod = response.find((item) => item.id == id);
      findMethod
        ? res.status(200).json(response)
        : res.status(404).json({
            message: "The post with the specified ID does not exist.",
          });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;

  db.findPostComments(id)
    .then((response) => {
      const findMethod = response.find((item) => item.post_id == id);
      console.log(response);
      !findMethod
        ? res.status(404).json({
            message: "The post with the specified ID does not exist.",
          })
        : res.status(200).json(response);
    })
    .catch((error) => {
      res
        .sendStatus(500)
        .json({ error: "The comments information could not be retrieved." });
      console.log(error);
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then((response) => {
      response === 0
        ? res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." })
        : res.status(201).json(`This post was deleted: ${id}`);
    })
    .catch((error) => {
      res.status(500).json({ error: "The post could not be removed" });
      console.log(error);
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const post = req.body;

  if (!post.title || !post.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    db.update(id, post)
      .then((response) => {
        // console.log(response);
        response === 0
          ? res.status(404).json({
              message: "The post with the specified ID does not exist.",
            })
          : res.status(200).json(response);
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  }
});

module.exports = router;
