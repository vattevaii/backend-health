const Question = require("../models/Question");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");
const CustomErrorHandler = require("../services/CustomErrorHandler");

module.exports = {
  // Create new question
  create: async (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.body.question);
    const question = await Question.findOne({ _id: id });

    if (!question) return CustomErrorHandler.notFound("Question Not Found");
    const comment = new Comment({
      comment: req.body.comment,
      question: req.body.question,
      user: req.user._id,
    });

    question.comments.push(comment._id);
    await question.save();

    const savedComment = await comment.save();
    return res.status(200).json(savedComment);
  },

  // Delete the question
  delete: async (req, res, next) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return next(CustomErrorHandler.notFound("Comment not found"));

    if (req.user.isExpert || comment.user === req.user._id) {
      const question = await Question.findById(comment.question);

      var index = question.comments.indexOf(comment._id);
      let comments;
      if (index !== -1) {
        comments = question.comments.splice(index, 1);
      }
      // let index = question.comments.indexOf(req.params.id);
      // const comments = question.comments.splice(index, 1);
      // console.log("comments", comments);
      // question.comments = comments;
      // console.log("question", question);
      await Question.updateOne(
        { _id: comment.question },
        { comments },
        { new: true }
      );

      await comment.remove();
      return res.status(200).json({ message: "Comment deleted successfully" });
    }

    return CustomErrorHandler.unAuthorized(
      "You are not authorized to delete this Comment"
    );
  },

  // update the comment
  update: async (req, res, next) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (req.user.isExpert || comment.user === req.user._id) {
      await comment.updateOne({ $set: req.body }, { new: true });
      return res.status(200).json("The comment has been updated");
    } else {
      return res.status(403).json("You can update only your comments");
    }
  },

  // Get all the Questions of a sigle user with its comments
  getAllComments: async (req, res, next) => {
    const comments = await Comment.find().select("-_v");

    const questionWithComment = await Promise.all(
      comments.map(async (c) => {
        const question = await Question.findOne({ _id: c.question });
        const { title, desc, upVote, downVote, user } = question;
        const {
          comment,
          upVote: cUpVote,
          downVote: cDownVote,
          isApproved,
          updatedAt,
          createdAt,
        } = c;

        return {
          title,
          desc,
          upVote,
          downVote,
          user,
          comment,
          cUpVote,
          cDownVote,
          isApproved,
          updatedAt,
          createdAt,
        };
      })
    );

    // const data = await comments.map((comment) => {});
    res.status(200).json(questionWithComment);
  },

  getCommentsOfQuestion: async (req, res, next) => {
    try {
      console.log('comments got here')
      const question = await Question.findById(req.query.qid);

      if (!question) return CustomErrorHandler.notFound("Question Not Found");

      const comments = await Comment.find({ question: req.params.qid });
      console.log('comments ', comments)

      return res.status(200).json({ comments, message: "Comments got successfully" });
    } catch (err) {
      return res.status(500).json({ Error: "Opps!! Something went wrong." })
    }
  },

  voteUp: async (req, res) => {
    try {
      console.log('upvote panel')
      const comment = await Comment.findById(req.query.id);

      if (!comment) return res.status(404).json({ Error: "Comment not found" })

      comment.upVote.includes(req.user._id) ? comment.upVote.push(req.user._id) : comment.upVote.filter(v => v !== req.user._id)

      comment.save();
    } catch (err) {
      return res.status(500).json({ Error: "Opps!! Something went wrong." })
    }
  },

  downvote: async (req, res) => {
    try {
      console.log('downvote panel')
      const comment = await Comment.findById(req.query.id);

      if (!comment) return res.status(404).json({ Error: "Comment not found" })

      comment.upVote.includes(req.user._id) ? comment.upVote.push(req.user._id) : comment.upVote.filter(v => v !== req.user._id)

      comment.save();
    } catch (err) {
      return res.status(500).json({ Error: "Opps!! Something went wrong." })
    }
  }
};
