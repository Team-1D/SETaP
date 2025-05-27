// HTML Button Functionality Tests for Signup Page
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

// HTML Button Functionality Tests 
describe('Signup HTML Button Functionality Tests', () => {
  let dom;
  let document;

  beforeAll(() => {
    const html = fs.readFileSync(path.join(__dirname, '../frontend/signup.html'), 'utf8');
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable"
    });
    document = dom.window.document;
  });

  afterAll(() => {
    dom.window.close();
  });

  test('Create Account button should be present', () => {
    const createAccountButton = document.querySelector('button[type="submit"]');
    expect(createAccountButton).not.toBeNull();
    expect(createAccountButton.textContent).toBe('Create Account');
  });

  test('Error message element should be present', () => {
    const errorMessage = document.getElementById('errorMessage');
    expect(errorMessage).not.toBeNull();
  });

  test('Toggle password visibility icon should be present', () => {
    const togglePasswordButton = document.querySelector('#togglePassword');
    expect(togglePasswordButton).not.toBeNull();
  });
});