//npm init -y
//npm install express pg cors body-parser dotenv

const express = require("express");
const pool  = require("./database-pool");

//CRUD OPERATIONS

async function createNote(title, content, dateCreated, userId, favourite = false){
    const date = dateCreated || new Date().toISOString().split("T")[0];
    console.log('im here');
    try {
        const result = await pool.query(
            "INSERT INTO notes (user_id, note_title, note_content, date_created, favourite) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userId, title, content, date, favourite]
        );
        console.log('Note Created:', result.rows[0]); // Log the created note
        return result.rows[0];
    } catch (err) {
        console.error('Error creating note:', err); // Log errors if they occur
        throw err;
    }
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

async function toggleFavourite(id){
    try{
        const check = await pool.query('SELECT favourite FROM notes WHERE note_id = $1', [id]);
        if (check.rows.length === 0) {
            return { error: 'Note not found' };
        }
        const currentStatus = check.rows[0].favourite;
        const newStatus = !currentStatus; // Toggle true/false
        const result = await pool.query(
            'UPDATE notes SET favourite = $1 WHERE note_id = $2 RETURNING *',
            [newStatus, id]
        );
        return result.rows[0]; // Return updated note
    } catch (err) {
    console.error(err);
    return { error: 'Database error' };
    }
}


module.exports = {
    createNote,
    getNotes,
    getNoteByName,
    updateNote,
    deleteNote,
    toggleFavourite
};