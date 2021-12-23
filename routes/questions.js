const router = require("express").Router();
const questionController = require("../controllers/questionController");
const isAuthenticated = require("../middlewares/auth");

// Create a question
router.post("/", isAuthenticated, questionController.create);


// Get all questions
router.get("/", questionController.getAllQuestions);

// Get que by id
router.get('/:id/fetch', questionController.getOne)

// Delete a question
router.delete("/delete/:id", isAuthenticated, questionController.delete);

// // Get all questions of loggedIn person
router.get(
  "/allQuestions",
  isAuthenticated,
  questionController.getQuestionsOfPerson
);

// To approve the post by expert
router.post('/:id/approve', questionController.approve)


// upVote a question
router.post("/upvote", isAuthenticated, questionController.voteUp);

// downvote a question


module.exports = router;
