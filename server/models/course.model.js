import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty', // Reference the Faculty model
    },
    facultyName: {
      type: String,
    }
  });

  const Course = mongoose.model("Course", CourseSchema);
  export default Course;
  