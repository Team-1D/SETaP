


fetch(`http://localhost:8080/username/${userId}`)
.then(response => response.json())
.then(data => {
  document.querySelector('#username').textContent = data.nickname;
})
.catch(err => {
  document.querySelector('#username').textContent = 'Error loading nickname';
  console.error(err);
});


//fetch streak 

fetch(`http://localhost:8080/streak/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Assuming `data.streak` contains the streak number
      document.querySelector('#streak-count').textContent = data.streak;
    })
    .catch(error => {
      console.error('Error fetching streak:', error);
      document.querySelector('#streak-count').textContent = 'Error';
    });

      //fetch xp points
    
      fetch(`http://localhost:8080/xp/${userId}`)
      .then(res => res.json())
      .then(data => {
        document.querySelector('#xp-points').textContent = data.xp;
      })
      .catch(err => {
        console.error('Error fetching XP:', err);
        document.querySelector('#xp-points').textContent = 'Error';
      });