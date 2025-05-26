//not being used in final version of app

const profilepics = {
    'Emily': "http://localhost:8080/pfp/emily.jpeg",
    'Abigail': "http://localhost:8080/pfp/abigail.jpg",
    'Harvey': "http://localhost:8080/pfp/harvey.png",
    'Leah': "http://localhost:8080/pfp/leah.jpeg",
    'Haley': "http://localhost:8080/pfp/haley.jpg",
    'Maru': "http://localhost:8080/pfp/maru.png",
    'Demetrius': "http://localhost:8080/pfp/demetrius.jpg",
    'Gus': "http://localhost:8080/pfp/gus.jpg",
    'Sam': "http://localhost:8080/pfp/sam.jpg",
    'Shane': "http://localhost:8080/pfp/shane.jpg",
    'Caroline': "http://localhost:8080/pfp/caroline.jpg",
    'Robin': "http://localhost:8080/pfp/robin.jpg"
};

function getProfilePics(name){
    return profilepics[name] || "http://localhost:8080/pfp/default.jpg";
};

//this is for frontend
// async function loadProfilePicture(userId) {
//     try {
//         const response = await fetch(`/api/user/${userId}`);
//         const data = await response.json();

//         if (data.url) {
//             document.getElementById('profilePic').src = data.url;
//         }
//     } catch (err) {
//         console.error('Failed to load profile picture:', err);
//     }
// }

//<img id="profilePic" src="default.jpg" alt="Profile Picture" />