//Query selectors for cleaner look xd
const notesContainer = document.querySelector('#notes-container');
const deadline = document.querySelector('#note-date');
const navbar = document.querySelector('.navbar');
// Open popup
document.querySelector('.add-note').addEventListener('click', () => {
    document.querySelector('.popup').style.display = 'block';
    document.querySelector('#note-title').value = ''; // When u open the pop up it set as empty by default
    document.querySelector('#note-difficulty').value = 'low'; // By dafult the diffulty is Low
    // Need to set a dafault date 
});

// Close popup
document.querySelector('.close-popup').addEventListener('click', () => {
    document.querySelector('.popup').style.display = 'none';
});

// Variable to store the currently edited note
let currentNote = null;

// Function to create a new note
const createNote = async (title, content, dateCreated) => {
    //for now that we dont have auth
    const userId = 1
    try {
        const response = await fetch('http://localhost:8080/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, dateCreated,userId })
        });

        const data = await response.json();
        console.log('Note saved:', data);
        
        // Update the UI
        //addNoteToUI(data.title, data.content, data.dateCreated);
    } catch (error) {
        console.error('Error saving note:', error);
    }

    const note = document.createElement('div');
    note.className = 'note';

    note.innerHTML = `
    <div class="note-preview">
        <h3>${title}</h3>
        <p>Deadline: ${deadline.value}</p>
        <div class="button-container">
            <button class="delete-note">Delete</button>
            <button class="edit-note">Edit</button>
            <button class="add-favourite"><i class="bx bxs-heart"></i></button>
        </div>
    </div>
    `;

    // Append the new note to the notes container
    notesContainer.appendChild(note);
    // Add event listener for the edit button
    const editButton = note.querySelector('.edit-note');
    editButton.addEventListener('click', () => {
        console.log('Edit button clicked');
        // Set the current note being edited
        currentNote = note;
        // Hide other elements
        navbar.style.display = 'none';
        document.querySelector('.nav-menu-container').style.display = 'none';
        document.querySelector('#filter-container').style.display = 'none';
        notesContainer.style.display = 'none';

        // Show fullscreen note
        document.querySelector('.fullscreen-note').style.display = 'block';

        // Set the title, deadline, and content in the fullscreen note
        document.querySelector("#fullscreen-title").textContent = title;
        document.querySelector("#fullscreen-deadline").textContent = `Deadline: ${deadline.value}`;
        document.querySelector('#fullscreen-textarea').value = content;
    });
};

// Create the note
document.querySelector('#note-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting

    const title = document.querySelector('#note-title').value;
    const difficulty = document.querySelector('#note-difficulty').value;
    deadline.value;

    console.log(`Title: ${title}`);
    console.log(`Difficulty: ${difficulty}`);
    console.log(`Date: ${deadline}`);

    // Hide other elements
    navbar.style.display = 'none';
    document.querySelector('.nav-menu-container').style.display = 'none';
    document.querySelector('#filter-container').style.display = 'none';
    notesContainer.style.display = 'none';
    document.querySelector('.popup').style.display = 'none';

    // Show fullscreen note
    document.querySelector(".fullscreen-note").style.display = 'block';
    document.querySelector("#fullscreen-title").textContent = title;
    document.querySelector("#fullscreen-deadline").textContent = `Deadline: ${deadline}`;
    document.querySelector('#fullscreen-textarea').value = '';

    // Reset currentNote when creating a new note
    currentNote = null;

    // Add event listener for the "Finish" button
    const finishButton = document.querySelector('#close-fullscreen');
    finishButton.onclick = () => {
        console.log('Finish button clicked');

        // Hide fullscreen note
        document.querySelector('.fullscreen-note').style.display = 'none';

        // Show other elements
        navbar.style.display = 'flex';
        document.querySelector('.nav-menu-container').style.display = 'flex';
        document.querySelector('#filter-container').style.display = 'block';
        notesContainer.style.display = 'flex';

        // Get the updated content
        const updatedContent = document.querySelector('#fullscreen-textarea').value;

        // If it's a new note, create it
        if (!currentNote) {
            createNote(title, deadline, updatedContent);
        }
    };

    // Add event listener for the "Update" button
    const updateButton = document.querySelector('#update');
    updateButton.onclick = () => {
        console.log('Update button clicked');

        // Get the updated content
        const updatedContent = document.querySelector('#fullscreen-textarea').value;

        // Update the current note's content
        if (currentNote) {
            const newTitle = document.querySelector("#fullscreen-title").textContent;
            const newDate = document.querySelector("#fullscreen-deadline").textContent.replace('Deadline: ', '');

            currentNote.querySelector('.note-preview h3').textContent = newTitle;
            currentNote.querySelector('.note-preview p').textContent = `Deadline: ${newDate}`;
            console.log('Updated Note Content:', updatedContent);
        }

        // Hide fullscreen note
        document.querySelector('.fullscreen-note').style.display = 'none';

        // Show other elements
        navbar.style.display = 'flex';
        document.querySelector('.nav-menu-container').style.display = 'flex';
        document.querySelector('#filter-container').style.display = 'block';
        notesContainer.style.display = 'flex';
    };
});
//We need delete note, favourite, 

// Variable to store the selected color
let selectedColor = '#000000'; // Default color is black

// Add event listener for the color picker
const colorPicker = document.querySelector('#textColor');
colorPicker.addEventListener('input', () => {
    selectedColor = colorPicker.value; // Update the selected color
});

// Apply color to new text
document.querySelector('#fullscreen-textarea').addEventListener('input', () => {
    // Apply the selected color to the newly typed text
    document.execCommand('foreColor', false, selectedColor);
});

// scroll
document.addEventListener('DOMContentLoaded', function () {
    const scrollLeftButton = document.getElementById('scroll-left');
    const scrollRightButton = document.getElementById('scroll-right');
    const cardsContainer = document.querySelector('.services__cards');
    const cards = document.querySelectorAll('.services__card');
    let currentIndex = 0;

    scrollLeftButton.addEventListener('click', function () {
        if (currentIndex > 0) {
            currentIndex--;
            updateScrollPosition();
        }
    });

    scrollRightButton.addEventListener('click', function () {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateScrollPosition();
        }
    });

    function updateScrollPosition() {
        const cardWidth = cards[0].offsetWidth; // Get the width of a card
        cardsContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
});