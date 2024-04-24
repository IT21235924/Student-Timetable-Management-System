import Course from '../models/course.model.js'

// Create a new course
export const createCourse = async (req, res) => {
    try {

      //validate admin
      const userRole = req.user.role
      if(userRole != "Admin"){
        return res.status(500).json({error: 'Unauthorized'})
      }
      const newCourse = await Course.create({
        ...req.body
      });
      res.status(201).json(newCourse);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid course ID' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a course by ID
export const updateCourse = async (req, res) => {
  try {

    //validate admin
    const userRole = req.user.role
    if(userRole != "Admin"){
      return res.status(500).json({error: 'Unauthorized'})
    }
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated course
    );
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json(updatedCourse);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid course ID' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a course by ID
export const deleteCourse = async (req, res) => {
  try {

    //validate admin
    const userRole = req.user.role
    if(userRole != "Admin"){
      return res.status(500).json({error: 'Unauthorized'})
    }
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid course ID' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

