const { pool } = require('./database-pool');
const bcrypt = require('bcrypt');

//comparing inputted user info to the user info in the database if it is a match then the user id let into the homepage if not error messages appear
async function loginUser(email, password) {
    if (!email || !password) {
        return { error: 'Username and password are required' };
    }
    console.log(email,password);
    try {
        const result = await pool.query(
            'SELECT user_id, user_email, user_password FROM users WHERE user_email = $1', 
            [email]
        );

        if (result.rows.length === 0) {
            return { error: 'Invalid email or password' };
        }

        const user = result.rows[0];
        console.log('inputted password', password);
        console.log('database password', user.user_password);
        const isMatch = await bcrypt.compare(password, user.user_password);
        console.log('Password match result:', isMatch);
        
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