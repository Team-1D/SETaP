const { pool } = require('./database-pool');
const bcrypt = require('bcrypt');

async function loginUser(email, password) {
    if (!email || !password) {
        return { error: 'Username and password are required' };
    }

    try {
        const result = await pool.query(
            'SELECT user_id, user_email, user_password FROM users WHERE user_email = $1', 
            [email]
        );

        if (result.rows.length === 0) {
            return { error: 'Invalid email or password' };
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.user_password);
        
        if (!isMatch) {
            return { error: 'Invalid email or password' };
        }

        return {
            userId: user.user_id,
            email: user.user_email,
            redirect: 'home.html'
        };

    } catch (error) {
        console.error('Login error:', error);
        throw error; // Let the route handler deal with this
    }
}

module.exports = {
    loginUser 
};