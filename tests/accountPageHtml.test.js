// HTML Tests for Account Page
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

describe('Account Page Tests', () => {
  let dom;
  let document;
  let window;

  beforeAll(() => {
    const html = fs.readFileSync(path.join(__dirname, '../frontend/account.html'), 'utf8');
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


  test('Load user data displays correctly', () => {
    const userDataSection = document.getElementById('user-data');
    expect(userDataSection).not.toBeNull();

  });

  test('Load user points displays correctly', () => {
    const pointsDisplay = document.getElementById('user-points');
    expect(pointsDisplay).not.toBeNull();
    // Add check for default 0 points if no data
  });


  test('Load streak count displays correctly', () => {
    const streakDisplay = document.getElementById('streak-count');
    expect(streakDisplay).not.toBeNull();
    // Add check for default 0 streak if no data
  });

  test('Click profile icon opens account page', () => {
    const profileIcon = document.querySelector('.left-side a i.bx.bxs-user');
    profileIcon.click();
    expect(window.location.href).toContain('account.html');
  });
});