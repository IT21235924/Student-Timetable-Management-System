import express from 'express'
import protectRoute from '../utils/protectRoute.js'
import {createClassroom} from '../controllers/classroom.controller.js'

const router = express.Router()

//Create new classroom
router.post("/", createClassroom);

export default router