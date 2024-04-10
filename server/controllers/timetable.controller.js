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

    const timetableId = req.params.timetableId
    const sessionId = req.params.sessionId;
    const courseId = req.params.courseId;

    //validate session and course ids
    if (!mongoose.Types.ObjectId.isValid(timetableId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid ID(s)' });
    } else {

      //Retrieve course name
      const course = await Course.findById(courseId);

      let timetable = await TimeTable.findById(timetableId);

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      } else {
        const sessionindex = timetable.sessions.findIndex(
          (session) => session._id.equals(sessionId)
        );
        if (sessionindex === -1) {
          return "Class session does not exist in the timetable";
        }

        timetable.sessions[sessionindex].course = course._id;
        timetable.sessions[sessionindex].courseName = course.name;

        // Save the updated timetable
        await timetable.save();

        console.log("Timetable updated successfully");
        return "Timetable updated successfully";
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// export const createTimetable = async (req, res) => {
//   try {
//     const courseId = req.params.courseId;

//     // Validate course and faculty IDs
//     if (!mongoose.Types.ObjectId.isValid(courseId)) {
//       return res.status(400).json({ error: 'Invalid course ID' });
//     }

//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ error: 'Course not found' });
//     }

//     // Create the new timetable
//     const newTimetable = new TimeTable({
//       ...req.body,  // Include all remaining fields from the request body
//       course: course._id,
//       courseName: course.name,
//     });

//     await newTimetable.save();
//     res.status(201).json(newTimetable);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

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

