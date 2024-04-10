import express from 'express'
import protectRoute from '../utils/protectRoute.js'
import {createTimetable, getTimetableByDate, updateTimetable, deleteTimetable, assignCourse} from '../controllers/timetable.controller.js'

const router = express.Router()

//create Timetable
router.post('/create', protectRoute, createTimetable);

//Assign course
router.put('/:timetableId/:sessionId/assignCourse/:courseId', protectRoute, assignCourse);

//Get Timetable by date
router.get('/:date', protectRoute, getTimetableByDate);

//Update timetable
router.put('/:date', protectRoute, updateTimetable);

//Delete Timetable
router.post('/:date', protectRoute, deleteTimetable);

export default router