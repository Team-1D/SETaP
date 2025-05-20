const { loginUser } = require('../backend/loginController'); // Adjust path if needed
const { pool } = require('../backend/database-pool');
const bcrypt = require('bcrypt');

jest.mock('../backend/database-pool', () => ({
  pool: { query: jest.fn() }
}));

jest.mock('bcrypt');

afterEach(() => {
  jest.clearAllMocks();
});

describe('loginUser', () => {
  test('returns error if email or password is missing', async () => {
    const res1 = await loginUser('', 'password123');
    const res2 = await loginUser('user@example.com', '');
    const res3 = await loginUser('', '');

    expect(res1).toEqual({ error: 'Username and password are required' });
    expect(res2).toEqual({ error: 'Username and password are required' });
    expect(res3).toEqual({ error: 'Username and password are required' });
  });

  test('returns error if no user found with email', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await loginUser('notfound@example.com', 'password123');

    expect(pool.query).toHaveBeenCalledWith(
      'SELECT user_id, user_email, user_password FROM users WHERE user_email = $1',
      ['notfound@example.com']
    );
    expect(res).toEqual({ error: 'Invalid email or password' });
  });

  test('returns error if password does not match', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{
        user_id: 1,
        user_email: 'test@example.com',
        user_password: 'hashedpassword'
      }]
    });
    bcrypt.compare.mockResolvedValueOnce(false);

    const res = await loginUser('test@example.com', 'wrongpassword');

    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
    expect(res).toEqual({ error: 'Invalid email or password' });
  });

  test('returns user data on successful login', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{
        user_id: 1,
        user_email: 'test@example.com',
        user_password: 'hashedpassword'
      }]
    });
    bcrypt.compare.mockResolvedValueOnce(true);

    const res = await loginUser('test@example.com', 'correctpassword');

    expect(res).toEqual({
      userId: 1,
      email: 'test@example.com',
      redirect: 'home.html'
    });
  });

  test('throws on database error', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB error'));

    await expect(loginUser('test@example.com', 'password')).rejects.toThrow('DB error');
  });
});