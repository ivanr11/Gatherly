const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: { type: String, required: [true, "title is required"] },
  category: {
    type: String,
    required: [true, "category is required"],
    enum: ["food", "sports"],
  },
  host: { type: Schema.Types.ObjectId, ref: "User" },
  location: { type: String, required: [true, "location is required"] },
  start: { type: Date, required: [true, "start date is required"] },
  // end: { type: Date, required: [true, 'end date is required'] },
  details: {
    type: String,
    required: [true, "content is required"],
    minLength: [10, "the content should have at least 10 characters"],
  },
  image: { type: String, required: [true, "image is required"] },
});

module.exports = mongoose.model("Event", eventSchema);
