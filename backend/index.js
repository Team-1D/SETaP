// code for terminal
//npm install pg

import express from 'express';
const express = require('express');
const cors = require('cors');
const {createNote,getNotes, getNoteByName,updateNote, deleteNote } = require('./notes');
const {getStreak, updateStreak, CreateStreak} = require('./streaks');
const { getFlashcards, getFlashcardById, createFlashcard, updateFlashcard, deleteFlashcard } = require('./flashcards');
const { createCollection,getAllCollections,getCollectionById,updateCollection,deleteCollection, addFlashcardToCollection, getFlashcardsByCollectionId} = require('./collections');

const app = express();
app.use(cors());
app.use(express.json());
//const { Sequelize } = require("sequelize");

app.get('/notes', getNotes);
app.post('/notes', createNote);
app.get('/notes/:title', getNoteByName);
app.put('/notes/:id', updateNote);
app.delete('/notes/:id', deleteNote);


app.get('/flashcards', getFlashcards);        
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
    plate
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



const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

startTimer();

//Streak
let streak = getStreak();


// Calculate Points // 
function checkMultiplier () { 
    let pointMultiplier = 1;
    if (streak % 5 == 0) {
        pointMultiplier += 0.5
    }
}

function checkPoints() {
    if (seconds % 300 === 0 && seconds !== 0) { 
        points += 10 * seconds / 60;
        updatePointsDisplay();
    }
}


