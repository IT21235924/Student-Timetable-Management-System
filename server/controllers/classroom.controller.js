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

  //get all classrooms
  export const getAllClassrooms = async (req, res) => {
    try {
      const classrooms = await Classroom.find();
      res.status(200).json(classrooms);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };

  //Get class rooms by number
  export const getClassroomByNumber = async (req, res) => {
    try {
      const classroomNumber = req.params.number;
  
      const classroom = await Classroom.findOne({ number: classroomNumber });
      if (!classroom) {
        return res.status(404).json({ error: "Classroom not found" });
      }
      res.status(200).json(classroom);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };

  //Get available classrooms
  export const getAvailableClassrooms = async (req, res) => {
    try {
      console.log('Querying available classrooms...');
      const availableClassrooms = await Classroom.find({ Availability: true });
      console.log('Available classrooms:', availableClassrooms);
      if (availableClassrooms.length === 0) {
        console.log('No available classrooms found');
        return res.status(404).json({ message: 'No available classrooms found' });
      }
      res.status(200).json(availableClassrooms);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  //Update classroom
  export const updateClassroom = async (req, res) => {
    try {
      const classroomID = req.params.id;
      const { type, Capacity, Availability } = req.body;
  
      const classroom = await Classroom.findOneAndUpdate(
        { _id: classroomID },
        { $set: { type, Capacity, Availability } },
        { new: true } // Return the updated document
      );
  
      if (!classroom) {
        return res.status(404).json({ error: "Classroom not found" });
      }
      res.status(200).json({ message: "Classroom updated successfully", classroom });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };

  //delete classrrom
  export const deleteClassroom = async (req, res) => {
    try {
      const classroomId = req.params.id;
  
      const classroom = await Classroom.findOneAndDelete({ _id: classroomId });
      if (!classroom) {
        return res.status(404).json({ error: "Classroom not found" });
      }
  
      res.status(200).json({ message: "Classroom deleted successfully" });
    } catch (err) {
      console.error(err);
      // Handle potential errors like deletion failures
      if (err.code === 400) { // Mongoose cast error (e.g., invalid classroom number)
        return res.status(400).json({ error: "Invalid classroom number" });
      }
      res.status(500).json({ error: "Server error" });
    }
  };

  //Book classroom
  export const bookClassroom = async (req, res) => {
    try {
      const classroomId = req.params.id;
  
      const classroom = await Classroom.findOne({ _id: classroomId });
      if (!classroom) {
        return res.status(404).json({ error: "Classroom not found" });
      }
  
      if (!classroom.Availability) {
        return res.status(409).json({ error: "Classroom is already booked" });
      }
  
      classroom.Availability = false; // Update availability
      await classroom.save();
  
      res.status(200).json({ message: "Classroom booked successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };