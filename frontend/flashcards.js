const scrollLeftButton = document.getElementById('scroll-left');
const scrollRightButton = document.getElementById('scroll-right');
const flashcardsContainer = document.querySelector('.flashcards');

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
    setTimeout(updateScrollButtons, 300); // Update button state after scrolling
});

// Scroll right 
scrollRightButton.addEventListener('click', () => {
    flashcardsContainer.scrollBy({ left: 200, behavior: 'smooth' });
    setTimeout(updateScrollButtons, 300); // Update button state after scrolling
});

// Update scroll buttons on load and when resizing the window
window.addEventListener('load', updateScrollButtons);
window.addEventListener('resize', updateScrollButtons);

// ---------------------------------------------------------------------------------
//pop-up
const createButton = document.getElementById('create-flashcard');
const popup = document.getElementById('flashcard-popup');
const closeButton = document.querySelector('.close-popup');
const flashcardForm = document.getElementById('flashcard-form');
const flashcardTermInput = document.getElementById('flashcard-term');
const flashcardDefinitionInput = document.getElementById('flashcard-definition');

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
            <label for="background-color">Background Color:</label>
            <input type="color" id="background-color"><br>
            <button type="submit">Save Changes</button>
        </form>
        <button id="delete-flashcard">Delete Flashcard</button>
    </div>
`;
document.body.appendChild(flashcardActionPopup);

// Hide the popup initially
flashcardActionPopup.style.display = 'none';

// Function to show the action popup
function showFlashcardActionPopup(flashcardElement) {
    const termInput = document.getElementById('edit-term');
    const definitionInput = document.getElementById('edit-definition');
    const colorInput = document.getElementById('background-color');
    const deleteButton = document.getElementById('delete-flashcard');

    // Populate the popup with the current flashcard data
    termInput.value = flashcardElement.dataset.term;
    definitionInput.value = flashcardElement.dataset.definition;
    colorInput.value = flashcardElement.style.backgroundColor || '#ffffff';

    // Show the popup
    flashcardActionPopup.style.display = 'block';

    // Handle form submission to edit the flashcard
    const editForm = document.getElementById('edit-flashcard-form');
    editForm.onsubmit = (e) => {
        e.preventDefault();
        flashcardElement.dataset.term = termInput.value;
        flashcardElement.dataset.definition = definitionInput.value;
        flashcardElement.querySelector('h2').textContent = termInput.value;
        flashcardElement.style.backgroundColor = colorInput.value;
        flashcardActionPopup.style.display = 'none'; // Hide the popup
    };

    // Handle flashcard deletion
    deleteButton.onclick = () => {
        flashcardElement.remove();
        flashcardActionPopup.style.display = 'none'; // Hide the popup
        updateScrollButtons(); // Update scroll buttons visibility
    };
}

// ---------------------------------------------------------------------------------
// create flashcard pop-up
// Hide the popup when the close button is clicked
document.querySelector('.close-action-popup').addEventListener('click', () => {
    flashcardActionPopup.style.display = 'none';
});

// Handle form submission to create a new flashcard
flashcardForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission

    // Get the term and definition from the input fields
    const term = flashcardTermInput.value.trim();
    const definition = flashcardDefinitionInput.value.trim();

    if (term && definition) {
        // Create a new flashcard element
        const flashcardElement = document.createElement('div');
        flashcardElement.classList.add('flashcard');
        flashcardElement.innerHTML = `
            <h2>${term}</h2>
            <div class="flashcard-menu">...</div>
        `;

        // Store term and definition in the element's dataset
        flashcardElement.dataset.term = term;
        flashcardElement.dataset.definition = definition;

        // Add click event to toggle between term and definition
        flashcardElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('flashcard-menu')) {
                const h2 = flashcardElement.querySelector('h2');
                h2.textContent = h2.textContent === flashcardElement.dataset.term
                    ? flashcardElement.dataset.definition
                    : flashcardElement.dataset.term;
            }
        });

        // Add click event to show the action popup
        flashcardElement.querySelector('.flashcard-menu').addEventListener('click', () => {
            showFlashcardActionPopup(flashcardElement);
        });

        // Append the flashcard to the container
        flashcardsContainer.appendChild(flashcardElement);

        // Clear the form inputs
        flashcardTermInput.value = '';
        flashcardDefinitionInput.value = '';

        // Hide the popup
        popup.classList.remove('active');

        // Update scroll buttons visibility
        updateScrollButtons();
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

    // Select a random flashcard
    const randomFlashcard = flashcards[Math.floor(Math.random() * flashcards.length)];
    test_term = randomFlashcard.term;
    test_definition = randomFlashcard.definition;

    console.log(`Term: ${test_term}, Definition: ${test_definition}`);
    testTermElement.innerHTML = `${test_term}`; // Set the term here

    // Show the popup
    testPopup.style.display = 'block';
    testPopup.classList.add('active');
});

// Select the close button for the test popup
const closeTestPopup = document.querySelector('.close-test-popup');

// Add an event listener to the close button
if (closeTestPopup) {
    closeTestPopup.addEventListener('click', () => {
        const testPopup = document.getElementById('test-flashcard-popup');
        testPopup.classList.remove('active'); // Remove the 'active' class to hide the popup
        testDefinitionInput.value = ''; // Clear the input field
        testResult.style.display = 'none'; // Hide the result message
    });
} else {
    console.error('Close button for test popup not found.');
}

// Handle form submission for testing
testForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const userDefinition = testDefinitionInput.value.trim();

    if (userDefinition.toLowerCase() === test_definition.toLowerCase()) {
        testResult.textContent = 'Correct!';
        testPopup.style.backgroundColor = 'green';
        console.log('correct');
    } else {
        testResult.textContent = `Incorrect! The correct definition is: ${test_definition}`;
        testPopup.style.backgroundColor = 'red';
        console.log('incorrect');
    }

    testResult.style.display = 'block'; // Show the result
});