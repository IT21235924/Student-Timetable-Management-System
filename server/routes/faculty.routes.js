import express from 'express'
import protectRoute from '../utils/protectRoute.js'
import {createFaculty, assignFaculty} from '../controllers/faculty.controller.js'

const router =express.Router()

//Create New Faculty
router.post('/create', protectRoute, createFaculty);

// Assign Faculty for course
router.put('/:courseId/assignFaculty/:facultyId', protectRoute, assignFaculty);

export default router
