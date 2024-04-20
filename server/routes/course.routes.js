import express from 'express'
import {createCourse, getCourses, getCourseById, updateCourse, deleteCourse} from '../controllers/course.controller.js'
import protectRoute from '../utils/protectRoute.js'

const router = express.Router()

// Create new course
router.post('/create',protectRoute, createCourse);

// Get all courses
router.get('/', getCourses);

// Get a single course by ID
router.get('/:id', getCourseById);

// Update a course by ID
router.put('/:id',protectRoute, updateCourse);

// Delete a course by ID
router.delete('/:id',protectRoute, deleteCourse);




export default router