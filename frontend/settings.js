document.querySelector('#logout-button').addEventListener('click', async () => {
    window.location.href = 'login.html';
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
    localStorage.removeItem('email');
});