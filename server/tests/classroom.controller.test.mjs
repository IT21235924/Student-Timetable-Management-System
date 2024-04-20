// const createClassroom = require('./classroom.controller'); // Replace with your path
// const mockClassroomModel = require('../models/classroom.model'); // Mock Classroom model
// const mockNotificationModel = require('../models/notification.model'); // Mock Notification model

import createClassroom from '../controllers/classroom.controller';
import mockClassroomModel from '../models/classRoom.model';
import mockNotificationModel from '../models/notification.model';


jest.mock('../models/classroom.model');
jest.mock('../models/notification.model'); // Mock both models

describe('createClassroom controller', () => {
  test('should create a new classroom for authorized Admin', async () => {
    const mockReq = {
      user: { role: 'Admin' }, // Mock authorized user
      body: { type: 'Lecture Hall', number: 101, Capacity: 50 },
    };
    const mockRes = { status: jest.fn(), json: jest.fn() };

    mockClassroomModel.save.mockResolvedValueOnce({}); // Mock successful classroom save
    mockNotificationModel.save.mockResolvedValueOnce({}); // Mock successful notification save

    await createClassroom(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201); // Expect 201 Created status
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Classroom created successfully" }); // Expect success message
  });

  test('should return unauthorized error for non-Admin users', async () => {
    const mockReq = {
      user: { role: 'Student' }, // Mock non-Admin user
      body: { type: 'Lecture Hall', number: 101, Capacity: 50 },
    };
    const mockRes = { status: jest.fn(), json: jest.fn() };

    await createClassroom(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500); // Expect 500 Internal Server Error (modified for unauthorized access)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' }); // Expect unauthorized error message
  });

  test('should handle duplicate classroom number error', async () => {
    const mockReq = {
      user: { role: 'Admin' }, // Mock authorized user
      body: { type: 'Lecture Hall', number: 101, Capacity: 50 },
    };
    const mockRes = { status: jest.fn(), json: jest.fn() };

    const mockError = new Error('E11000 duplicate key error collection: classrooms');
    mockError.code = 11000; // Set mock error code for duplicate key

    mockClassroomModel.save.mockRejectedValueOnce(mockError); // Mock save rejection with duplicate error

    await createClassroom(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400); // Expect 400 Bad Request
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Classroom number already exists" }); // Expect specific error message
  });

  test('should handle other errors during classroom creation', async () => {
    const mockReq = {
      user: { role: 'Admin' }, // Mock authorized user
      body: { type: 'Lecture Hall', number: 101, Capacity: 50 },
    };
    const mockRes = { status: jest.fn(), json: jest.fn() };

    const mockError = new Error('Unexpected error');
    mockClassroomModel.save.mockRejectedValueOnce(mockError); // Mock save rejection with generic error

    await createClassroom(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500); // Expect 500 Internal Server Error
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Server error" }); // Expect generic error message
  });
});