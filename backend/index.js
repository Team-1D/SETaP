
startTimer();

//Streak
let streak = getStreak();


// Calculate Points // 
function checkMultiplier () { 
    let pointMultiplier = 1;
    if (streak % 5 == 0) {
        pointMultiplier += 0.5
    }
}

function checkPoints() {
    if (seconds % 300 === 0 && seconds !== 0) { 
        points += 10 * seconds / 60;
        updatePointsDisplay();
    }
}

