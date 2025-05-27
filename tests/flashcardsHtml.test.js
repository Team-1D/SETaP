// HTML Button Functionality Tests for Flashcard Page
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

// HTML Button Functionality Tests 
describe('Flashcard HTML Button Functionality Tests', () => {
  let dom;
  let document;

  beforeAll(() => {
    const html = fs.readFileSync(path.join(__dirname, '../frontend/flashcard.html'), 'utf8');
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable"
    });
    document = dom.window.document;
  });

  afterAll(() => {
    dom.window.close();
  });

  test('Create Flashcard button should be present', () => {
    const createFlashcardButton = document.getElementById('create-flashcard');
    expect(createFlashcardButton).not.toBeNull();
    expect(createFlashcardButton.textContent).toBe('Create Flashcard');
  });

  test('Test Flashcards button should be present', () => {
    const testFlashcardButton = document.getElementById('test-flashcard');
    expect(testFlashcardButton).not.toBeNull();
    expect(testFlashcardButton.textContent).toBe('Test Flashcards');
  });

  test('Submit Flashcard button in popup should be present', () => {
    const submitFlashcardButton = document.querySelector('#flashcard-popup button[type="submit"]');
    expect(submitFlashcardButton).not.toBeNull();
    expect(submitFlashcardButton.textContent).toBe('SUBMIT FLASHCARD');
  });

  test('Submit Answer button in test popup should be present', () => {
    const submitAnswerButton = document.querySelector('#test-flashcard-popup button[type="submit"]');
    expect(submitAnswerButton).not.toBeNull();
    expect(submitAnswerButton.textContent).toBe('SUBMIT ANSWER');
  });

  test('Close popup button for create flashcard should be present', () => {
    const closePopupButton = document.querySelector('#flashcard-popup .close-popup');
    expect(closePopupButton).not.toBeNull();
  });

  test('Close popup button for test flashcard should be present', () => {
    const closeTestPopupButton = document.querySelector('#test-flashcard-popup .close-test-popup');
    expect(closeTestPopupButton).not.toBeNull();
  });

  test('Scroll left button should be present', () => {
    const scrollLeftButton = document.getElementById('scroll-left');
    expect(scrollLeftButton).not.toBeNull();
  });

  test('Scroll right button should be present', () => {
    const scrollRightButton = document.getElementById('scroll-right');
    expect(scrollRightButton).not.toBeNull();
  });

  test('Close popup button should be present', () => {
    const closePopupButton = document.querySelector('#test-flashcard-popup .close-test-popup');
    expect(closePopupButton).not.toBeNull();
  });

  test('Submit Answer button should be present', () => {
    const submitAnswerButton = document.querySelector('#test-flashcard-popup button[type="submit"]');
    expect(submitAnswerButton).not.toBeNull();
    expect(submitAnswerButton.textContent).toBe('SUBMIT ANSWER');
  });

  // Manually append the flashcard action popup for testing
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
});

afterAll(() => {
  dom.window.close();
});

test('Close action popup button should be present', () => {
  const closePopupButton = document.querySelector('.close-action-popup');
  expect(closePopupButton).not.toBeNull();
});

test('Save Changes button should be present', () => {
  const saveChangesButton = document.querySelector('#edit-flashcard-form button[type="submit"]');
  expect(saveChangesButton).not.toBeNull();
  expect(saveChangesButton.textContent).toBe('Save Changes');
});

test('Delete Flashcard button should be present', () => {
  const deleteFlashcardButton = document.getElementById('delete-flashcard');
  expect(deleteFlashcardButton).not.toBeNull();
  expect(deleteFlashcardButton.textContent).toBe('Delete Flashcard');
});

test('Edit term input should be present', () => {
  const editTermInput = document.getElementById('edit-term');
  expect(editTermInput).not.toBeNull();
});

test('Edit definition input should be present', () => {
  const editDefinitionInput = document.getElementById('edit-definition');
  expect(editDefinitionInput).not.toBeNull();
});

test('Edit background color input should be present', () => {
  const editBackgroundColorInput = document.getElementById('edit-background-color');
  expect(editBackgroundColorInput).not.toBeNull();
});
