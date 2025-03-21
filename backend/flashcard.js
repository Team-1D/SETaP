const { pool } = require("./database-pool");

// function to get all flashcards

async function getFlashcards(req, res) {
    try {
        const result = await pool.query('SELECT * FROM flashcards');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
}

// function to get a flashcard by its ID

async function getFlashcardById(req, res) {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM flashcards WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
}

// function to create a New flashcard 
async function createFlashcard(req, res) {
    const { question, answer, collection_id, color, template } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO flashcards (question, answer, collection_id, color) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [question, answer, collection_id, color, template ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
}

// function to update an existing flashcard

async function updateFlashcard(req, res) {
    const { id } = req.params;
    const { question, answer, collection_id, color, template} = req.body;
    try {
        const result = await pool.query(
            'UPDATE flashcards SET question = $1, answer = $2, collection_id = $3, color = $4, template = $5 WHERE id = 6 RETURNING *',
            [question, answer, collection_id, color, template, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
}

// function to deleta a flashcard

async function deleteFlashcard(req, res) {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM flashcards WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }
        res.json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
}


module.exports = {
    getFlashcards,
    getFlashcardById,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
};