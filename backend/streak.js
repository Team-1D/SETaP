const { pool } = require("./database-pool");

async function getStreak(userId) {
    try {
        const result = await pool.query(
            'SELECT streak_count FROM streaks WHERE user_id = $1', 
            [userId]
        );
        return result.rows[0]?.streak_count || 0;
    } catch (err) {
        console.error(err);
        return { streak: 0, error: "Failed to fetch streak" };
    }
}

async function updateStreak(userId) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const check = await pool.query(
            'SELECT last_updated FROM streaks WHERE user_id = $1',
            [userId]
        );
        
        if (check.rows.length > 0 && 
            new Date(check.rows[0].last_updated).toISOString().split('T')[0] === today) {
            return check.rows[0].streak_count;
        }

        const result = await pool.query(`
            UPDATE streaks 
            SET 
                streak_count = streak_count + 1,
                last_updated = CURRENT_DATE
            WHERE user_id = $1
            RETURNING streak_count
        `, [userId]);
        
        return result.rows[0].streak_count;
    } catch (err) {
        console.error(err);
        return 0;
    }
}


module.exports = {
    getStreak,
    updateStreak
};