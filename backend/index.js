const express = require('express'); // Correct import
const cors = require('cors');
const path = require('path');
const pool = require('./database-pool');

const { createNote, getNotes, getNoteByName, updateNote, deleteNote, toggleFavourite } = require('./notes');
const { getStreak, updateStreak, createStreak } = require('./streak');
const { getFlashcards, getFlashcardById, createFlashcard, updateFlashcard, deleteFlashcard } = require('./flashcardController');
const { loginUser } = require('./loginController');
const { signupUser } = require('./signupController');



const app = express(); // Initialize the Express app
app.use(cors()); // Use CORS middleware
app.use(express.json()); // Parse JSON request bodies


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        
        if (result.error) {
            return res.status(401).json({ 
                success: false,
                error: result.error 
            });
        }

        res.status(200).json({ 
            success: true,
            userId: result.userId,
            email: result.email,
            redirect: '/home.html'
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { email, nickname, password } = req.body;
        const result = await signupUser(email, nickname, password);
        if (result.error) {
            return res.status(400).json({ 
                success: false,
                error: result.error 
            });
        }

        res.status(201).json({ 
            success: true,
            userId: result.userId,
            email: result.email,
            nickname: result.nickname,
            redirect: '/home.html'
        });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
});

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

app.get('/notes/name/:title', async (req, res) => {
    const { title } = req.params;
    console.log(`Fetching note with title: ${title}`);
    try {
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
        const { id } =parseInt(req.params.id, 10);
        const note = await deleteNote(id);
        res.json(note);
    } catch (err) {
        console.error("Failed to delete note:", err);
        res.status(500).json({ error: "Failed to delete note" });
    }
});

app.put('/notes/favourite/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Received request to toggle favourite for user ID: ${id}`);
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

// Flashcard routes
app.post('/flashcards', async (req, res) => {
    const { userId, term, definition, colour } = req.body; 
    try {
        const flashcard = await createFlashcard({ userId, term, definition, colour });
        res.status(201).json(flashcard);
    } catch (error) {
        console.error('Failed to create flashcard:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to create flashcard' });
    }
});


app.get('/flashcards/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const flashcards = await getFlashcards(userId);
        res.status(200).json(flashcards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch flashcards' });
    }
});


app.get('/flashcards/id/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const flashcard = await getFlashcardById(id);
        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }
        res.status(200).json(flashcard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch flashcard' });
    }
});


app.put('/flashcards/:id', async (req, res) => {
    const id = req.params.id;
    const { term, definition, colour } = req.body;

    console.log('Update request received for ID:', id);
    console.log('Request body:', req.body);

    const updatedFlashcard = await updateFlashcard(id, term, definition, colour);
    if (updatedFlashcard) {
        return res.status(200).json({
            message: 'Flashcard updated successfully',
            flashcard: updatedFlashcard
        });
    } else {
        return res.status(404).json({ message: 'Flashcard not found' });
    }
});


app.delete('/flashcards/:id', async (req, res) => {
    console.log('DELETE request received for ID:', req.params.id);
    const { id } = req.params;
    try {
        const deletedFlashcard = await deleteFlashcard(id);
        if (!deletedFlashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }
        res.status(200).json(deletedFlashcard);
    } catch (error) {
        console.error('Error deleting flashcard:', error);
        res.status(500).json({ error: 'Failed to delete flashcard' });
    }
});



app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

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


