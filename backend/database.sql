--CREATE DATABASE setap_cw;

-- Create enum types first (lowercase names)
CREATE TYPE timer_status AS ENUM ('active', 'paused', 'completed');
CREATE TYPE todo_status AS ENUM ('in_progress', 'completed');
CREATE TYPE difficulty AS ENUM ('low', 'medium', 'high');

-- Create leaderboards table first (users depends on it)
CREATE TABLE leaderboards (
    leaderboard_id SERIAL PRIMARY KEY, 
    leaderboard_start_date DATE NOT NULL,  -- Fixed typo in column name
    leaderboard_end_date DATE NOT NULL     -- Fixed typo in column name
);

-- Create users table with correct foreign key reference
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, 
    leaderboard_id INT NOT NULL REFERENCES leaderboards(leaderboard_id),  -- Fixed plural 'leaderboards'
    user_email VARCHAR(50) NOT NULL,
    user_nickname VARCHAR(100) NOT NULL,
    user_password VARCHAR(100) NOT NULL,
    user_streak INT NOT NULL,
    user_points INT NOT NULL,
    user_coins INT NOT NULL,
    profile_pic TEXT  --added profile picture attribute to fetch
);

-- Create templates table (with added semicolon)
CREATE TABLE templates(
    temp_id SERIAL PRIMARY KEY,
    temp_name VARCHAR(100) NOT NULL
);

-- Create collections before flashcards (since flashcards references it)
CREATE TABLE collections (
    collection_id SERIAL PRIMARY KEY,
    collection_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Combined flashcards table (merged both definitions)
CREATE TABLE flashcards (
    flashcard_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    flashcard_term VARCHAR(255) NOT NULL,
    flashcard_colour VARCHAR(25),
    flashcard_definition TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Other tables with corrected references and enum usage
-- CREATE TABLE pomodoro_timers(
--     timer_id SERIAL PRIMARY KEY, 
--     user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, 
--     timer_start_time TIME NOT NULL,
--     timer_end_time TIME NOT NULL,
--     status timer_status NOT NULL  -- Lowercase enum type
-- );

CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, 
    note_title VARCHAR(100) NOT NULL UNIQUE,
    note_content TEXT,
    date_created DATE NOT NULL,
    favourite BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE users_flashcards(
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    flashcard_id INT NOT NULL REFERENCES flashcards(flashcard_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, flashcard_id)
);

-- CREATE TABLE todo_lists (
--     todo_id SERIAL PRIMARY KEY, 
--     user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, 
--     todo_description TEXT,
--     status todo_status NOT NULL,  -- Lowercase enum type
--     difficulty difficulty NOT NULL,  -- Lowercase enum type
--     deadline DATE
-- );

CREATE TABLE streaks (
    streak_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
    streak_count INT NOT NULL DEFAULT 0
);

CREATE TABLE temp_notes(
    note_id INT NOT NULL REFERENCES notes(note_id) ON DELETE CASCADE,
    temp_id INT NOT NULL REFERENCES templates(temp_id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, temp_id)
);

CREATE TABLE profiles(
    profile_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    profile_img VARCHAR(255)
);



CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_user_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

--test leaderboard
INSERT INTO leaderboards(leaderboard_id, leaderboard_start_date, leaderboard_end_date)
VALUES
(1, '10-05-2025','17-05-2025');

--dummy user for now
INSERT INTO users (user_id,leaderboard_id, user_email, user_nickname, user_password, user_streak, user_points, user_coins) 
VALUES 
(1,1, 'myemail.com' ,'Test User', '$2b$10$lixETDYjQppF8VbXWJAKYuMxWYIUusRnJPAGY/6EuU2jqnn7t/luW', 3,100 , 0, 'emily.jpg'); --1234 password

--due to manually inseting users in the past
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
 


