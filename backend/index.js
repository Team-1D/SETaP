const express = require('express'); // Correct import
const cors = require('cors');
const path = require('path');
const pool = require('./database-pool');

const { createNote, getNotes, getNoteByName, updateNote, deleteNote, toggleFavourite } = require('./notes');
const { getStreak, updateStreak, createStreak } = require('./streak');
const { getFlashcards, getFlashcardById, createFlashcard, updateFlashcard, deleteFlashcard } = require('./flashcard');
const { createCollection, getAllCollections, getCollectionById, updateCollection, deleteCollection, addFlashcardToCollection, getFlashcardsByCollectionId } = require('./collections');

const app = express(); // Initialize the Express app
app.use(cors()); // Use CORS middleware
app.use(express.json()); // Parse JSON request bodies

app.get('/flashcards/:id', getFlashcardById); 
app.post('/flashcards', createFlashcard);     
app.put('/flashcards/:id', updateFlashcard);  
app.delete('/flashcards/:id', deleteFlashcard);

app.get('/collections', getAllCollections); 
app.get('/collections/:id', getCollectionById);
app.post('/collections', createCollection);
app.put('/collections/:id', updateCollection);
app.delete('/collections/:id', deleteCollection);
app.get('/collections/:collection_id/flashcards', getFlashcardsByCollectionId);

app.get('/notes', async (req, res) => {
    try {
        const notes = await getNotes();
        res.json(notes);
    } catch (err) {
        console.error("Failed to get notes:", err.message);
        res.status(500).json({ error: "Failed to fetch notes" });
    }
});

app.post('/notes', async (req, res) => {
    try {
        const { title, content, dateCreated, userId } = req.body;
        const note = await createNote(title, content, dateCreated, userId);
        res.status(201).json(note);
    } catch (err) {
        console.error("Failed to create note:", err.message);
        res.status(500).json({ error: "Failed to create note" });
    }
});

app.get('/notes/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const note = await getNoteByName(title);
        if (!note) return res.status(404).json({ error: "Note not found" });
        res.json(note);
    } catch (err) {
        console.error("Failed to get note:", err);
        res.status(500).json({ error: "Failed to get note" });
    }
});

app.put('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, dateCreated } = req.body;
        const note = await updateNote(id, title, content, dateCreated);
        res.json(note);
    } catch (err) {
        console.error("Failed to update note:", err);
        res.status(500).json({ error: "Failed to update note" });
    }
});

app.delete('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const note = await deleteNote(id);
        res.json(note);
    } catch (err) {
        console.error("❌ Failed to delete note:", err);
        res.status(500).json({ error: "Failed to delete note" });
    }
});

app.put('/notes/favourite/:id', async (req, res) => {
    const { id } = req.params;
    const result = await toggleFavourite(id);
    if (result.error) {
        return res.status(404).json(result);
    }
    res.json(result);
});

app.get('/streak/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await getStreak(userId);
    if (result.error) {
        return res.status(404).json(result);
    }
    res.json(result);
});
app.post('/streak/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await createStreak(userId);
    if (result.error) {
        return res.status(500).json(result);
    }
    res.json(result);
});
app.put('/streak/:userId', async (req, res) => {
    const { userId } = req.params;
    const { reset } = req.body;
    const result = await updateStreak(userId, reset);
    if (result.error) {
        return res.status(500).json(result);
    }
    res.json(result);
});

app.post('/flashcards', async (req, res) => {
    const { qustion, answer, collection_id, colour, template } = req.body;
    const result = await createFlashcard(qustion, answer, collection_id, colour, template);
    if (result.error) {
        return res.status(500).json(result);
    }
    res.json(result);
});

app.get('/flashcards', async (req, res) => {
    const result = await getFlashcards();
    
    if (result.error) {
        return res.status(500).json(result);
    }
    res.json(result);
});

app.get('/flashcards/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getFlashcardById(id);
    
    if (result.error) {
        return res.status(404).json(result);
    }
    res.json(result);
});

app.put('/flashcards/:id', async (req, res) => {
    const { id } = req.params;
    const {  question, answer, collection_id, color, template } = req.body;
    const result = await updateFlashcard( question, answer, collection_id, color, template);
    
    if (result.error) {
        return res.status(500).json(result);
    }
    res.json(result);
});

app.delete('/flashcards/:id', async (req, res) => {
    const { id } = req.params;
    const result = await deleteFlashcard(id);
    
    if (result.error) {
        return res.status(500).json(result);
    }
    res.json({ message: "Flashcard deleted successfully" });
});

app.post('/collections', async (req, res) => {
    const { name } = req.body;
    const result = await createCollection(name);
    
    if (result.error) {
        return res.status(500).json(result);
    }
    res.json(result);
});

app.get('/collections', async (req, res) => {
    const result = await getAllCollections();
    
    if (result.error) {
        return res.status(500).json(result);
    }
    res.json(result);
});

app.get('/collections/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getCollectionById(id);
    
    if (result.error) {
        return res.status(404).json(result);
    }
    res.json(result);
});

app.put('/collections/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await updateCollection(id, name);
    
    if (result.error) {
        return res.status(500).json(result);
    }
    res.json(result);
});

app.delete('/collections/:id', async (req, res) => {
    const { id } = req.params;
    const result = await deleteCollection(id);
    
    if (result.error) {
        return res.status(500).json(result);
    }
    res.json({ message: "Collection deleted successfully" });
});

app.post('/collections/:id/flashcards', async (req, res) => {
    const { id } = req.params;
    const { question, answer, collection_id, color, template } = req.body;
    
    const result = await addFlashcardToCollection(id, question, answer, collection_id, color, template);
    if (result.error) {
        return res.status(500).json(result);
    }
    res.json(result);
});

app.get('/collections/:id/flashcards', async (req, res) => {
    const { id } = req.params;
    
    const result = await getFlashcardsByCollectionId(id);
    
    if (result.error) {
        return res.status(500).json(result);
    }
    res.json(result);
});

app.use(express.static(path.join(__dirname, '../frontend')));


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



// //Streak
// let streak = getStreak();


// // Calculate Points // 
// function checkMultiplier () { 
//     let pointMultiplier = 1;
//     if (streak % 5 == 0) {
//         pointMultiplier += 0.5
//     }
// }

// function checkPoints() {
//     if (seconds % 300 === 0 && seconds !== 0) { 
//         points += 10 * seconds / 60;
//         updatePointsDisplay();
//     }
// }


