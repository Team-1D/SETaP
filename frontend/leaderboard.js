// frontend/leaderboard.js

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetching data failed:", error);
        throw error;
    }
}

async function displayLeaderboard() {
    try {
        console.log("Fetching leaderboard data...");
        const leaderboardData = await fetchData('/leaderboard');
        console.log("Received leaderboard data:", leaderboardData);
        const leaderboardList = document.querySelector('#leaderboard-list');
        leaderboardList.innerHTML = ''; // Clear existing list

        leaderboardData.forEach((user, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p class="name">${user.user_nickname}</p>
                <div class="medal ${index < 3 ? (index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze') : ''}">
                    <p class="score">${user.user_points}pt</p>
                    <i class='bx bxs-medal' style="visibility: ${index < 3 ? 'visible' : 'hidden'};"></i>
                </div>
            `;
            leaderboardList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error displaying leaderboard:", error);
    }
}

async function displayCurrentUserRank() {
    try {
        // Replace with your actual method of getting the current user's ID
        const currentUserId = JSON.parse(localStorage.getItem('userId')); // <--- REPLACE WITH ACTUAL USER ID

        console.log(`Fetching user data for user ID: ${currentUserId}`);
        const userData = await fetchData(`/users/${currentUserId}`);
        console.log("Received user data:", userData);

        // Fetch the entire leaderboard to determine the user's rank
        const leaderboardData = await fetchData('/leaderboard');

        // Find the user in the leaderboard data
        const userIndex = leaderboardData.findIndex(user => user.user_id === currentUserId);

        const myRankElement = document.querySelector('#myRank');
        if (userIndex !== -1) {
            // Rank is the index + 1 (since arrays are 0-indexed)
            myRankElement.textContent = `#${userIndex + 1}`;
        } else {
            myRankElement.textContent = "N/A"; // User not found on the leaderboard
        }
    } catch (error) {
        console.error("Error displaying current user's rank:", error);
    }
}

displayLeaderboard(); // display leaderboard
displayCurrentUserRank(); // display users rank