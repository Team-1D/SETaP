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

### Justification

#### Normalisation and Modularity
- Normalised to reduce redundancy and improve data integrity. Related entities (e.g. users, flashcards, notes, streaks) are separated into distinct tables with appropriate foreign key relationships
- Tables like `users_flashcards` and `temp_notes` create many-to-many relationships which enables features like shared flashcards or reusable templates

#### Enum Usage
- Custom `ENUM` types (`timer_status`, `todo_status`, `difficulty`) are used to constrain certain fields to a specific set of values; helps with improving consistency and reducing potential input errors.

#### Referential Integrity
- All FK constraints have `ON DELETE CASCADE` where necessary to ensure related child records are cleaned up automatically when a parent record is deleted to help maintain referential integrity.

#### Gamified Design
- `leaderboards`, `streaks`, and `user_points` fields support gamified elements like weekly challenges, experience points, and user rankings.
- The `users` table has the fields `user_streak`, `user_points`, and `user_coins` which are directly linked to performance and reward systems.

#### Flashcards & Notes
- Flashcards are decoupled from collections and users for flexibility which allows flashcards to be reused or categorised in multiple ways.
- `notes` and `temp_notes` allow for structured notetaking with the option of applying pre-defined templates for consistency in formatting.

#### Time-Based Features
- Fields like `created_at`, `updated_at`, and the `update_modified_column` help users with auditing and tracking activity or when data is modified.

#### Security 
- Passwords are stored as hashes to make sure that sensitive information is managed securely.
