import '@testing-library/jest-dom';

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockReset();

  document.body.innerHTML = `
    <img id="profile-pic" />
    <span id="username-display"></span>
    <span id="username-display-field"></span>
    <span id="email-display-field"></span>
    <span id="points-value"></span>
    <span id="streak-value"></span>
    <span id="leaderboard-position"></span>
  `;
});

// Import the functions from script
import {
  loadUserData,
  loadUserPoints,
  loadStreak,
  loadLeaderboardPosition
} from '../frontend/accountPage'; 

describe('loadUserData', () => {
  test('updates DOM with user data', async () => {
    const mockUser = {
      profile_pic_url: '/pfp/haley.png',
      user_nickname: 'Abby',
      email: 'hello@example.com',
      user_points: 88
    };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockUser });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ streak: 3 }) });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ user_id: 5 }, { user_id: 1 }]
    });

    await loadUserData(1);

    expect(document.getElementById('profile-pic').src).toContain('/pfp/haley.png');
    expect(document.getElementById('username-display').textContent).toBe('Abby');
    expect(document.getElementById('username-display-field').textContent).toBe('Abby');
    expect(document.getElementById('email-display-field').textContent).toBe('hello@example.com');
    expect(document.getElementById('points-value').textContent).toBe('88 pts');
    expect(document.getElementById('streak-value').textContent).toBe('3 days');
    expect(document.getElementById('leaderboard-position').textContent).toBe('#2');
  });

  test('handles missing fields gracefully', async () => {
    const mockUser = {}; // all fields missing
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockUser });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    await loadUserData(1);

    expect(document.getElementById('profile-pic').src).toContain('/pfp/default.png');
    expect(document.getElementById('username-display').textContent).toBe('User');
    expect(document.getElementById('email-display-field').textContent).toBe('No email provided');
    expect(document.getElementById('points-value').textContent).toBe('');
  });
});

describe('loadUserPoints', () => {
  test('displays user points', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ user_points: 42 }) });

    await loadUserPoints(1);
    expect(document.getElementById('points-value').textContent).toBe('42 pts');
  });

  test('defaults to 0 pts if points not provided', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    await loadUserPoints(1);
    expect(document.getElementById('points-value').textContent).toBe('0 pts');
  });
});

describe('loadStreak', () => {
  test('displays streak count', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ streak: 7 }) });

    await loadStreak(1);
    expect(document.getElementById('streak-value').textContent).toBe('7 days');
  });

  test('displays 0 if no streak data', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    await loadStreak(1);
    expect(document.getElementById('streak-value').textContent).toBe('0 days');
  });
});

describe('loadLeaderboardPosition', () => {
  test('displays leaderboard position if user found', async () => {
    const leaderboard = [{ user_id: 4 }, { user_id: 1 }, { user_id: 5 }];
    fetch.mockResolvedValueOnce({ ok: true, json: async () => leaderboard });

    await loadLeaderboardPosition(1);
    expect(document.getElementById('leaderboard-position').textContent).toBe('#2');
  });

  test('shows nothing if user not in leaderboard', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [{ user_id: 3 }] });

    await loadLeaderboardPosition(1);
    expect(document.getElementById('leaderboard-position').textContent).toBe('');
  });
});