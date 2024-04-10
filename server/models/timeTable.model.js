import mongoose from "mongoose";

const ClassSession = new mongoose.Schema({

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference the Course model
  },
  courseName: {
    type: String,
  },
  time: {
    type: String, // Consider using a time format library (e.g., moment.js)
  },
  location: {
    type: String,
  },

});

const TimetableSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true,
  },
  Date: {
    type: Date,
    // required: true,
  },
  sessions: [ ClassSession ],
});

const TimeTable = mongoose.model("TimeTable", TimetableSchema);
export default TimeTable;