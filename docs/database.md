# Database Structure

## Files
- `database.sql`
- `database-pool.js`

## Description
PostgreSQL is used to store users, notes, flashcards, and XP data.


## Tables
- `leaderboards`: leaderboard_id, leaderboard_start_date, leaderboard_end_date  
- `users`: user_id, leaderboard_id, user_email, user_nickname, user_password, user_streak, user_points, user_coins, profile_pic  
- `templates`: temp_id, temp_name  
- `collections`: collection_id, collection_name, created_at  
- `flashcards`: flashcard_id, user_id, flashcard_term, flashcard_colour, flashcard_definition, created_at, updated_at  
- `users_flashcards`: user_id, flashcard_id  
- `notes`: note_id, user_id, note_title, note_content, date_created, favourite  
- `temp_notes`: note_id, temp_id  
- `streaks`: streak_id, user_id, last_updated, streak_count  
- `profiles`: profile_id, user_id, profile_img  
