import TimeTable from '../models/timeTable.model.js'
import Course from '../models/course.model.js';
import mongoose from 'mongoose';

//Create Weekly Time table 
export const createTimetable = async (req, res) => {
  try {
    const newTimetable = new TimeTable(req.body);
    await newTimetable.save();
    res.status(201).json(newTimetable);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

//Assign Course to the session
export const assignCourse = async (req, res) => {
  try {
    const timetableId = req.params.timetableId;
    const sessionId = req.params.sessionId;
    const courseId = req.params.courseId;

    // Validate session and course IDs
    if (!mongoose.Types.ObjectId.isValid(timetableId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid ID(s)' });
    }

    // Retrieve course details (including name)
    const course = await Course.findById(courseId).select('name'); // Select only the 'name' field

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Find the timetable and session
    let timetable = await TimeTable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable not found' });
    }

    const sessionIndex = timetable.sessions.findIndex(session => session._id.equals(sessionId));
    if (sessionIndex === -1) {
      return res.status(404).json({ error: 'Class session does not exist in the timetable' });
    }

    // Update the session with course details
    timetable.sessions[sessionIndex].course = course._id;
    timetable.sessions[sessionIndex].courseName = course.name;

    // Save the updated timetable and return a success message
    await timetable.save();

    return res.status(200).json({ message: 'Course assigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

//Delete  Class session by id
export const deleteClassSession = async (req, res) => {
  try {
    const classSessionId = req.params.classSessionId;

    if (!mongoose.Types.ObjectId.isValid(classSessionId)) {
      return res.status(400).json({ error: 'Invalid Class Session ID' });
    }

    const timetable = await TimeTable.findByIdAndUpdate(
      req.params.timetableId, // Modify the timetable based on the provided ID
      { $pull: { sessions: { _id: classSessionId } } }, // Remove the session using the pull operator
      { new: true } // Return the updated timetable
    );

    if (!timetable) {
      return res.status(404).json({ error: 'Timetable not found' });
    }

    if (!timetable.sessions.find(session => session._id.equals(classSessionId))) {
      return res.status(404).json({ error: 'Class Session not found in the timetable' });
    }

    res.status(200).json({ message: 'Class Session deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



//Get Weekly Time Table by Date
export const getTimetableByDate = async (req, res) => {
  try {
    const timetable = await TimeTable.findOne({ date: req.params.date })
      .populate('sessions.course sessions.faculty'); // Populate course and faculty details (optional)
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable not found' });
    }
    res.status(200).json(timetable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Time table
export const updateTimetable = async (req, res) => {
  try {
    const updatedTimetable = await TimeTable.findOneAndUpdate(
      { date: req.params.date },
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedTimetable) {
      return res.status(404).json({ error: 'Timetable not found' });
    }
    res.status(200).json(updatedTimetable);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

//Delete time table 
export const deleteTimetable = async (req, res) => {
  try {
    const deletedTimetable = await TimeTable.findOneAndDelete({ date: req.params.date });
    if (!deletedTimetable) {
      return res.status(404).json({ error: 'Timetable not found' });
    }
    res.status(200).json({ message: 'Timetable deleted' });
  } catch (err) {
    // Handle potential errors more specifically
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

