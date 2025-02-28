CREATE TYPE timer_status AS ENUM ('active', 'paused', 'completed');
CREATE TYPE todo_status AS ENUM ('in_progress', 'completed');
CREATE TYPE difficulty AS ENUM ('low', 'medium', 'high');

CREATE TABLE leaderboards (
    leaderboard_id SERIAL PRIMARY KEY, 
    leadrboard_start_date DATE NOT NULL,
    leadrboard_end_date DATE NOT NULL
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, 
    leaderboard_id INT NOT NULL REFERENCES leaderboard(leaderboard_id), 
    user_email VARCHAR(50) NOT NULL,
    user_nickname VARCHAR(100) NOT NULL,
    profile_id INT NOT NULL,
    user_streak INT NOT NULL,
    user_points  INT NOT NULL,
    user_coins INT NOT NULL
);

CREATE TABLE pomodoro_timers(
    timer_id SERIAL PRIMARY KEY, 
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id), 
    timer_start_time TIME NOT NULL,
    timer_end_time TIME NOT NULL,
    status TIMER_STATUS NOT NULL
);

CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY, 
    user_id INT NOT NULL REFERENCES users(user_id), 
    note_title VARCHAR(100) NOT NULL,
    note_content TEXT,
    date_created DATE NOT NULL
);

CREATE TABLE flashcards(
    flashcard_id SERIAL PRIMARY KEY, 
    points_for_completion INT NOT NULL
);

CREATE TABLE users_flashcards(
    user_id INT NOT NULL REFERENCES users(user_id),
    flashcard_id INT NOT NULL REFERENCES flashcards(flashcard_id),
    PRIMARY KEY (user_id, flashcard_id)
);

CREATE TABLE todo_lists (
    todo_id SERIAL PRIMARY KEY, 
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id), 
    todo_description TEXT,
    status TODO_STATUS NOT NULL,
    difficulty DIFFICULTY NOT NULL,
    deadline DATE
);

CREATE TABLE streaks (
    streak_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id),
    last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
    streak_count INT NOT NULL DEFAULT 1
);

