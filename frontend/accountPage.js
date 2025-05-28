document.addEventListener('DOMContentLoaded', async () => {
    // Get user ID from session or URL
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'login.html';
        return;
    }

    // Load user data
    await loadUserData(userId);
    displayLeaderboard(userId);
});


async function loadUserData(userId) {
    try {
        // Fetch user data from API
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const userData = await response.json();
        
        // Update profile picture
        const profilePic = document.getElementById('profile-pic');
        profilePic.src = userData.profile_pic_url || '/pfp/default.png';
        
        // Update username display in multiple places
        const usernameDisplay = userData.user_nickname || 'User';
        document.getElementById('username-display').textContent = usernameDisplay;
        document.getElementById('username-display-field').textContent = usernameDisplay;
        
        // Update email
        document.getElementById('email-display-field').textContent = userData.email || 'No email provided';
        
        // Update points if available
        if (userData.user_points !== undefined) {
            document.getElementById('points-value').textContent = `${userData.user_points} pts`;
        }
        
        // Load streak
        await loadStreak(userId);
        
        // Load leaderboard position
        await loadLeaderboardPosition(userId);
        
    } catch (error) {
        console.error('Error loading user data:', error);
        alert('Failed to load user data. Please try again.');
    }
}

async function loadUserPoints(userId) {
    try {
        const response = await fetch(`/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user points');
        
        const userData = await response.json();
        const points = userData.user_points ?? 0
        document.getElementById('points-value').textContent = `${points} pts`;
    } catch (error) {
        console.error('Error loading user points:', error);
    }
}

async function loadStreak(userId) {
    try {
        const response = await fetch(`/api/streak/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch streak data');
        
        const streakData = await response.json();
        const streakCount = streakData.streak || 0;

        
        document.getElementById('streak-value').textContent = `${streakCount} days`;
        
    } catch (error) {
        console.error('Error loading streak:', error);
    }
}

async function loadLeaderboardPosition(userId) {
    try {
        const response = await fetch('/leaderboard');
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        
        const leaderboard = await response.json();
        const userIndex = leaderboard.findIndex(user => user.user_id == userId);
        
        if (userIndex !== -1) {
            document.getElementById('leaderboard-position').textContent = `#${userIndex + 1}`;
        }
    } catch (error) {
        console.error('Error loading leaderboard position:', error);
    }
}

async function displayLeaderboard(userId) {
    try {
        const response = await fetch(`/leaderboard/${userId}/around`);
        if (!response.ok) throw new Error('Failed to fetch leaderboard data');
        
        const leaderboardData = await response.json();
        const leaderboardList = document.querySelector('#leaderboard-list');
        leaderboardList.innerHTML = ''; // Clear existing list
        
        leaderboardData.forEach((user) => {
            const listItem = document.createElement('li');
            
            // Apply orange color if this is the current user
            const isCurrentUser = user.user_id == userId;
            const nameStyle = isCurrentUser ? 'color: #d8893f; font-weight: bold;' : '';
            
            listItem.innerHTML = `
                <p class="name" style="${nameStyle}">${user.user_nickname}</p>
                <p class="score" style="${nameStyle}">${user.user_points}pt</p>
            `;
            leaderboardList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error displaying leaderboard:", error);
    }
}