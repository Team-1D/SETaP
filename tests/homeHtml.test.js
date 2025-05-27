// HTML Button Functionality Tests
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

// HTML Button Functionality Tests 
describe('Home HTML Button Functionality Tests', () => {
  let dom;
  let document;

  beforeAll(() => {
    const html = fs.readFileSync(path.join(__dirname, '../frontend/home.html'), 'utf8');
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable"
    });
    document = dom.window.document;
  });

  afterAll(() => {
    dom.window.close();
  });

  test('Profile button should be present', () => {
    const profileButton = document.querySelector('.left-side a[href="accounts.html"]');
    expect(profileButton).not.toBeNull();
  });

  test('Leaderboard button should be present', () => {
    const leaderboardButton = document.querySelector('.left-container a[href="leaderboard.html"]');
    expect(leaderboardButton).not.toBeNull();
  });

  test('Notes button should be present', () => {
    const notesButton = document.querySelector('.right-container a[href="notes.html"]');
    expect(notesButton).not.toBeNull();
  });

  test('Flashcards button should be present', () => {
    const flashcardsButton = document.querySelector('.right-container a[href="flashcards.html"]');
    expect(flashcardsButton).not.toBeNull();
  });

  test('Settings button should be present', () => {
    const settingsButton = document.querySelector('.right-side a[href="#"]'); // Adjust if needed
    expect(settingsButton).not.toBeNull();
  });

  test('Timer button should be present', () => {
    const timerButton = document.querySelector('.right-side a[href="#"]'); // Adjust if needed
    expect(timerButton).not.toBeNull();
  });
});