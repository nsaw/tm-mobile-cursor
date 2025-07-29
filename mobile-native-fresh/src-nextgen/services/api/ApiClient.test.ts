import { ApiClient } from './ApiClient';

// Mock fetch
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient({
      baseURL: 'https://api.example.com',
      timeout: 5000,
    });
    jest.clearAllMocks();
  });

  it('should make GET request successfully', async () => {
    const mockResponse = { data: 'test', status: 200 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    } as Response);

    const result = await apiClient.get('/test');

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should make POST request with data', async () => {
    const mockResponse = { id: 1, name: 'test' };
    const postData = { name: 'test' };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => mockResponse,
    } as Response);

    const result = await apiClient.post('/test', postData);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(postData),
      })
    );
  });

  it('should handle API errors', async () => {
    const errorResponse = { message: 'Not found' };
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => errorResponse,
    } as Response);

    await expect(apiClient.get('/test')).rejects.toMatchObject({
      code: 'API_ERROR',
      message: 'Not found',
    });
  });

  it('should retry on 5xx errors', async () => {
    const successResponse = { data: 'success' };

    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => successResponse,
      } as Response);

    const result = await apiClient.get('/test');

    expect(result.success).toBe(true);
    expect(result.data).toEqual(successResponse);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should set auth token', () => {
    const token = 'test-token';
    apiClient.setAuthToken(token);

    expect(apiClient['defaultHeaders'].Authorization).toBe(`Bearer ${token}`);
  });

  it('should remove auth token', () => {
    apiClient.setAuthToken('test-token');
    apiClient.removeAuthToken();

    expect(apiClient['defaultHeaders'].Authorization).toBeUndefined();
  });
}); 