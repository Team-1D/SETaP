//npm init -y
//npm install express pg cors body-parser dotenv

const express = require("express");
const pool  = require("../database");

//CRUD OPERATIONS

async function createNote(title, content, dateCreated){
    const x = await pool.query(
        "INSERT INTO notes (title, content, dateCreated) VALUES ($1, $2, $3) RETURNING *",
        [title, content, dateCreated]
    );
    return x.rows[0]; 
}

async function getNotes(){
    const x = await pool.query("SELECT * FROM notes ORDER BY date_created DESC");
    return x.rows;
}

async function getNoteByName(name){
    const x  =  await pool.query("SELECT * FROM notes WHERE note_title = $1", [name]);
    return x.rows[0];
} 

async function updateNote(id, title, content, dateCreated) {
    const x = await pool.query(
        "UPDATE notes SET title = $1, content = $2, dateCreated = $3 WHERE id = $4 RETURNING *",
        [title, content, dateCreated, id]
    );
    return x.rows[0]; // Return updated note
}

async function deleteNote(id) {
    const x = await pool.query("DELETE FROM notes WHERE id = $1 RETURNING *", [id]);
    return x.rows[0]; // Return deleted note
}

module.exports = {
    createNote,
    getNotes,
    getNoteByName,
    updateNote,
    deleteNote
};