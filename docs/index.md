# Welcome to REViiT

Reviit is a gamified revision app designed to help students learn better through note-taking, flashcards, and XP rewards.

## Features

- 📝 Write notes from templates
- 🧠 Test yourself with flashcards
- 🎮 Earn XP and climb the leaderboard

## Technologies

- Languages used: **HTML**, **CSS**, **JavaScript**, **PostgreSQL**

## APIs and Installs

### Installation 
To install all necessary dependencies, run:
<pre>npm install</pre>

To set up the backend server and install essential packages like `bcrypt` and `express`, run:
<pre>npm run setup</pre>

To start the application, use:
<pre>npm start</pre>

To run the test suite (using Jest):
<pre>npm test</pre>

### APIs Used 
While Reviit does not currently integrate with third-party external APIs, it features a custom-built backend RESTful API endpoints developed using **Express.js**, connected to a **PostgreSQL** database. The API handles core functionalities such as:

🧾 User authentication and password hashing (via **bcrypt**)
- `POST /api/register` – Register a new user
- `POST /api/login` – Log in a user

📚 CRUD operations for **flashcards**
- `GET /api/flashcards` – Fetch all flashcards
- `POST /api/flashcards` – Create a new flashcard

📘 CRUD operations for **notes**
- `GET /api/notes` – Retrieve user notes
- `POST /api/notes` – Add a new note

🏆 XP and leaderboard data management
- `GET /api/xp` – Get current XP
- `POST /api/xp` – Update XP after an activity

The frontend consumes these endpoints to provide a seamless interactive experience.

### Frontend Resources / APIs
**Boxicons** – Icon library

`https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css`


**Google Fonts (Press Start 2P)** – Used for retro game-style typography

`https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap`

The frontend utilises these resources and APIs to provide a seamless interactive experience.