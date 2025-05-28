console.log(">>> Server script has started");

const express = require('express');
const cors = require('cors');
const path = require('path');
const { pool } = require('./database-pool');
const fs = require('fs');
const port = 8080; // Using only one port

//controllers - functions from each backend file
const { createNote, getNotes, getNoteByName, updateNote, deleteNote, toggleFavourite } = require('./notes');
const { getStreak, updateStreak, createStreak } = require('./streak');
const { getFlashcards, getFlashcardById, createFlashcard, updateFlashcard, deleteFlashcard } = require('./flashcardController');
const { loginUser } = require('./loginController');
const { signupUser } = require('./signupController');
const {getLeaderboard, getUser, updateUserPoints, getLeaderboardSlice } = require('./leaderboardController');

const app = express();
app.use(cors());
app.use(express.json());

//LOGIN
//checking user login okay - if yes the user is let into the homepage
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
            redirect: 'home.html'
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
});

//SIGNUP
//signs user up and lets them into homepage
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

//NOTES ROUTES
//gets all notes 
app.get('/notes', async (req, res) => {
    try {
        const notes = await getNotes();
        res.json(notes);
    } catch (err) {
        console.error("Failed to get notes:", err.message);
        res.status(500).json({ error: "Failed to fetch notes" });
    }
});

//saves a note to database
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

//getting note by title
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

//updating the given note
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

//deleting note
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

//toggling the favourite attribute
app.put('/notes/favourite/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Received request to toggle favourite for user ID: ${id}`);
    const result = await toggleFavourite(id);
    if (result.error) {
        return res.status(404).json(result);
    }
    res.json(result);
});

//STREAK ROUTES
//getting streak by id
app.get('/streak/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await getStreak(userId);
    if (result.error) {
        return res.status(404).json(result);
    }
    res.json(result);
});

//creating streak
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

// FLASHCARD ROUTES
//creating flashcard
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

//getting all flashcards
app.get('/flashcards/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const flashcards = await getFlashcards(userId);
        res.status(200).json(flashcards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch flashcards' });
    }
});

//getting flashcard by id 
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

//updating flashcard
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

//deleteing flashcard
app.delete('/flashcards/:id', async (req, res) => {
    const { id } = req.params;
    console.log('DELETE request received for ID:', id);

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

//ACTIVITY TIMER ROUES
// Function to update user score in the database
async function updateUserScore(newPoints) {
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/score`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ points: newPoints }) // Send the points to be added
        });

        if (!response.ok) {
            throw new Error('Failed to update user score');
        }

        console.log('User score updated successfully');
    } catch (error) {
        console.error('Error updating user score:', error);
    }
}

// Get user streak
app.get('/api/streak/:userId', async (req, res) => {
    console.log('api streak started');
    // try {
        const { userId } = req.params;
        console.log(userId);
        const result = await pool.query(
            'SELECT streak_count FROM streaks WHERE user_id = $1',
            [userId]
        );
        res.json({ streak: result.rows[0]?.streak_count || 0 });
    // } catch (error) {
    //     res.status(500).json({ error: "Failed to fetch streak" });
    // }
});

// Award XP
app.post('/api/update-xp', async (req, res) => {
    console.log('api xp started');
    try {
        const { userId, xp } = req.body;
        console.log(`Updating XP for user ${userId} with ${xp} points`);
        
        const result = await pool.query(
            'UPDATE users SET user_points = COALESCE(user_points, 0) + $1 WHERE user_id = $2 RETURNING user_points',
            [xp, userId]
        );
        console.log(result);
        if (result.rowCount === 0) {
            console.error('User not found for XP update');
            return res.status(404).json({ error: "User not found" });
        }
        
        console.log(`Successfully updated XP. New total: ${result.rows[0].user_points}`);
        res.json({ 
            success: true,
            newPoints: result.rows[0].user_points 
        });
    } catch (error) {
        console.error("Failed to update XP:", error);
        res.status(500).json({ 
            error: "Failed to update XP",
            details: error.message 
        });
    }
});

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/pfp', express.static(path.join(__dirname, '/pfp')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});



  //Fetch for username

  // Combined /api/username endpoint that handles both cases
app.get('/api/username', async (req, res) => {
    try {
        // Case 1: If using authenticated user (from session/JWT)
        if (req.user) {
            return res.json({ username: req.user.username });
        }
        
        // Case 2: If fetching by user_id from query params
        const userId = req.query.userId;
        if (userId) {
            const result = await pool.query(
                'SELECT username FROM users WHERE id = $1', 
                [userId]
            );
            if (result.rows.length > 0) {
                return res.json({ username: result.rows[0].username });
            }
            return res.status(404).json({ error: 'User not found' });
        }

        // If neither case is met
        return res.status(401).json({ error: 'Unauthorized - no user information provided' });

    } catch (err) {
        console.error('Error fetching username:', err);
        res.status(500).json({ error: 'Database error' });
    }
  });



  //endpoint api username 

  app.get('/api/username', (req, res) => {
    if (req.user) {
      res.json({ username: req.user.username });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  });

    app.get('/api/user/:id', async (req, res) => {
        try {
            const result = await pool.query(
                'SELECT user_nickname, user_email as email, user_points, profile_pic FROM users WHERE user_id = $1', 
                [req.params.id]
            );
            
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = result.rows[0];
            user.profile_pic_url = user.profile_pic 
                ? `/pfp/${user.profile_pic}` 
                : '/pfp/default.png';
                
            res.json(user);
        } catch (err) {
            console.error('Error fetching user data:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

  // Route to get the leaderboard
  app.get('/leaderboard', getLeaderboard);
  app.get("/leaderboard/:id/around", getLeaderboardSlice);


// Route to get a specific user's data
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const userData = await getUser(userId);
        if (userData) {
            res.json(userData);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: err.message });
    }
});

// Route to update user points
app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const newPoints = req.body.user_points; // Assuming the request body contains { user_points: new_value }

    try {
        const updatedUser = await updateUserPoints(userId, newPoints);
        if (updatedUser) {
            res.json({ message: 'User points updated successfully', user: updatedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
    


//Fetch user points
app.get('/users/points', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const result = await pool.query('SELECT user_points FROM users WHERE id = $1', [userId]);
      
      if (result.rows.length === 0) {
        return res.status(404).send('User not found');
      }
  
      const userPoints = result.rows[0].user_points;
      res.render('points', { points: userPoints });
  
    } catch (err) {
      console.error('Error fetching user points:', err);
      res.status(500).send('Server error');
    }
  });

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


