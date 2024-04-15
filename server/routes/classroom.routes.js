import express from 'express'
import protectRoute from '../utils/protectRoute.js'
import {createClassroom, getAllClassrooms, getClassroomByNumber, getAvailableClassrooms, updateClassroom, deleteClassroom, bookClassroom} from '../controllers/classroom.controller.js'

const router = express.Router()

//Create new classroom
router.post("/", createClassroom);

//get all classrooms
router.get("/", getAllClassrooms);

//Get class rooms by number
router.get("/:number", getClassroomByNumber);

//Get available classrooms
router.get("/available", getAvailableClassrooms);

//Update classroom
router.put("/:id", updateClassroom);

//delete classrrom
router.delete("/:id", deleteClassroom);

//Book classroom
router.put("/:id/book", bookClassroom);

export default router