const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      email: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    isExpert: {
      type: Boolean,
      default: false,
    },
    person: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    // This vaccine is for - your children or yourself
    isParent: {
      type: Boolean,
      default: false,
    },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
