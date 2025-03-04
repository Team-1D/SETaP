

































































console.log("working");
// add popup
document.querySelector(".add-note").addEventListener("click", () => {
    document.querySelector("#note-popup").style.display = "block";
});
// close popup
document.querySelector(".close-popup").addEventListener("click", () => {
    document.querySelector("#note-popup").style.display = "none";
});

// Handle form submission
document.querySelector('#note-form').addEventListener('submit', (event) => {
    event.preventDefault();

    // Get form values
    const title = document.querySelector('#note-title').value;
    const difficulty = document.querySelector('#note-difficulty').value;
    const date = document.querySelector('#note-date').value;

    // Hide everything except the full-screen note editor
    document.querySelector('#nav').style.display = 'none';                    //////// USE THIS //////////
    document.querySelector('#filter-container').style.display = 'none';
    document.querySelector('#notes-container').style.display = 'none';
    document.querySelector('#note-popup').style.display = 'none';

    // Show the full-screen note editor
    const fullscreenNote = document.getElementById('fullscreen-note');
    fullscreenNote.style.display = 'block';

    // Set the title and deadline in the full-screen editor
    document.querySelector('#fullscreen-title').textContent = title;
    document.querySelector('#fullscreen-deadline').textContent = `Deadline: ${date}`;

    // Clear the textarea
    document.querySelector('#fullscreen-textarea').value = '';

    // Close the full-screen editor when "Finish" is clicked
    document.querySelector('#close-fullscreen').addEventListener('click', () => {
        // Hide the full-screen editor
        fullscreenNote.style.display = 'none';

        // Show the navbar, filter buttons, and notes container
        document.querySelector('#nav').style.display = 'flex';
        document.querySelector('#filter-container').style.display = 'block';
        document.querySelector('#notes-container').style.display = 'flex';

        // Save the note content
        const noteContent = document.querySelector('#fullscreen-textarea').value;

        // Create a new note preview
        const notesContainer = document.querySelector('#notes-container');
        const note = document.createElement('div');
        note.className = 'note';

        // Add note preview content
        note.innerHTML = `
            <div class="note-preview">
                <h3>${title}</h3>
                <p>Deadline: ${date}</p>
                <button class="edit-note">Edit</button>
            </div>
        `;

        // Insert the new note before the "+" button
        notesContainer.insertBefore(note, document.querySelector('.add-note'));

        // Add event listener for the edit button
        const editButton = note.querySelector('.edit-note');
        editButton.addEventListener('click', () => {
            // Hide everything except the full-screen note editor
            document.querySelector('#nav').style.display = 'none';                  //////// make a function to remove the redundancy /////////
            document.querySelector('#filter-container').style.display = 'none';
            document.querySelector('#notes-container').style.display = 'none';

            // Show the full-screen note editor
            fullscreenNote.style.display = 'block';

            // Set the title, deadline, and content in the full-screen editor
            document.querySelector('#fullscreen-title').textContent = title;
            document.querySelector('#fullscreen-deadline').textContent = `Deadline: ${date}`;
            document.querySelector('#fullscreen-textarea').value = noteContent;

            // Close the full-screen editor when "Finish" is clicked
            document.querySelector('#close-fullscreen').addEventListener('click', () => {
                // Hide the full-screen editor
                fullscreenNote.style.display = 'none';

                // Show the navbar, filter buttons, and notes container
                document.querySelector('#nav').style.display = 'flex';
                document.querySelector('#filter-container').style.display = 'block';
                document.querySelector('#notes-container').style.display = 'flex';

                // Update the note content
                const updatedContent = document.querySelector('#fullscreen-textarea').value;
                note.querySelector('.note-preview h3').textContent = title;
                note.querySelector('.note-preview p').textContent = `Deadline: ${date}`;
                console.log('Updated Note Content:', updatedContent);
            });
        });
    });
});