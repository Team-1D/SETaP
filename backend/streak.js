
const {Streak}  = require("./database-pool");


async function getStreak(userID){
    try {
        const result = await pool.query('SELECT * FROM streaks WHERE user_id = $1', [userId]);
        if (result.rows.length === 0) {
            return { error: 'Streak not found' };
        }
        return result.rows[0]; // Return streak value
    } catch (err) {
        console.error(err);
        return { error: 'Database error' };
    }
}

async function updateStreak(userId, reset = false){
    try {
        if (reset) {
            // Reset streak count to 0
            const result = await pool.query(
                'UPDATE streaks SET streak_count = 0, last_updated = new Date() WHERE user_id = $1 RETURNING *',
                [userId]
            );
            return result.rows[0];
        } else {
            // Increment streak count
            const result = await pool.query(
                'UPDATE streaks SET streak_count += 1, last_updated = new Date() WHERE user_id = $1 RETURNING *',
                [userId]
            );
            return result.rows[0];
        }
    } catch (err) {
        console.error(err);
        return { error: 'Database error' };
    }
}

async function createStreak(userID){
    //streak will be created one a user signs in
}


module.exports = {
    getStreak,
    updateStreak,
    createStreak
};