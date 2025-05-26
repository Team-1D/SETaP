// npm init -y
// npm install express pg cors body-parser dotenv

const express = require("express");
const { pool } = require("./database-pool"); // Adjust path as necessary

// CRUD OPERATIONS FOR DATABASE
//Creating new flashcard
async function createFlashcard({ userId, term, definition, colour }) {
    try {
        console.log('Creating flashcard with:', { userId, term, definition, colour });

        const result = await pool.query(
            `INSERT INTO flashcards (user_id, term, definition, colour)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, term, definition, colour]
        );
        console.log('Flashcard Created:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error creating flashcard:', err);
        throw err;
    }
}

//getting all flashcards
async function getFlashcards(userId) {
    try {
        const result = await pool.query(
            "SELECT * FROM flashcards WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        return result.rows;
    } catch (err) {
        console.error('Error retrieving flashcards:', err);
        throw err;
    }
}

//getting flashcard by id
async function getFlashcardById(id) {
    try {
        const result = await pool.query("SELECT * FROM flashcards WHERE flashcard_id = $1", [id]);
        console.log('Query result:', result.rows);
        return result.rows[0];
    } catch (err) {
        console.error('Error retrieving flashcard:', err);
        throw err;
    }
}

//updating the flashard attributes
async function updateFlashcard(id, term, definition, colour) {
    try {
        console.log(`Updating flashcard with ID: ${id}`);
        const result = await pool.query(
            "UPDATE flashcards SET term = $1, definition = $2, colour = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
            [term, definition, colour, id]
        );
        if (result.rowCount === 0) {
            console.log("No rows updated, possibly wrong ID or no changes.");
            return null;
        }
        console.log(`Flashcard with ID: ${id} successfully updated:`, result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error updating flashcard:', err);
        throw err;
    }
}

//deleting flashcard
async function deleteFlashcard(id) {
    try {
        console.log(`Attempting to delete flashcard with ID: ${id}`);
        const result = await pool.query(
            "DELETE FROM flashcards WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            console.log("No flashcard found to delete, possibly wrong ID.");
            return null; // No rows deleted
        }
        console.log(`Flashcard with ID: ${id} successfully deleted:`, result.rows[0]);
        return result.rows[0]; // Return the deleted flashcard
    } catch (err) {
        console.error('Error deleting flashcard:', err);
        throw err;
    }
}


module.exports = {
    createFlashcard,
    getFlashcards,
    getFlashcardById,
    updateFlashcard,
    deleteFlashcard
};