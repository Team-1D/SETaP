# Leaderboard

## Frontend
- `leaderboard.html`
- `leaderboard.js`

## Backend
- `leaderboardController.js`
- `streak.js`

## Description
The Leaderboard feature is our main feature that makes revision gamified, by encouraging user engagement by displaying a ranked list of users based on their accumulated XP. 

### Logic
#### Backend
- `getLeaderboard`: Retrieves a ranked list of all users based on their points using SQL RANK() OVER clause.
- `getUser`: Retrieves ranking data for a specific user.
- `updateUserPoints`: Allows updating a user's points in the database.

#### Frontend
- Displays a scrollable list of users and their rankings.
- Shows the current user's rank separately using an element with ID `myRank`.
- Navigation elements and styling maintain consistency with the rest of the application.

### Justification
We implemented a leaderboard to help motivate users by gamifying their study session. When a user sees their ranked progress, it acts as an incentive to study consistently to climb the ranks, adding a competitive element which can help improve study retention and engagement.


