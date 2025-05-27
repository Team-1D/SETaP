// HTML Button Functionality Tests for Login Page
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

// HTML Button Functionality Tests 
describe('Login HTML Button Functionality Tests', () => {
  let dom;
  let document;

  beforeAll(() => {
    const html = fs.readFileSync(path.join(__dirname, '../frontend/login.html'), 'utf8');
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable"
    });
    document = dom.window.document;
  });

  afterAll(() => {
    dom.window.close();
  });

  test('Login button should be present', () => {
    const loginButton = document.querySelector('button[type="submit"]');
    expect(loginButton).not.toBeNull();
    expect(loginButton.textContent).toBe('Login');
  });

  test('Create an account button should be present', () => {
    const createAccountButton = document.querySelector('.createbtn');
    expect(createAccountButton).not.toBeNull();
    expect(createAccountButton.textContent).toBe('Create an account');
  });

  test('Toggle password visibility icon should be present', () => {
    const togglePasswordButton = document.getElementById('togglePassword');
    expect(togglePasswordButton).not.toBeNull();
  });
});