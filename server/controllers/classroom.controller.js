import Classroom from '../models/classRoom.model.js'

//Create new classroom
export const createClassroom = async (req, res) => {
    try {
      const { type, number, Capacity } = req.body;
  
      const newClassroom = new Classroom({ type, number, Capacity });
  
      await newClassroom.save();
      res.status(201).json({ message: "Classroom created successfully" });
    } catch (err) {
      console.error(err);
      // Handle potential errors like duplicate classroom number (unique constraint)
      if (err.code === 11000) {
        return res.status(400).json({ error: "Classroom number already exists" });
      }
      res.status(500).json({ error: "Server error" });
    }
  };