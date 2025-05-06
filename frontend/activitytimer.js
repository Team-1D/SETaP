console.log('activity timer activated');

let activityTimer;
let currentXp = 10; // Starts at 10 XP
const INTERVAL_MINUTES = 15;
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;

export function startActivityTimer(userId) {
    stopActivityTimer();
    activityTimer = setInterval(async () => {
        try {

            // 1. Get current streak from backend
            console.log("Fetching streak...");
            let streakRes = await fetch(`/api/streak/${userId}`);

            console.log('streakRes:', streakRes);

            if (!streakRes.ok) {
                throw new Error(`HTTP error! status: ${streakRes.status}`);
            }
            
    
            const { streak } = await streakRes.json();
            console.log('streak', streak);

            const data = streak.data || 0;
            console.log ('Current streak:', streak);
            // 2. Calculate XP: Base (increasing) × Streak Multiplier
            const multiplier = 1 + Math.floor(streak / 7); // 1x, 2x, 3x...
            const xpToAward = currentXp * multiplier;
            console.log('xptoaward',xpToAward );
            console.log('multiplier',multiplier );
            // 3. Award XP
            const xpRes = await fetch('/api/update-xp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, xp: xpToAward })
            });

            if (!xpRes.ok) {
                throw new Error(`HTTP error! status: ${xpRes.status}`);
            }
            
            console.log(`Awarded ${xpToAward} XP (Base: ${currentXp} × ${multiplier}x)`);
            
            // 4. Increase base XP for next interval (+10)
            currentXp += 10;
            console.log('Current xp', currentXp);
        
        } catch (error) {
            console.error("Failed to award XP:", error);
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