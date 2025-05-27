const { signupUser } = require('../backend/signupController');
const { pool }       = require('../backend/database-pool');
const bcrypt         = require('bcrypt');

jest.mock('../backend/database-pool', () => ({
    pool: { query: jest.fn() }
  }));
  
  jest.mock('bcrypt', () => ({
    hash: jest.fn()
  }));
  
  // reset mocks between tests
  afterEach(() => jest.clearAllMocks());
  
  describe('signupUser', () => {
  
    test('fails if any field is missing', async () => {
      const res = await signupUser('', 'nick', 'Password1');
      expect(res).toEqual({ error: 'All fields are required' });
    });
    
    test('fails on invalid email format', async () => {
      const res = await signupUser('bad‑email', 'nick', 'Password1');
      expect(res.error).toMatch(/Invalid email format/);
    });

    test('fails if email does not contain @ symbol', async () => {
      const res = await signupUser('userexample.com', 'nick', 'Password1');
      expect(res.error).toMatch(/Invalid email format/);
    });
  
    test('fails on weak password', async () => {
      const res = await signupUser('a@b.com', 'nick', 'weak');
      expect(res.error).toMatch(/Password must be at least 8 characters/);
    });

    test('fails if password lacks required complexity', async () => {
      const res = await signupUser('a@b.com', 'nick', 'password'); // 8 lowercase characters
      expect(res.error).toMatch(/Password must.*uppercase.*lowercase.*number/i);
    });
  
    test('fails if email already exists', async () => {
      // 1st query → email check returns a row
      pool.query.mockResolvedValueOnce({ rows: [{ user_id: 99 }] });
  
      const res = await signupUser('a@b.com', 'nick', 'Password1');
      expect(res).toEqual({ error: 'Email already in use' });
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  
    test('fails if nickname already taken', async () => {
      // 1st query → email check (no rows)
      pool.query.mockResolvedValueOnce({ rows: [] });
      // 2nd query → nickname check (one row)
      pool.query.mockResolvedValueOnce({ rows: [{ user_id: 77 }] });
  
      const res = await signupUser('a@b.com', 'nick', 'Password1');
      expect(res).toEqual({ error: 'Nickname already taken' });
      expect(pool.query).toHaveBeenCalledTimes(2);
    });
  
    test('succeeds and returns new user object', async () => {
      // 1) email check (empty)
      pool.query.mockResolvedValueOnce({ rows: [] });
      // 2) nickname check (empty)
      pool.query.mockResolvedValueOnce({ rows: [] });
      // Mock bcrypt.hash
      bcrypt.hash.mockResolvedValueOnce('hashedPw');
      // 3) insert user, returning new row
      pool.query.mockResolvedValueOnce({
        rows: [{ user_id: 1, user_email: 'a@b.com', user_nickname: 'nick' }]
      });
      // 4) insert streak (no return needed)
      pool.query.mockResolvedValueOnce({});
  
      const res = await signupUser('a@b.com', 'nick', 'Password1');
  
      expect(bcrypt.hash).toHaveBeenCalledWith('Password1', 10);
      expect(pool.query).toHaveBeenCalledTimes(4);
      expect(res).toEqual({
        userId: 1,
        email: 'a@b.com',
        nickname: 'nick',
        redirect: 'home.html'
      });
    });
  
  });