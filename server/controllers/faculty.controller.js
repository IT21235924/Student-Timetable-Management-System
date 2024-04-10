import Faculty from "../models/faculty.model.js";
import Course from "../models/course.model.js";
import mongoose from "mongoose";

//Create a new faculty
export const createFaculty = async (req, res) => {
    try {
        const userRole = req.user.role
        if (userRole != "Admin") {
            return res.status(500).json({ error: 'Unauthorized' })
        }
        const newFaculty = await Faculty.create({
            ...req.body
        });
        res.status(201).json(newFaculty);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

// Assign Faculty to the course
export const assignFaculty = async (req, res) => {
    try {

        const userRole = req.user.role
        if (userRole != "Admin") {
            return res.status(500).json({ error: 'Unauthorized' })
        }

        const courseId = req.params.courseId;
        const facultyId = req.params.facultyId;

        // Validate course and faculty IDs
        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(facultyId)) {
            return res.status(400).json({ error: 'Invalid ID(s)' });
        }

        // Retrieve faculty name
        const faculty = await Faculty.findById(facultyId);

        if (!faculty) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        const course = await Course.findByIdAndUpdate(
            courseId,
            {
                faculty: faculty._id, // Use the faculty's _id (usually an ObjectId)
                facultyName: faculty.name, // Add a separate field for the name
            },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};