// Initialize timer when page loads
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
        import('./activitytimer.js')
            .then(module => module.startActivityTimer(userId))
            .catch(err => console.error("Timer error:", err));
    }
});

// Clean up when leaving page
window.addEventListener('beforeunload', () => {
    import('./activitytimer.js')
        .then(module => module.stopActivityTimer())
        .catch(err => console.error("Timer error:", err));
});