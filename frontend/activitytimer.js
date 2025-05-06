console.log('im here');
// /frontend/js/activitytimer.js
let activityTimer;
let currentXp = 10; // Starts at 10 XP
const INTERVAL_MINUTES = 1;
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;


export function startActivityTimer(userId) {
    stopActivityTimer();
    
    activityTimer = setInterval(async () => {
        try {
            console.log("Fetching streak...");
            // 1. Get current streak from backend
            const streakResponse = await fetch(`/api/streak/${userId}`);
            if (!streakResponse.ok) {
                throw new Error('Failed to fetch streak');
            }
            
            const streakData = await streakResponse.json();
            console.log('streak:', streakData.streak);
            
            // 2. Calculate XP: Base (increasing) × Streak Multiplier
            const multiplier = 1 + Math.floor(streakData.streak / 7); // 1x, 2x, 3x...
            const xpToAward = currentXp * multiplier;
            console.log('xpToAward:', xpToAward);
            console.log('multiplier:', multiplier);
            
            // 3. Award XP
            const xpResponse = await fetch('/api/update-xp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, xp: xpToAward })
            });
            
            if (!xpResponse.ok) {
                throw new Error('Failed to update XP');
            }
            
            const xpResult = await xpResponse.json();
            console.log(`Awarded ${xpToAward} XP (Base: ${currentXp} × ${multiplier}x). New total: ${xpResult.newPoints}`);
            
            // 4. Increase base XP for next interval (+10)
            currentXp += 10;
            console.log('Current xp:', currentXp);
        
        } catch (error) {
            console.error("Error in activity timer:", error);
        }
    }, INTERVAL_MS);
}

export function stopActivityTimer() {
    if (activityTimer) {
        clearInterval(activityTimer);
        currentXp = 10; // Reset to base XP
    }
}

// Auto-stop when page closes
window.addEventListener('beforeunload', () => {
    if (localStorage.getItem('userId')) {
        stopActivityTimer();
    }
});
