const { getLeaderboard, getUser, updateUserPoints } = require('../backend/leaderboardController'); 
const { pool } = require('../backend/database-pool'); 

jest.mock('../backend/database-pool', () => ({
  pool: { query: jest.fn() }
}));

function createMockRes() {
  return {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };
}

afterEach(() => jest.clearAllMocks());

//getLeaderboard
describe('getLeaderboard', () => {
  test('responds with leaderboard rows', async () => {
    const mockRes = createMockRes();
    const mockRows = [
      { user_id: 1, user_nickname: 'Alice', user_points: 100, user_rank: 1 },
      { user_id: 2, user_nickname: 'Bob', user_points: 90, user_rank: 2 }
    ];
    pool.query.mockResolvedValueOnce({ rows: mockRows });

    await getLeaderboard({}, mockRes);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith(mockRows);
  });

  test('ensures users are sorted by points and ranks are correct', async () => {
    const mockRes = createMockRes();
    const mockRows = [
      { user_id: 1, user_nickname: 'Alice', user_points: 300, user_rank: 1 },
      { user_id: 2, user_nickname: 'Bob', user_points: 200, user_rank: 2 },
      { user_id: 3, user_nickname: 'Charlie', user_points: 100, user_rank: 3 }
    ];
    pool.query.mockResolvedValueOnce({ rows: mockRows });

    await getLeaderboard({}, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(mockRows);
    const result = mockRes.json.mock.calls[0][0];

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(3);

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].user_points).toBeGreaterThanOrEqual(result[i + 1].user_points);
      expect(result[i].user_rank).toBe(i + 1);
    }
  });

  test('handles DB errors', async () => {
    const mockRes = createMockRes();
    pool.query.mockRejectedValueOnce(new Error('DB fail'));

    await getLeaderboard({}, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'DB fail' });
  });
});

//get user
describe('getUser', () => {
  test('returns a single user', async () => {
    const mockUser = {
      user_id: 1,
      user_nickname: 'Test',
      user_points: 42,
      user_rank: 5
    };
    pool.query.mockResolvedValueOnce({ rows: [mockUser] });

    const result = await getUser(1);

    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('FROM users WHERE user_id'), [1]);
    expect(result).toEqual(mockUser);
  });
});

//update points
describe('updateUserPoints', () => {
  test('updates and returns the user', async () => {
    const mockReq = {
      params: { id: '1' },
      body: { user_points: 99 }
    };
    const mockRes = createMockRes();

    const updatedUser = {
      user_id: 1,
      user_nickname: 'Test',
      user_points: 99
    };

    pool.query.mockResolvedValueOnce({ rows: [updatedUser] });

    await updateUserPoints(mockReq, mockRes);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE users SET user_points'),
      [99, '1']
    );
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'User points updated successfully',
      user: updatedUser
    });
  });

  test('returns 404 when no user found', async () => {
    const mockReq = {
      params: { id: '999' },
      body: { user_points: 123 }
    };
    const mockRes = createMockRes();

    pool.query.mockResolvedValueOnce({ rows: [] });

    await updateUserPoints(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('handles DB errors', async () => {
    const mockReq = {
      params: { id: '1' },
      body: { user_points: 123 }
    };
    const mockRes = createMockRes();

    pool.query.mockRejectedValueOnce(new Error('DB error'));

    await updateUserPoints(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'DB error' });
  });
});