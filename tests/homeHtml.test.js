// HTML Tests for Home Page
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

describe('Home Page Tests', () => {
  let dom;
  let document;
  let window;

  beforeAll(() => {
    const html = fs.readFileSync(path.join(__dirname, '../frontend/home.html'), 'utf8');
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

  test('Challenge friends button redirects to leaderboard', () => {
    const challengeButton = document.querySelector('.left-container a[href="leaderboard.html"]');
    challengeButton.click();
    expect(window.location.href).toContain('leaderboard.html');
  });

  test('Write notes button redirects to notes page', () => {
    const notesButton = document.querySelector('.right-container a[href="notes.html"]');
    notesButton.click();
    expect(window.location.href).toContain('notes.html');
  });

  test('Create flashcards button redirects to flashcards page', () => {
    const flashcardsButton = document.querySelector('.right-container a[href="flashcards.html"]');
    flashcardsButton.click();
    expect(window.location.href).toContain('flashcards.html');
  });

  test('Load main page shows welcome banner and navbar', () => {
    const welcomeBanner = document.querySelector('.welcome-banner');
    const navbar = document.querySelector('nav');
    
    expect(welcomeBanner).not.toBeNull();
    expect(navbar).not.toBeNull();
  });
});