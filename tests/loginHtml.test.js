// HTML Button Functionality Tests for Login Page
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

describe('Login Page Tests', () => {
  let dom;
  let document;
  let window;

  beforeAll(() => {
    const html = fs.readFileSync(path.join(__dirname, '../frontend/login.html'), 'utf8');
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

  test('Login button with valid email and password', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('button[type="submit"]');
    const errorMessage = document.getElementById('errorMessage');

    emailInput.value = 'test@example.com';
    passwordInput.value = 'ValidPass123';
    loginButton.click();

    expect(errorMessage.textContent).toBe('');
    // Add expectation for successful login navigation if applicable
  });

  test('Login button with email but no password shows error', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('button[type="submit"]');
    const errorMessage = document.getElementById('errorMessage');

    emailInput.value = 'test@example.com';
    passwordInput.value = '';
    loginButton.click();

    expect(errorMessage.textContent).toContain('error');
  });

  test('Login button with password but no email shows error', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('button[type="submit"]');
    const errorMessage = document.getElementById('errorMessage');

    emailInput.value = '';
    passwordInput.value = 'ValidPass123';
    loginButton.click();

    expect(errorMessage.textContent).toContain('error');
  });

  test('Create account button redirects to signup page', () => {
    const createAccountButton = document.querySelector('.createbtn');
    createAccountButton.click();
    expect(window.location.href).toContain('signup.html');
  });
});