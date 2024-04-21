import getTimetablesByWeek from '../controllers/timetable.controller';
import mockTimeTableModel from '../models/timeTable.model';

jest.mock('../models/timetable.model'); // Mock the TimeTable model

describe('getTimetablesByWeek controller', () => {
  test('should retrieve timetables for a valid week number', async () => {
    const mockReq = { params: { week: 1 } }; // Mock request with valid week
    const mockRes = { status: jest.fn(), json: jest.fn() };

    const mockTimetables = [
      { week: 1, classes: [] }, // Example timetable object
    ];
    mockTimeTableModel.find.mockResolvedValueOnce(mockTimetables);

    await getTimetablesByWeek(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200); // Expect 200 OK status
    expect(mockRes.json).toHaveBeenCalledWith({ timetables: mockTimetables }); // Expect retrieved timetables
  });

  test('should return 400 for invalid week parameter (non-numeric)', async () => {
    const mockReq = { params: { week: 'invalid' } }; // Mock request with invalid week
    const mockRes = { status: jest.fn(), json: jest.fn() };

    await getTimetablesByWeek(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400); // Expect 400 Bad Request
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid week parameter' }); // Expect error message
  });

  test('should return 204 for no timetables found for a week', async () => {
    const mockReq = { params: { week: 2 } }; // Mock request with a week without timetables
    const mockRes = { status: jest.fn(), json: jest.fn() };

    mockTimeTableModel.find.mockResolvedValueOnce([]); // Mock empty timetables

    await getTimetablesByWeek(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(204); // Expect 204 No Content
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'No timetables found for this week' }); // Expect message
  });

  test('should handle errors during timetable retrieval', async () => {
    const mockReq = { params: { week: 1 } }; // Mock request with valid week
    const mockRes = { status: jest.fn(), json: jest.fn() };

    const mockError = new Error('Unexpected error');
    mockTimeTableModel.find.mockRejectedValueOnce(mockError);

    await getTimetablesByWeek(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500); // Expect 500 Internal Server Error
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' }); // Expect generic error message
  });
});