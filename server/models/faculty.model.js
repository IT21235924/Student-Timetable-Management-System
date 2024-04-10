import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  });

  const Faculty = mongoose.model("Faculty", FacultySchema);
  export default Faculty;