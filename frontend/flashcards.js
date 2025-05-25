// DOM Elements
const scrollLeftButton = document.getElementById('scroll-left');
const scrollRightButton = document.getElementById('scroll-right');
const flashcardsContainer = document.querySelector('.flashcards');

const createButton = document.getElementById('create-flashcard');
const popup = document.getElementById('flashcard-popup');
const closeButton = document.querySelector('.close-popup');
const flashcardForm = document.getElementById('flashcard-form');
const flashcardTermInput = document.getElementById('flashcard-term');
const flashcardDefinitionInput = document.getElementById('flashcard-definition');
const colorInput = document.getElementById('background-color');

let flashcards = [];
let currentFlashcardIndex = 0; // Track the current flashcard index
let userPoints = 0; // Track user points
const userId = 1; // for testing

// Function to add flashcard to UI
function addFlashcardToUI(flashcard) {
    const flashcardElement = document.createElement('div');
    flashcardElement.classList.add('flashcard');
    flashcardElement.style.backgroundColor = flashcard.colour || '#ffffff';
    flashcardElement.innerHTML = `
        <h2>${flashcard.term}</h2>
        <div class="flashcard-menu">...</div>
    `;
    
    // Store term and definition in the element's dataset
    flashcardElement.dataset.term = flashcard.term;
    flashcardElement.dataset.definition = flashcard.definition;
    flashcardElement.dataset.id = flashcard.id; // Store the ID

    // Append to the container
    flashcardsContainer.appendChild(flashcardElement);

    // Add click event to show the action popup
    flashcardElement.querySelector('.flashcard-menu').addEventListener('click', () => {
        showFlashcardActionPopup(flashcardElement);
    });
}

// Function to update the visibility of scroll buttons
function updateScrollButtons() {
    const flashcards = flashcardsContainer.querySelectorAll('.flashcard');
    const showScrollButtons = flashcards.length > 3;

    // Show or hide scroll buttons based on the number of flashcards
    scrollLeftButton.style.display = showScrollButtons ? 'block' : 'none';
    scrollRightButton.style.display = showScrollButtons ? 'block' : 'none';

    // Enable or disable scroll buttons based on scroll position
    if (showScrollButtons) {
        scrollLeftButton.disabled = flashcardsContainer.scrollLeft === 0;
        scrollRightButton.disabled =
            flashcardsContainer.scrollLeft + flashcardsContainer.offsetWidth >= flashcardsContainer.scrollWidth;
    }
}

// Scroll left 
scrollLeftButton.addEventListener('click', () => {
    flashcardsContainer.scrollBy({ left: -200, behavior: 'smooth' });
    setTimeout(updateScrollButtons, 300);
});

// Scroll right 
scrollRightButton.addEventListener('click', () => {
    flashcardsContainer.scrollBy({ left: 200, behavior: 'smooth' });
    setTimeout(updateScrollButtons, 300);
});

// Update scroll buttons on load and when resizing the window
window.addEventListener('load', updateScrollButtons);
window.addEventListener('resize', updateScrollButtons);

// Show the popup when "Create Flashcard" is clicked
createButton.addEventListener('click', () => {
    popup.classList.add('active');
});

// Hide the popup when the close button is clicked
closeButton.addEventListener('click', () => {
    popup.classList.remove('active');
});

// Create a popup for flashcard actions
const flashcardActionPopup = document.createElement('div');
flashcardActionPopup.classList.add('flashcard-action-popup');
flashcardActionPopup.innerHTML = `
    <div class="popup-content">
        <span class="close-action-popup">x</span>
        <h2>Flashcard Options</h2>
        <form id="edit-flashcard-form">
            <label for="edit-term">Edit Term:</label>
            <input type="text" id="edit-term"><br>
            <label for="edit-definition">Edit Definition:</label>
            <input type="text" id="edit-definition"><br>
            <label for="edit-background-color">Background Color:</label>
            <input type="color" id="edit-background-color"><br>

            <button type="submit">Save Changes</button>
        </form>
        <button id="delete-flashcard">Delete Flashcard</button>
    </div>
`;
document.body.appendChild(flashcardActionPopup);
flashcardActionPopup.style.display = 'none'; // Hide the popup initially

// Function to show the action popup
function showFlashcardActionPopup(flashcardElement) {
    const termInput = document.getElementById('edit-term');
    const definitionInput = document.getElementById('edit-definition');
    const deleteButton = document.getElementById('delete-flashcard');

    // Populate the popup with the current flashcard data
    termInput.value = flashcardElement.dataset.term;
    definitionInput.value = flashcardElement.dataset.definition;
    const id = flashcardElement.dataset.id; // Retrieve the ID
    const editColorInput = document.getElementById('edit-background-color');
    editColorInput.value = rgbToHex(flashcardElement.style.backgroundColor || '#ffffff');

    // Show the popup
    flashcardActionPopup.style.display = 'block';

    // Handle flashcard deletion
    deleteButton.onclick = async () => {
    const id = flashcardElement.dataset.id; // Ensure you have the ID stored
    try {
        await deleteFlashcard(id); // Call the function to delete from backend
        flashcardElement.remove(); // Remove from UI
        flashcardActionPopup.style.display = 'none'; // Hide the popup
        updateScrollButtons(); // Update scroll buttons visibility
    } catch (error) {
        console.error('Error deleting flashcard:', error);
    }
};

    // Handle form submission to edit the flashcard
    const editForm = document.getElementById('edit-flashcard-form');
    editForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const id = flashcardElement.dataset.id; // Retrieve the flashcard ID
    const term = termInput.value;
    const definition = definitionInput.value;
    const colour = editColorInput.value; // Get the updated color

    try {
        const updatedFlashcard = await updateFlashcard(id, term, definition, colour);
        if (updatedFlashcard) {
            flashcardElement.dataset.term = term;
            flashcardElement.dataset.definition = definition;
            flashcardElement.querySelector('h2').textContent = term;
            flashcardElement.style.backgroundColor = colour || '#ffffff'; // Fallback to white if color is not set            flashcardActionPopup.style.display = 'none'; // Hide the popup
        }
    } catch (error) {
        console.error('Error updating flashcard:', error);
    }
};
}

// ---------------------------------------------------------------------------------
// create flashcard pop-up
// Hide the popup when the close button is clicked
document.querySelector('.close-action-popup').addEventListener('click', () => {
    flashcardActionPopup.style.display = 'none';
});

// Handle form submission to create a new flashcard
flashcardForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission
    
    const term = flashcardTermInput.value.trim();
    const definition = flashcardDefinitionInput.value.trim();
    const colour = colorInput.value; // Get the selected color

    if (term && definition) {
        const newFlashcard = await createFlashcard(term, definition, colour, userId);
        addFlashcardToUI(newFlashcard); // Add new flashcard to the UI

        // Clear the form inputs
        flashcardTermInput.value = '';
        flashcardDefinitionInput.value = '';
        colorInput.value = '#ffffff'; // Reset color

        // Hide the popup
        popup.classList.remove('active');
    } else {
        alert('Please fill in both the term and definition.');
    }
});


// Update scroll buttons on load and when resizing the window
window.addEventListener('load', updateScrollButtons);
window.addEventListener('resize', updateScrollButtons);

// ---------------------------------------------------------------------------------
//test-pop-up

const testButton = document.getElementById('test-flashcard');
const testPopup = document.getElementById('test-flashcard-popup');
const testTermElement = document.getElementById('test-term');
const testForm = document.getElementById('test-flashcard-form');
const testDefinitionInput = document.getElementById('test-definition');
const testResult = document.getElementById('test-result');


let test_term = '';
let test_definition = '';
// Show the Test Flashcard popup
testButton.addEventListener('click', () => {
    if (flashcards.length === 0) {
        alert('No flashcards available to test.');
        return;
    }

    currentFlashcardIndex = 0; // Reset index for a new test
    userPoints = 0; // Reset points
    showNextFlashcard(); // Show the first flashcard
});

function showNextFlashcard() {
    if (currentFlashcardIndex < flashcards.length) {
        const currentFlashcard = flashcards[currentFlashcardIndex];
        test_term = currentFlashcard.term;
        test_definition = currentFlashcard.definition;

        testTermElement.innerHTML = `${test_term}`; // Display the term
        testResult.style.display = 'none'; // Hide previous result
        testPopup.classList.add('active'); // Show the popup
        testDefinitionInput.value = ''; // Clear the input field
    } else {
        // End of test
        testResult.textContent = `Test complete! Your score: ${userPoints}/${flashcards.length}`;
        testResult.style.display = 'block'; // Show final score
        testDefinitionInput.style.display = 'none'; // Hide input
        document.querySelector('button[type="submit"]').disabled = true; // Disable submit button
    }
}

// Select the close button for the test popup
const closeTestPopup = document.querySelector('.close-test-popup');

// Add an event listener to the close button
if (closeTestPopup) {
    closeTestPopup.addEventListener('click', () => {
        testPopup.classList.remove('active'); // Hide pop up
        testDefinitionInput.value = ''; // Clear input field
        testResult.style.display = 'none'; // Hide result message
    });
} else {
    console.error('Close button for test popup not found.');
}

// Handle form submission for testing
testForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const userDefinition = testDefinitionInput.value.trim();

    if (userDefinition.toLowerCase() === test_definition.toLowerCase()) {
        userPoints++; // Increase user points for correct answer
        testResult.textContent = 'Correct!';
        testPopup.style.backgroundColor = 'green'; // Change background to green

        // Revert color after 1.5 seconds
        setTimeout(() => {
            testPopup.style.backgroundColor = ''; // Reset to original
        }, 1250);
    } else {
        testResult.textContent = `Incorrect! The correct definition is: ${test_definition}`;
        testPopup.style.backgroundColor = 'red'; // Change background to red

    
        setTimeout(() => {
            testPopup.style.backgroundColor = ''; // Reset to original
        }, 1250);
    }

    currentFlashcardIndex++; // Move to the next flashcard
    showNextFlashcard(); // Show the next flashcard
});

// Function to update user score in the database
async function updateUserScore(newPoints) {
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/score`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ points: newPoints }) // Send the points to be added
        });

        if (!response.ok) {
            throw new Error('Failed to update user score');
        }

        console.log('User score updated successfully');
    } catch (error) {
        console.error('Error updating user score:', error);
    }
}

// Function to create a new flashcard
async function createFlashcard(term, definition, colour, userId) {
    console.log({ term, definition, colour, userId });
    try {
        const response = await fetch('http://localhost:8080/flashcards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId, 
                term, 
                definition, 
                colour: colour || '#ffffff'  // Provide default if undefined
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create flashcard');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating flashcard:', error);
        throw error; // Re-throw to handle in the calling code
    }
}

// Function to get a flashcard by ID
async function getFlashcardById(id) {
    try {
        const response = await fetch(`http://localhost:8080/flashcards/id/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch flashcard');
        }
        return await response.json(); // Return the flashcard
    } catch (error) {
        console.error('Error fetching flashcard:', error);
    }
}

// Function to update a flashcard
async function updateFlashcard(id, term, definition, colour) {
    try {
        console.log(`Updating flashcard in DB with ID=${id}, term=${term}, definition=${definition}, colour=${colour}`); // Add logging
        const response = await fetch(`http://localhost:8080/flashcards/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, term, definition, colour }) // Ensure colour is included
        });
        if (!response.ok) {
            throw new Error('Failed to update flashcard');
        }
        return await response.json(); // Return updated flashcard
    } catch (error) {
        console.error('Error updating flashcard:', error);
    }
}

// Function to delete a flashcard
async function deleteFlashcard(id) {
    try {
        const response = await fetch(`http://localhost:8080/flashcards/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete flashcard');
        }
        return await response.json(); // Return deleted flashcard info
    } catch (error) {
        console.error('Error deleting flashcard:', error);
    }
}


// Function to load all flashcards for a user
async function loadFlashcards() {
    try {
        const response = await fetch(`http://localhost:8080/flashcards/${userId}`);
        const data = await response.json();
        
        flashcards = data; // ✅ update global array
        flashcards.forEach(addFlashcardToUI); // Add each flashcard to the UI
    } catch (error) {
        console.error('Error loading flashcards:', error);
    }
}

function rgbToHex(rgb) {
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
    return result
        ? "#" + result.slice(1).map(x => ("0" + parseInt(x).toString(16)).slice(-2)).join('')
        : rgb; // fallback
}

// Load flashcards when the page loads
window.addEventListener('DOMContentLoaded', loadFlashcards);

