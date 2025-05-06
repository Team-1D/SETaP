// Initialize timer when page loads
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    console.log('commons userid', userId);
    if (userId) {
        //import( { startActivityTimer } from '/frontend/activitytimer.js');
        import('./activitytimer.js')
            .then(module => module.startActivityTimer(userId))
            .catch(err => console.error("Timer error:", err));
            console.log('started activitytimer');
    }
});

// Clean up when leaving page
window.addEventListener('beforeunload', () => {
    //import { startActivityTimer } from '/frontend/activitytimer.js';
    import('./activitytimer.js')
        .then(module => module.stopActivityTimer())
        .catch(err => console.error("Timer error:", err));
});