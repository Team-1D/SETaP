//Query selectors for cleaner look xd
const notesContainer = document.querySelector('#notes-container');
//const deadline = document.querySelector('#note-date');
const navbar = document.querySelector('.navbar');
const myTextArea = document.querySelector('#fullscreen-textarea');
const addNoteButton = document.querySelector('.add-note');
const allFavs = document.querySelector('#favourites');
allFavs.addEventListener('click', findFavs);

// Return the notes
let showingFavorites = false;
// Open popup
function addNewNote (){
    console.log('added plus button');
    document.querySelector('.popup-notes').style.display = 'block';
    document.querySelector('#note-title').value = ''; // When u open the pop up it set as empty by default
    document.querySelector('#note-difficulty').value = 'low'; // By dafult the diffulty is Low
    myTextArea.textContent = '';
    // Need to set a dafault date 
};

// Close popup
document.querySelector('.close-popup').addEventListener('click', () => {
    document.querySelector('.popup-notes').style.display = 'none';
});

// Variable to store the currently edited note
let currentNote = null;

// Function to create a new note
const createNote = async (title, content, dateCreated, difficulty) => {
    //for now that we dont have auth
    const userId = 1;
    const favourite = false;
    try {
        const response = await fetch('http://localhost:8080/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, dateCreated,userId , favourite})
        });

        const data = await response.json();
        console.log('Note saved:', data);
        
        // Update the UI
        //addNoteToUI(data.title, data.content, data.dateCreated);
    } catch (error) {
        console.error('Error saving note:', error);
    }


    addNoteToUI(title, content = '', difficulty);

    const chosenTemplate = document.querySelector('#note-template').value;
    //Saving note to localstorage
    const noteObj = {title: title,
                     content: content,
                     date: dateCreated,
                     user: userId,
                     fav: favourite,
                     difficulty: difficulty,
                     template: chosenTemplate
                    };
    localStorage.setItem('note_' + title, JSON.stringify(noteObj));
};

// Create the note
document.querySelector('#note-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting

    const title = document.querySelector('#note-title').value;
    const difficulty = document.querySelector('#note-difficulty').value;
    //console.log(myTextArea.value);
    // if (!currentNote) {
    //     myTextArea.value = '';
    // }
    // deadline.value;
    myTextArea.addEventListener('input', () => {
        console.log('Typing:', myTextArea.textContent);
    });

    console.log(`Title: ${title}`);
    console.log(`Difficulty: ${difficulty}`);
    // console.log(`Date: ${deadline}`);

    // Hide other elements
    navbar.style.display = 'none';
    document.querySelector('.nav-menu-container').style.display = 'none';
    document.querySelector('#filter-container').style.display = 'none';
    notesContainer.style.display = 'none';
    document.querySelector('.popup-notes').style.display = 'none';

    // Show fullscreen note
    document.querySelector(".fullscreen-note").style.display = 'block';
    document.querySelector("#fullscreen-title").textContent = title;
    // after starting new note text area removes whatever there was before
    if (!currentNote) {
        myTextArea.textContent = '';
    }
    
    let chosenTemplate = document.querySelector('#note-template');
    
    if (chosenTemplate.value === 'Blank') {
        document.querySelector('#fullscreen-textarea').style.backgroundImage = '';
    }
    else if (chosenTemplate.value === 'Lined') {
        document.querySelector('#fullscreen-textarea').style.backgroundImage = 'url(templates/lined.svg)';
        document.querySelector('#fullscreen-textarea').style.backgroundRepeat = 'repeat-y';
        document.querySelector('#fullscreen-textarea').style.backgroundSize = '100% 30px';
        document.querySelector('#fullscreen-textarea').style.backgroundPosition = 'top left';
    }
    else if (chosenTemplate.value === 'Grid') {
        document.querySelector('#fullscreen-textarea').style.backgroundImage = 'url(templates/grid.svg)';
        document.querySelector('#fullscreen-textarea').style.backgroundRepeat = 'repeat';
        document.querySelector('#fullscreen-textarea').style.backgroundSize = '30px 30px';
        document.querySelector('#fullscreen-textarea').style.backgroundPosition = 'top left';
    }
            
    // Reset currentNote when creating a new note
    currentNote = null;
    console.log(  'wht is going on', document.querySelector('#fullscreen-textarea').value);
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
        const updatedContent = document.querySelector('#fullscreen-textarea').textContent;
        console.log('This is the updated content', updatedContent);

        // If it's a new note, create it
        if (!currentNote) {
            const dateCreated = new Date().toISOString();
            //console.log('im here');
            createNote(title,  updatedContent, dateCreated, document.querySelector('#note-difficulty').value || 'low');
             myTextArea.textContent= '';
        }
    };

    // // Add event listener for the "Update" button
    // const updateButton = document.querySelector('#update');
    // updateButton.onclick = () => {
    //     console.log('Update button clicked');
        

    //     // Get the updated content
    //     const updatedContent = myTextArea.value;

    //     // Update the current note's content
    //     if (currentNote) {
    //         const newTitle = document.querySelector("#fullscreen-title").textContent;
    //         //const newDate = document.querySelector("#fullscreen-deadline").textContent.replace('Deadline: ', '');

    //         currentNote.querySelector('.note-preview h3').textContent = newTitle;
    //         //currentNote.querySelector('.note-preview p').textContent = `Deadline: ${newDate}`;
    //         console.log('Updated Note Content:', updatedContent);
    //     }

    //     // Hide fullscreen note
    //     document.querySelector('.fullscreen-note').style.display = 'none';

    //     // Show other elements
    //     navbar.style.display = 'flex';
    //     document.querySelector('.nav-menu-container').style.display = 'flex';
    //     document.querySelector('#filter-container').style.display = 'block';
    //     notesContainer.style.display = 'flex';
    // };
});

// Variable to store the selected color
let selectedColor = '#000000'; // Default color is black

// Add event listener for the color picker
const colorPicker = document.querySelector('#textColor');
colorPicker.addEventListener('input', () => {
    selectedColor = colorPicker.value; // Update the selected color
});

// // Apply color to new text
// document.querySelector('#fullscreen-textarea').addEventListener('input', () => {
//     // Apply the selected color to the newly typed text
//     document.execCommand('foreColor', false, selectedColor);
// });

// scroll
// document.addEventListener('DOMContentLoaded', function () {
//     const scrollLeftButton = document.getElementById('scroll-left');
//     const scrollRightButton = document.getElementById('scroll-right');
//     const cardsContainer = document.querySelector('.services__cards');
//     const cards = document.querySelectorAll('.services__card');
//     let currentIndex = 0;

//     scrollLeftButton.addEventListener('click', function () {
//         if (currentIndex > 0) {
//             currentIndex--;
//             updateScrollPosition();
//         }
//     });

//     scrollRightButton.addEventListener('click', function () {
//         if (currentIndex < cards.length - 1) {
//             currentIndex++;
//             updateScrollPosition();
//         }
//     });

//     function updateScrollPosition() {
//         const cardWidth = cards[0].offsetWidth; // Get the width of a card
//         cardsContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
//     }
// });

function addNoteToUI(title, content, difficulty= "low") {

    const note = document.createElement('div');
    note.className = 'note';

    const noteData = JSON.parse(localStorage.getItem('note_' + title));
    const isFav = noteData && noteData.fav; // Check if the note is favourited
    console.log('difficulty:',difficulty);

    note.innerHTML = `
    <div class="note-preview">
        <h3>${title}</h3>
        <span class="difficulty-badge ${difficulty.toLowerCase()}">${difficulty}</span>
        <div class="button-container">
            <button class="delete-note">Delete</button>
            <button class="edit-note">Edit</button>
            <button class="add-favourite"><i class="bx bxs-heart"></i></button>
        </div>
    </div>
    `;

    // Adding favourite button
    addFav(note, title);
    myTextArea.textContent = content;
    // Add event listener for the delete button
    const deleteButton = note.querySelector('.delete-note');

    deleteButton.addEventListener('click',  async() => {
        try {
            // Remove from local storage
            localStorage.removeItem('note_' + title);
            // Remove from UI
            note.remove();
            console.log(`Note "${title}" deleted from local storage`);

            const noteData = await getNoteByName(title);
            console.log('note:', noteData);
            const noteId = noteData.note_id;
            const response = await fetch(`http://localhost:8080/notes/${noteId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to delete note from server');
            }
            if (response.ok){
                console.log('Deleted note from database');
            }
            
        } catch (error) {
            console.error('Error deleting note:', error);
        }

    });

    note.addEventListener('click', () => {
        if (classList.contains('edit-note') || classList.contains('delete-note') || classList.contains('add-favourite')) {
            return;
        }
        setTemplateBackground(template);
    });

    // Append the new note to the notes container
    notesContainer.appendChild(note);
    
    // Add event listener for the edit button
    const editButton = note.querySelector('.edit-note');
    editButton.addEventListener('click',  () => editNote(title, note));
}

function setTemplateBackground(template) {
    const textarea = document.querySelector('#fullscreen-textarea');
    if (template === 'Blank') {
        textarea.style.backgroundImage = '';
    } else if (template === 'Lined') {
        textarea.style.backgroundImage = 'url(templates/lined.svg)';
        textarea.style.backgroundRepeat = 'repeat-y';
        textarea.style.backgroundSize = '100% 30px';
        textarea.style.backgroundPosition = 'top left';
    } else if (template === 'Grid') {
        textarea.style.backgroundImage = 'url(templates/grid.svg)';
        textarea.style.backgroundRepeat = 'repeat';
        textarea.style.backgroundSize = '30px 30px';
        textarea.style.backgroundPosition = 'top left';
    }
}

async function editNote(myTitle, note){
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

    const noteData = await getNoteByName(myTitle);
    console.log('note:', noteData);
    const noteContent = noteData.note_content;
    console.log(`how fun ${JSON.stringify(noteContent)}, ${noteContent}`);

    // Set the title, deadline, and content in the fullscreen note
    document.querySelector("#fullscreen-title").textContent = myTitle;
    myTextArea.textContent = noteContent;
    console.log(myTextArea.textContent);

    const localNoteData = JSON.parse(localStorage.getItem('note_' + myTitle));
    const template = localNoteData && localNoteData.template ? localNoteData.template : 'Blank';
    setTemplateBackground(template);
    document.querySelector('#note-template').value = template;

    // Add event listener for the "Update" button
    const updateButton = document.querySelector('#update');
    updateButton.onclick = () => {
        console.log('Update button clicked');
        // Get the updated content
        const updatedContent = document.querySelector('#fullscreen-textarea').textContent;

        // Update the current note's content
        if (currentNote) {
            const newTitle = document.querySelector("#fullscreen-title").textContent;
            //const newDate = document.querySelector("#fullscreen-deadline").textContent.replace('Deadline: ', '');

            currentNote.querySelector('.note-preview h3').textContent = newTitle;
            //currentNote.querySelector('.note-preview p').textContent = `Deadline: ${newDate}`;
            console.log('Updated Note Content:', updatedContent);
        }

        // Hide fullscreen note
        document.querySelector('.fullscreen-note').style.display = 'none';

        // Show other elements
        navbar.style.display = 'flex';
        document.querySelector('.nav-menu-container').style.display = 'flex';
        document.querySelector('#filter-container').style.display = 'block';
        notesContainer.style.display = 'flex';

        const noteID =noteData.note_id
        const noteTitle = noteData.note_title;
        const noteDate = noteData.date_created;
        updateNote(noteID, noteTitle, updatedContent,noteDate);
    };
}


async function updateNote(id, title, content, dateCreated) {
    try {
        const response = await fetch(`http://localhost:8080/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({title,content,dateCreated})
        });

        if (!response.ok) {
            throw new Error('Failed to update note');
        }

        const updatedNote = await response.json();
        console.log('Note updated:', updatedNote);

        // Update in localStorage
        const key = 'note_' + title;
        const storedNote = JSON.parse(localStorage.getItem(key));

        if (storedNote) {
            storedNote.content = content;
            localStorage.setItem(key, JSON.stringify(storedNote));
            console.log('Note content updated in localStorage');
        }

        return updatedNote;
    } catch (error) {
        console.error('Error updating note:', error);
    }
}

// add favourite button and its functions
async function addFav(note, noteName){
    const favButton = note.querySelector('.add-favourite');
    favButton.addEventListener('click', async function() {
        //const id = this.dataset.note_id;
        const heartIcon = this.querySelector('i');
        // Toggle heart color between red and default
        const isFavourited = heartIcon.style.color === 'red';

        try {
            const noteData = await getNoteByName(noteName);
            console.log('note:', noteData);
            const noteId = noteData.note_id;
            console.log(`how fun ${JSON.stringify(noteData)}, ${noteId}`);

            if (!noteId) {
                console.error('Note ID not found for title:', title);
                return;
            }
            const response = await fetch(`http://localhost:8080/notes/favourite/${noteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });
    
            const data = await response.json();
            if(data.error){
                console.error('Server error:', data.error);
                return; 
            }
            heartIcon.style.color = isFavourited ? '' : 'red';

            // Update the note in localStorage to reflect the favourite status change
            const noteDataToUpdate = JSON.parse(localStorage.getItem(`note_${noteName}`));

            if (noteDataToUpdate) {
                // Update the favourite status of the note
                noteDataToUpdate.fav = !isFavourited; // Toggle the favourite status
                localStorage.setItem(`note_${noteName}`, JSON.stringify(noteDataToUpdate));
            }

        } catch (error) {
            console.error('Error toggling favourite:', error);
        }
    });
}

async function findFavs() {
    // Toggle the state
    showingFavorites = !showingFavorites;
    
    // Clear existing displayed notes
    removeAllNotes();

    if (showingFavorites) {
        // Show only favorites
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            if (key.startsWith('note_')) {
                try {
                    const noteData = JSON.parse(localStorage.getItem(key));

                    // Check if the note is favourited
                    if (noteData.fav) {
                        // Add this favourited note to the UI
                        addNoteToUI(noteData.title, noteData.content, noteData.difficulty || 'low');
                    }
                } catch (e) {
                    console.error(`Error parsing note from localStorage for key "${key}":`, e);
                }
            }
        }
    } else {
        // Show all notes
        loadAllUserNotes();
    }
}
//getting the note by finding the title --> due to using locastorage this is possible
async function getNoteByName(title) {
    console.log('Fetching note with title:', title);
    try {
        const response = await fetch(`http://localhost:8080/notes/name/${encodeURIComponent(title)}`);
        
        if (!response.ok) {
            const errorText = await response.text(); // read the HTML
            throw new Error(`Server returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Received note data:', data);
        return data; 
    } catch (err) {
        console.error('Error fetching note by name:', err);
        return { error: true };
    }
}

//this is needed as a page reload needs to put everything in again
function loadAllUserNotes(){
    addNoteButton.addEventListener('click',addNewNote);
    // Remove this line: removeAllNotes();
    
    //when the page loads this will load in all the individual notes
    console.log('reloading page');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('note_')) {
            try {
                const noteData = JSON.parse(localStorage.getItem(key));

                if (noteData && noteData.title) {
                    addNoteToUI(noteData.title, noteData.content, noteData.difficulty || 'low');
                }
            } catch (e) {
                console.error(`Error parsing note from localStorage for key "${key}":`, e);
            }
        }
    }
}

function removeAllNotes(){
    const notes = notesContainer.querySelectorAll('.note');
    notes.forEach(note => note.remove());
}

// At the end of your file, replace the current loadAllUserNotes() call with:
showingFavorites = false;
loadAllUserNotes();


const textArea = document.getElementById('fullscreen-textarea');

// custom scrolling for notes to line up with template
const lineHeight = 30;

textArea.addEventListener('wheel', function (e) {
    const scrollAmount = lineHeight; 

    if (e.deltaY > 0) {
        textArea.scrollTop += scrollAmount;  // scroll down
    } else {
        textArea.scrollTop -= scrollAmount;  // scroll up
    }

    e.preventDefault();
});
