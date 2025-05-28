// HTML Tests for Notes Page
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

describe('Notes Page Tests', () => {
  let dom;
  let document;
  let window;

  beforeAll(() => {
    const html = fs.readFileSync(path.join(__dirname, '../frontend/notes.html'), 'utf8');
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable"
    });
    document = dom.window.document;
    window = dom.window;
  });

  afterAll(() => {
    dom.window.close();
  });

  
  test('Click "+" button shows creation popup', () => {
    const addButton = document.querySelector('.add-note');
    const popup = document.getElementById('note-popup');
    
    addButton.click();
    expect(popup.style.display).toBe('block');
  });

  
  test('Submit note with title is valid', () => {
    const titleInput = document.getElementById('note-title');
    const submitButton = document.querySelector('#note-popup button[type="submit"]');
    const errorMessage = document.getElementById('note-error-message');

    titleInput.value = 'Test Note';
    submitButton.click();

    expect(errorMessage.textContent).toBe('');
  });

  
  test('Submit empty title shows error', () => {
    const titleInput = document.getElementById('note-title');
    const submitButton = document.querySelector('#note-popup button[type="submit"]');
    const errorMessage = document.getElementById('note-error-message');

    titleInput.value = '';
    submitButton.click();

    expect(errorMessage.textContent).toContain('required');
  });

  test('Difficulty selection updates label', () => {
    const difficultySelect = document.getElementById('note-difficulty');
    const difficultyLabel = document.getElementById('difficulty-label');

    difficultySelect.value = 'Medium';
    difficultySelect.dispatchEvent(new window.Event('change'));
    
    expect(difficultyLabel.textContent).toBe('Medium');
  });

 
  test('Template selection changes background', () => {
    const templateSelect = document.getElementById('note-template');
    const notePreview = document.getElementById('note-preview');

    templateSelect.value = 'Lined';
    templateSelect.dispatchEvent(new window.Event('change'));
    
    expect(notePreview.classList.contains('lined')).toBe(true);
  });
});