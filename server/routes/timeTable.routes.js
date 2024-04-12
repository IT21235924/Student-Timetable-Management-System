import express from 'express'
import protectRoute from '../utils/protectRoute.js'
import {createTimetable, assignCourse, deleteClassSession, getTimetablesByWeek, createSession} from '../controllers/timetable.controller.js'

const router = express.Router()

//create Timetable
router.post('/create', protectRoute, createTimetable);

//Creaate sessions in timetable
router.post("/timetables/:timetableId/sessions", createSession);

//Assign course
router.put('/:timetableId/:sessionId/assignCourse/:courseId', protectRoute, assignCourse);

//Find Timetable by week
router.get("/timetables/week/:week", getTimetablesByWeek);

//Delete Class sessions
router.delete("/:timetableId/class-sessions/:classSessionId", protectRoute, deleteClassSession);


export default router