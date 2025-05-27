import { startActivityTimer, stopActivityTimer } from '../frontend/activitytimer'; // adjust path if needed

jest.useFakeTimers();
global.fetch = jest.fn();
global.console.log = jest.fn(); // Optional: silence logs during test

describe('Activity Timer', () => {
  const userId = 42;

  beforeEach(() => {
    fetch.mockClear();
    stopActivityTimer(); // Reset timer
  });

  test('starts timer and fetches streak + awards XP after interval', async () => {
    // Mock streak response
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ streak: { data: 14 } }) // Multiplier should be 3
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ newPoints: 100 })
      });

    startActivityTimer(userId);

    // Fast-forward time by 15 minutes
    jest.advanceTimersByTime(15 * 60 * 1000);

    // Allow any pending promises to resolve
    await Promise.resolve();

    expect(fetch).toHaveBeenCalledWith(`/api/streak/${userId}`);
    expect(fetch).toHaveBeenCalledWith('/api/update-xp', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ userId, xp: 10 * 3 }) // base XP × multiplier
    }));
  });

  test('resets XP and clears timer on stop', () => {
    const clearSpy = jest.spyOn(global, 'clearInterval');
    startActivityTimer(userId);
    stopActivityTimer();
    expect(clearSpy).toHaveBeenCalled();
  });
});