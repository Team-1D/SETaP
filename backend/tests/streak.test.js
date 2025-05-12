const { getStreak, updateStreak } = require('../streak');
const { pool } = require('../database-pool');

jest.mock('../database-pool', () => {
  return {
    pool: {
      query: jest.fn()
    }
  };
});

describe('Streak functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //getStreak
  describe('getStreak', () => {
    test('returns streak count when found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ streak_count: 5 }] });

      const result = await getStreak(1);
      expect(result).toBe(5);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT streak_count'),
        [1]
      );
    });

    test('returns 0 when no streak is found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await getStreak(1);
      expect(result).toBe(0);
    });

    test('returns fallback object on error', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB error'));

      const result = await getStreak(1);
      expect(result).toEqual({ streak: 0, error: 'Failed to fetch streak' });
    });
  });

  //updateStreak
  describe('updateStreak', () => {
    test('does not update if already updated today', async () => {
      const today = new Date().toISOString().split('T')[0];

      pool.query.mockResolvedValueOnce({
        rows: [{ last_updated: today, streak_count: 3 }]
      });

      const result = await updateStreak(1);
      expect(result).toBe(3);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT last_updated'),
        [1]
      );
    });

    test('updates streak if not updated today', async () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      pool.query
        .mockResolvedValueOnce({
          rows: [{ last_updated: yesterday }]
        })
        .mockResolvedValueOnce({
          rows: [{ streak_count: 4 }]
        });

      const result = await updateStreak(1);
      expect(result).toBe(4);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE streaks'),
        [1]
      );
    });

    test('returns 0 if update fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB error'));

      const result = await updateStreak(1);
      expect(result).toBe(0);
    });
  });
});