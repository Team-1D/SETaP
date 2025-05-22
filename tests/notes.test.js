const { createNote, getNotes, getNoteByName, updateNote, deleteNote, toggleFavourite } = require('../backend/notes');
const { pool } = require('../backend/database-pool');


// Mock the pool.query method
jest.mock('../backend/database-pool', () => {
  const mPool = {
    query: jest.fn()
  };
  return { pool: mPool };
});

// Reset mocks after each test
describe('Notes CRUD operations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // createNote
  test('createNote inserts a note and returns it', async () => {
    const mockNote = {
      note_id: 1,
      user_id: 1,
      note_title: 'Test Note',
      note_content: 'This is a test',
      date_created: '2024-01-01',
      favourite: false,
    };

    pool.query.mockResolvedValueOnce({ rows: [mockNote] });

    const result = await createNote('Test Note', 'This is a test', '2024-01-01', 1);
    expect(result).toEqual(mockNote);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO notes'),
      [1, 'Test Note', 'This is a test', '2024-01-01', false]
    );
  });

  // getNotes
  test('getNotes returns all notes', async () => {
    const mockNotes = [{ note_id: 1, note_title: 'A Note' }];
    pool.query.mockResolvedValueOnce({ rows: mockNotes });

    const result = await getNotes();
    expect(result).toEqual(mockNotes);
  });

  // getNoteByName
  test('getNoteByName returns a note by title', async () => {
    const mockNote = { note_id: 1, note_title: 'Test' };
    pool.query.mockResolvedValueOnce({ rows: [mockNote] });

    const result = await getNoteByName('Test');
    expect(result).toEqual(mockNote);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE note_title = $1'),
      ['Test']
    );
  });

  // updateNote
  test('updateNote updates a note and returns it', async () => {
    const mockUpdated = {
      note_id: 1,
      note_title: 'Updated',
      note_content: 'New content',
      date_created: '2024-01-02',
    };
    pool.query.mockResolvedValueOnce({ rows: [mockUpdated] });

    const result = await updateNote(1, 'Updated', 'New content', '2024-01-02');
    expect(result).toEqual(mockUpdated);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE notes SET'),
      ['Updated', 'New content', '2024-01-02', 1]
    );
  });

  // deleteNote
  test('deleteNote deletes a note and returns it', async () => {
    const mockDeleted = { note_id: 1 };
    pool.query.mockResolvedValueOnce({ rows: [mockDeleted] });

    const result = await deleteNote(1);
    expect(result).toEqual(mockDeleted);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM notes WHERE note_id = $1'),
      [1]
    );
  });

  // toggleFavourite
  test('toggleFavourite toggles the favourite status and returns the updated note', async () => {
    const mockNoteBefore = { favourite: false };
    const mockNoteAfter = { note_id: 1, favourite: true };

    // First query: get current favourite
    pool.query.mockResolvedValueOnce({ rows: [mockNoteBefore] });
    // Second query: update favourite
    pool.query.mockResolvedValueOnce({ rows: [mockNoteAfter] });

    const result = await toggleFavourite(1);
    expect(result).toEqual(mockNoteAfter);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT favourite'),
      [1]
    );
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE notes SET favourite = $1'),
      [true, 1]
    );
  });

  test('toggleFavourite returns error if note not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const result = await toggleFavourite(999);
    expect(result).toEqual({ error: 'Note not found' });
  });
});

// HTML Button Functionality Tests
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';


// HTML Button Functionality Tests 
describe('Notes HTML Button Functionality Tests', () => {
  let dom;
  let document;

  beforeAll(() => {
    const html = fs.readFileSync(path.join(__dirname, '../frontend/notes.html'), 'utf8');
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable"
    });
    document = dom.window.document;
  });

  afterAll(() => {
    dom.window.close();
  });

  test('Favourites button should be present', () => {
    const favouritesButton = document.getElementById('favourites');
    expect(favouritesButton).not.toBeNull();
    expect(favouritesButton).toBeTruthy();
  });

  test('Add note button should be present and clickable', () => {
    const addNoteButton = document.querySelector('.add-note');
    expect(addNoteButton).not.toBeNull();
    const notePopup = document.getElementById('note-popup');
    addNoteButton.click();
    expect(notePopup.classList.contains('active')).toBe(true); // Update 'active' to your actual class name
  });

  test('Close popup button should be present', () => {
    const closeButton = document.querySelector('.close-popup');
    expect(closeButton).not.toBeNull();
  });

  test('Create note button should be present in the form', () => {
    const createNoteButton = document.querySelector('#note-form button[type="submit"]');
    expect(createNoteButton).not.toBeNull();
  });

  test('Close button should hide the popup', () => {
    const closeButton = document.querySelector('.close-popup');
    const notePopup = document.getElementById('note-popup');
    const addNoteButton = document.querySelector('.add-note');
    
    // Open popup first
    addNoteButton.click();
    expect(notePopup.classList.contains('active')).toBe(true);
    
    // Close popup
    closeButton.click();
    expect(notePopup.classList.contains('active')).toBe(false);
  });
});
