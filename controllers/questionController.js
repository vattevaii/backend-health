const Question = require("../models/Question");
const Comment = require("../models/Comment");
const CustomErrorHandler = require("../services/CustomErrorHandler");

module.exports = {
  // Create new question
  create: async (req, res, next) => {
    const question = new Question({
      title: req.body.title,
      desc: req.body.desc,
      user: req.user._id,
    });

    const savedQuestion = await question.save();
    return res.status(200).json(savedQuestion);
  },

  // Delete the question
  delete: async (req, res, next) => {
    const question = await Question.findById(req.params.id);

    if (!question)
      return next(CustomErrorHandler.notFound("Question not found"));

    if (req.user.isExpert || question.user === req.user._id) {
      await question.remove();
      question.comments.map(async (c) => {
        const comment = await Comment.findById(c);
        if (comment) await comment.remove();
      });
      return res.status(200).json({ message: "Question deleted successfully" });
    }

    return CustomErrorHandler.unAuthorized(
      "You are not authorized to delete this Question"
    );
  },

  // update the question
  update: async (req, res, next) => {
    const question = await Question.findById(req.params.id);

    if (!question) return res.status(404).json({ error: "Question not found" });

    if (req.user.isExpert || question.user === req.user._id) {
      const res = await question.updateOne({ $set: req.body }, { new: true });
      return res.status(200).json("The post has been updated");
    } else {
      return res.status(403).json("You can update only your posts");
    }
  },
  // upvote the question
  upvote: async (req, res, next) => {
    const question = await Question.findById(req.params.id);

    if (!question) return res.status(404).json({ error: "Question not found" });

    await question.updateOne({ _id: req.params.id }, { $push: { upVote: req.user._id } });
    return res.status(200).json("The post has been updated");
  },
  // downvote the question
  downvote: async (req, res, next) => {
    const question = await Question.findById(req.params.id);

    if (!question) return res.status(404).json({ error: "Question not found" });

    await question.updateOne({ _id: req.params.id }, { $push: { downVote: req.user._id } });
    return res.status(200).json("The post has been updated");
  },

  // Get all the Questions of a sigle user with its comments
  getAllQuestions: async (req, res, next) => {
    const questions = await Question.find().select("-_v");

    const questionWithComment = await Promise.all(
      questions.map(async (question) => {
        const cms = await Comment.find({ question: question._id });
        // console.log("comments", cms);
        question.comments = cms;
        const {
          _id,
          title,
          desc,
          upVote,
          downVote,
          user,
          comments,
          updatedAt,
          createdAt,
        } = question;

        return {
          _id,
          title,
          desc,
          upVote,
          downVote,
          user,
          comments,
          updatedAt,
          createdAt,
        };
      })
    );

    // const data = await comments.map((comment) => {});
    res.status(200).json(questionWithComment);
  },

  getQuestionsOfPerson: async (req, res, next) => {
    const questions = await Question.find({ user: req.user._id });

    const questionsWithComment = await Promise.all(
      questions.map(async (question) => {
        const cms = await Comment.find({ question: question._id });
        // console.log("comments", cms);
        question.comments = cms;
        const {
          _id,
          title,
          desc,
          upVote,
          downVote,
          user,
          comments,
          updatedAt,
          createdAt,
        } = question;

        return {
          _id,
          title,
          desc,
          upVote,
          downVote,
          user,
          comments,
          updatedAt,
          createdAt,
        };
      })
    );

    // const data = await comments.map((comment) => {});
    // console.log(questionsWithComment);
    res.status(200).json(questionsWithComment);
  },

  approve: async (req, res) => {
    const question = await Question.findById(req.body.id);

    if (req.user.isExpert) {
      if (!question.isApproved) {
        question.isApproved = true
        question.save()
        return res.status(200).json({ question, message: "Question Approved" })
      } else {
        return res.status(400).json({ question, message: "Question is already Approved" })
      }
    } else {
      return res.status(401).json({ question, message: "You are not authorized to approve the question" })
    }
  },

  getOne: async (req, res) => {
    try {
      const question = await Question.findOne({ _id: req.params.id })

      if (!question) return res.status(404).json({ message: "Question Not Found" })

      return res.status(200).json({ question, message: "Here is your message" })
    } catch (err) {
      return res.status(500).json({ error: "Something went wrong!!" })
    }
  },


  voteUp: async (req, res) => {
    try {
      console.log('upvote panel')
      const question = await Question.findById(req.query.id);

      if (!question) return res.status(404).json({ Error: "Question not found" })

      question.upVote.includes(req.user._id) ? question.upVote.push(req.user._id) : comment.upVote.filter(v => v !== req.user._id)

      question.save();
    } catch (err) {
      return res.status(500).json({ Error: "Opps!! Something went wrong." })
    }
  },

};
