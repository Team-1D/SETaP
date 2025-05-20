console.log(">>> Server script has started");

const express = require('express');
const cors = require('cors');
const path = require('path');
const { pool } = require('./database-pool');
const fs = require('fs');
const port = 8080; // Using only one port

//controllers
const { createNote, getNotes, getNoteByName, updateNote, deleteNote, toggleFavourite } = require('./notes');
const { getStreak, updateStreak, createStreak } = require('./streak');
const { getFlashcards, getFlashcardById, createFlashcard, updateFlashcard, deleteFlashcard } = require('./flashcardController');
const { loginUser } = require('./loginController');
const { signupUser } = require('./signupController');
const {getLeaderboard, getUser, updateUserPoints } = require('./leaderboardController');

const app = express();
app.use(cors());
app.use(express.json());


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
            redirect: './frontend/home.html'
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


// get the xp points


app.get('/xp/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await pool.query(
        'SELECT user_points FROM users WHERE user_id = $1',
        [userId]
      );
  
      if (result.rows.length > 0) {
        res.json({ xp: result.rows[0].user_points });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });


  //fetch xp points

  fetch(`http://localhost:8080/xp/${userId}`)
  .then(res => res.json())
  .then(data => {
    document.querySelector('#xp-points').textContent = data.xp;
  })
  .catch(err => {
    console.error('Error fetching XP:', err);
    document.querySelector('#xp-points').textContent = 'Error';
  });






app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/pfp', express.static(path.join(__dirname, '/pfp')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});



 



  // Route to get the leaderboard
  app.get('/leaderboard', getLeaderboard);

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




//get username
  app.get('/username/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const result = await pool.query(
        'SELECT user_nickname FROM users WHERE user_id = $1',
        [userId]
      );
  
      if (result.rows.length > 0) {
        res.json({ username: result.rows[0].user_nickname });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });
  
  app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
  });



  fetch(`http://localhost:8080/username/${userId}`)
  .then(response => response.json())
  .then(data => {
    document.querySelector('#username').textContent = data.nickname;
  })
  .catch(err => {
    document.querySelector('#username').textContent = 'Error loading nickname';
    console.error(err);
  });







  //fetch streak 

  fetch(`http://localhost:8080/streak/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Assuming `data.streak` contains the streak number
        document.querySelector('#streak-count').textContent = data.streak;
      })
      .catch(error => {
        console.error('Error fetching streak:', error);
        document.querySelector('#streak-count').textContent = 'Error';
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


