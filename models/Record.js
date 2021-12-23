const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema(
  {
    // Type : immune - corona
    type: {
      type: String,
      required: true,
    },
    vaccine: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    recordImage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: true,
    },
    // Record belongs to the below person
    person: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    // Record created by below expert
    expert: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Record", RecordSchema);
