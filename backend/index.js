// code for terminal
//npm install pg

import express from 'express';
const express = require('express');
const cors = require('cors');
const {createNote,getNotes, getNoteByName,updateNote, deleteNote } = require('./notes');
const {getStreak, updateStreak, CreateStreak} = require('./streaks')

const app = express();
app.use(cors());
app.use(express.json());
//const { Sequelize } = require("sequelize");

app.get('/notes', getNotes);
app.post('/notes', createNote);
app.get('/notes/:title', getNoteByName);
app.put('/notes/:id', updateNote);
app.delete('/notes/:id', deleteNote);
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


