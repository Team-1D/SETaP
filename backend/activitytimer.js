let seconds = 0;
let points = 0;
let timerInterval;
let isPaused = false;

function startTimer() {
    if (isPaused) return;
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
        checkPoints();
    }, 1000);
}
