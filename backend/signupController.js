const { pool } = require('./database-pool');
const bcrypt = require('bcrypt');

async function signupUser(email, nickname, password) {
    // Validate input fields
    if (!email || !nickname || !password) {
        return { error: 'All fields are required' };
    }

    // Email format validation 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: 'Invalid email format' };
    }

    // Password validation - so testing can be more complex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(password)) {
            return { 
                error: 'Password must be at least 8 characters long and include:' +
                    '\n• One uppercase letter (A-Z)' +
                    '\n• One lowercase letter (a-z)' +
                    '\n• One number (0-9)'
            };
        }
    try {
        // Check if email already exists
        const emailCheck = await pool.query(
            'SELECT user_id FROM users WHERE user_email = $1', 
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return { error: 'Email already in use' };
        }

        // Check if nickname already exists
        const nicknameCheck = await pool.query(
            'SELECT user_id FROM users WHERE user_nickname = $1', 
            [nickname]
        );

        if (nicknameCheck.rows.length > 0) {
            return { error: 'Nickname already taken' };
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Get the default leaderboard (assuming ID 1 exists as per your test data)
        const leaderboardId = 1;

        // Insert new user into database with default values
        const result = await pool.query(
            `INSERT INTO users 
                (leaderboard_id, user_email, user_nickname, user_password, user_streak, user_points, user_coins) 
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING user_id, user_email, user_nickname`,
            [leaderboardId, email, nickname, hashedPassword, 0, 0, 0]
        );

        // Also create an entry in the streaks table
        await pool.query(
            `INSERT INTO streaks (user_id, streak_count) 
            VALUES ($1, $2)`,
            [result.rows[0].user_id, 0]
        );

        const newUser = result.rows[0];

        return {
            userId: newUser.user_id,
            email: newUser.user_email,
            nickname: newUser.user_nickname,
            redirect: 'home.html'
        };

    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
}

module.exports = {
    signupUser
};