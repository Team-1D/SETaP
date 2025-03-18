// function to create a collection of flashcards

async function createCollection(name) {
    try {
        const result = await pool.query(
            'INSERT INTO collections (name) VALUES ($1) RETURNING *',
            [name]
        );
        return result.rows[0]; 
    } catch (err) {
        console.error(err);
        return { error: 'Database error while creating collection' };
    }
}

//function to get all the flashcard collections

async function getAllCollections() {
    try {
        const result = await pool.query('SELECT * FROM collections ORDER BY created_at DESC');
        return result.rows; //// this will return all collections
    } catch (err) {
        console.error(err);
        return { error: 'Database error while retrieving collections' };
    }
}

// function to get a collection by ID

async function getCollectionById(id) {
    try {
        const result = await pool.query('SELECT * FROM collections WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return { error: 'Collection not found' };
        }
        return result.rows[0]; 
    } catch (err) {
        console.error(err);
        return { error: 'Database error while retrieving collection' };
    }
}

// function to update(rename) flashcard collection

async function updateCollection(id, name) {
    try {
        const result = await pool.query(
            'UPDATE collections SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        if (result.rows.length === 0) {
            return { error: 'Collection not found' };
        }
        return result.rows[0]; // Return updated collection
    } catch (err) {
        console.error(err);
        return { error: 'Database error whilst renaming collection' };
    }
}

// function to delete a flashcard collection

async function deleteCollection(id) {
    try {
        const result = await pool.query('DELETE FROM collections WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return { error: 'Collection not found' };
        }
        return { message: 'Collection deleted successfully' };
    } catch (err) {
        console.error(err);
        return { error: 'Database error while deleting collection' };
    }
}


// function to add a flashcard to a collection

async function addFlashcardToCollection(question, answer, collection_id, color, template) {
    try {
        const result = await pool.query(
            'INSERT INTO flashcards (collection_id, title, content, color, template) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [question, answer, collection_id, color, template]
        );
        return result.rows[0]; 
    } catch (err) {
        console.error(err);
        return { error: 'Database error while adding flashcard' };
    }
}

// function to get all flashcards in a collection
async function getFlashcardsByCollectionId(collection_id) {
    try {
        const result = await pool.query('SELECT * FROM flashcards WHERE collection_id = $1 ORDER BY created_at DESC', [collection_id]);
        return result.rows; 
    } catch (err) {
        console.error(err);
        return { error: 'Database error while retrieving flashcards' };
    }
}

module.exports = {
    createCollection,
    getAllCollections,
    getCollectionById,
    updateCollection,
    deleteCollection,
    getFlashcardsByCollectionId,
    addFlashcardToCollection
};