import express from 'express'
import protectRoute from '../utils/protectRoute.js'
import {createClassroom, getAllClassrooms, getClassroomByNumber, getAvailableClassrooms, updateClassroom, deleteClassroom, bookClassroom} from '../controllers/classroom.controller.js'

const router = express.Router()

//Create new classroom
router.post("/",protectRoute, createClassroom);

//get all classrooms
router.get("/",protectRoute, getAllClassrooms);

//Get class rooms by number
router.get("/:number",protectRoute, getClassroomByNumber);

//Get available classrooms
router.get("/available",protectRoute, getAvailableClassrooms);

//Update classroom
router.put("/:id",protectRoute, updateClassroom);

//delete classrrom
router.delete("/:id",protectRoute, deleteClassroom);

//Book classroom
router.put("/:id/book",protectRoute, bookClassroom);

export default router