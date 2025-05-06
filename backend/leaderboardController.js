// npm init -y
// npm install express pg cors body-parser dotenv

const express = require("express");
// backend/controllers/leaderboardController.js
const { pool } = require("./database-pool"); // Adjust path as necessary

// Controller function to get the leaderboard data
const getLeaderboard = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT user_id, user_nickname, user_points,
            RANK() OVER (ORDER BY user_points DESC) as user_rank
            FROM users
            ORDER BY user_points DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        res.status(500).json({ error: err.message });
    }
};

// Controller function to get a specific user's data
const getUser = async (userId) => {
    const result = await pool.query(
        `SELECT user_id, user_nickname, user_points,
         RANK() OVER (ORDER BY user_points DESC) as user_rank
         FROM users WHERE user_id = $1`,
        [userId]
    );
    return result.rows[0];
};


// Controller function to update user points
const updateUserPoints = async (req, res) => {
    const userId = req.params.id;
    const newPoints = req.body.user_points;

    try {
        const result = await pool.query(
            `UPDATE users SET user_points = $1 WHERE user_id = $2 RETURNING user_id, user_nickname, user_points`,
            [newPoints, userId]
        );
        if (result.rows.length > 0) {
            res.json({ message: 'User points updated successfully', user: result.rows[0] });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error("Error updating user points:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getLeaderboard,
    getUser,
    updateUserPoints
};