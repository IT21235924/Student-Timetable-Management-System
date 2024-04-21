import getAllResources from '../controllers/resource.controller';
import mockResourceModel from '../models/resource.model';

jest.mock('../models/resource.model'); // Mock the Resource model

describe('getAllResources controller', () => {
  test('should retrieve all resources', async () => {
    const mockReq = {}; // Empty request object (not used in this function)
    const mockRes = { status: jest.fn(), json: jest.fn() };

    const mockResources = [
      { name: 'Resource 1' },
      { name: 'Resource 2' },
    ];
    mockResourceModel.find.mockResolvedValueOnce(mockResources);

    await getAllResources(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200); // Expect 200 OK status
    expect(mockRes.json).toHaveBeenCalledWith(mockResources); // Expect retrieved resources
  });

  test('should handle errors during resource retrieval', async () => {
    const mockReq = {}; // Empty request object (not used in this function)
    const mockRes = { status: jest.fn(), json: jest.fn() };

    const mockError = new Error('Unexpected error');
    mockResourceModel.find.mockRejectedValueOnce(mockError);

    await getAllResources(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500); // Expect 500 Internal Server Error
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Server error" }); // Expect generic error message
  });
});
