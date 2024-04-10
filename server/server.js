import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js'
import courseRoutes from './routes/course.routes.js'
import facultyRoutes from './routes/faculty.routes.js'
import timeTableRoutes from './routes/timeTable.routes.js'

import connectToMongoDB from './db/connectToMongoDB.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())

//Routes
app.use('/api/auth', authRoutes) 
app.use('/api/courses', courseRoutes)
app.use('/api/faculty', facultyRoutes)
app.use('/api/timetable', timeTableRoutes)

app.listen(PORT, () => {
    connectToMongoDB()
    console.log(`Server is running on port ${PORT}`)
})

