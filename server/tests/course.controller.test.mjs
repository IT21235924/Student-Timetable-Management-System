// const createCourse = require('../controllers/course.controller.js');
// const mockCourseModel = require('../models/course.model'); // Mock Course model
import createCourse from '../controllers/course.controller.js'
import mockCourseModel from '../models/course.model.js'


jest.mock('../models/course.model'); // Mock the Course model

describe('createCourse controller', () => {
  test('should create a new course for authorized Admin', async () => {
    const mockReq = {
      user: { role: 'Admin' }, // Mock authorized user
      body: { name: 'Test Course', description: 'A test course description' },
    };
    const mockRes = { status: jest.fn(), json: jest.fn() };

    mockCourseModel.create.mockResolvedValueOnce({ name: 'Test Course', description: 'A test course description' }); // Mock successful creation

    await createCourse(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201); // Expect 201 Created status
    expect(mockRes.json).toHaveBeenCalledWith({ name: 'Test Course', description: 'A test course description' }); // Expect created course returned
  });

  test('should return unauthorized error for non-Admin users', async () => {
    const mockReq = {
      user: { role: 'Student' }, // Mock non-Admin user
      body: { name: 'Test Course', description: 'A test course description' },
    };
    const mockRes = { status: jest.fn(), json: jest.fn() };

    await createCourse(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500); // Expect 500 Internal Server Error (modified for unauthorized access)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' }); // Expect unauthorized error message
  });

  test('should handle errors during course creation', async () => {
    const mockReq = {
      user: { role: 'Admin' }, // Mock authorized user
      body: { name: 'Test Course', description: 'A test course description' },
    };
    const mockRes = { status: jest.fn(), json: jest.fn() };

    const mockError = new Error('Course creation failed');
    mockCourseModel.create.mockRejectedValueOnce(mockError); // Mock creation error

    await createCourse(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400); // Expect 400 Bad Request
    expect(mockRes.json).toHaveBeenCalledWith({ error: mockError.message }); // Expect error message from the exception
  });
});