import TimeTable from '../models/timeTable.model.js'
import Course from '../models/course.model.js';
import Notification from '../models/notification.model.js';
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

//Create session in timtable
export const createSession = async (req, res) => {
  try {
    const timetableId = req.params.timetableId;
    const { time, location } = req.body;

    // Validate timetable ID
    if (!mongoose.Types.ObjectId.isValid(timetableId)) {
      return res.status(400).json({ error: 'Invalid timetable ID' });
    }

    // Find the timetable
    const timetable = await TimeTable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable not found' });
    }

    // Create a new session object
    const newSession = {
      time,
      location,
    };

    // Add the new session to the timetable's sessions array
    timetable.sessions.push(newSession);

    // Save the updated timetable
    await timetable.save();

    res.status(201).json({ message: 'Session created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
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

    // Retrieve course details
    const course = await Course.findById(courseId).select('name'); // Select only the 'name' field
    const courseCode = await Course.findById(courseId).select('code');

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

    //Notification 
    const message = "Session assigned for " + course.name + "(" + courseCode.code + ")";
    const newNotification = new Notification({message});
    await newNotification.save();


    return res.status(200).json({ message: 'Course assigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

//Find Timetable using week
export const getTimetablesByWeek = async (req, res) => {
  try {
    const week = parseInt(req.params.week); // Parse the week parameter as an integer
    if (isNaN(week)) {
      return res.status(400).json({ error: 'Invalid week parameter' });
    }

    const timetables = await TimeTable.find({ week });

    if (!timetables.length) {
      return res.status(204).json({ message: 'No timetables found for this week' });
    }

    res.status(200).json({ timetables });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

//Update Session
export const updateSession = async (req, res) => {
  try {
    const timetableId = req.params.timetableId;
    const sessionId = req.params.sessionId;
    const { time, location } = req.body; // Destructure updated session data

    // Validate timetable ID and session ID
    if (!mongoose.Types.ObjectId.isValid(timetableId) || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: 'Invalid timetable ID or session ID' });
    }

    // Find the timetable
    const timetable = await TimeTable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable not found' });
    }

    // Find the session index using the populated sessions array (optional)
    const sessionIndex = timetable.sessions.findIndex(session => session._id.equals(sessionId));

    // Check if session exists
    if (sessionIndex === -1) {
      return res.status(404).json({ error: 'Session not found in the timetable' });
    }

    // Update the session details
    timetable.sessions[sessionIndex] = {
      ...timetable.sessions[sessionIndex], // Preserve existing properties
      time,
      location,
    };

    // Save the updated timetable
    await timetable.save();

    res.status(200).json({ message: 'Session updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

//Update Timetable
export const updateTimetable = async (req, res) => {
  try {
    const timetableId = req.params.timetableId;
    const { week, date } = req.body; // Destructure updated properties

    // Validate timetable ID
    if (!mongoose.Types.ObjectId.isValid(timetableId)) {
      return res.status(400).json({ error: 'Invalid timetable ID' });
    }

    // Find the timetable
    const timetable = await TimeTable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable not found' });
    }

    // Update the week and date (optional validation)
    timetable.week = week;
    timetable.date = date;

    // Save the updated timetable
    await timetable.save();

    res.status(200).json({ message: 'Timetable updated successfully' });
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

    res.status(200).json({ message: 'Class Session deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

//Delete Timetable 
export const deleteTimetable = async (req, res) => {
  try {
    const timetableId = req.params.timetableId;

    // Validate timetable ID
    if (!mongoose.Types.ObjectId.isValid(timetableId)) {
      return res.status(400).json({ error: 'Invalid timetable ID' });
    }

    // Find and delete the timetable
    await TimeTable.findByIdAndDelete(timetableId);

    res.status(204).json({ message: 'Timetable deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

