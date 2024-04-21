import createFaculty from '../controllers/faculty.controller';
import mockFacultyModel from '../models/faculty.model';

jest.mock('../models/faculty.model'); // Mock the Faculty model

describe('createFaculty controller', () => {
  test('should create a new faculty for authorized Admin', async () => {
    const mockReq = {
      user: { role: 'Admin' }, // Mock authorized user
      body: { name: 'John Doe', department: 'Computer Science' },
    };
    const mockRes = { status: jest.fn(), json: jest.fn() };

    const mockNewFaculty = { ...mockReq.body }; // Mock created faculty object
    mockFacultyModel.create.mockResolvedValueOnce(mockNewFaculty);

    await createFaculty(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201); // Expect 201 Created status
    expect(mockRes.json).toHaveBeenCalledWith(mockNewFaculty); // Expect created faculty object
  });

  test('should return unauthorized error for non-Admin users', async () => {
    const mockReq = {
      user: { role: 'Student' }, // Mock non-Admin user
      body: { name: 'John Doe', department: 'Computer Science' },
    };
    const mockRes = { status: jest.fn(), json: jest.fn() };

    await createFaculty(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500); // Expect 500 Internal Server Error (modified for unauthorized access)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' }); // Expect unauthorized error message
  });

  test('should handle errors during faculty creation', async () => {
    const mockReq = {
      user: { role: 'Admin' }, // Mock authorized user
      body: { name: 'John Doe', department: 'Computer Science' },
    };
    const mockRes = { status: jest.fn(), json: jest.fn() };

    const mockError = new Error('Unexpected error');
    mockFacultyModel.create.mockRejectedValueOnce(mockError);

    await createFaculty(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400); // Expect 400 Bad Request
    expect(mockRes.json).toHaveBeenCalledWith({ error: mockError.message }); // Expect error message from exception
  });
});
