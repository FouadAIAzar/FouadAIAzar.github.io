// Theme toggle functionality
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('.theme-toggle .icon');
  themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Burger menu functionality
function toggleMenu() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.side-nav');
  burger.classList.toggle('active');
  nav.classList.toggle('active');
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  updateThemeIcon(savedTheme);

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const nav = document.querySelector('.side-nav');
    const burger = document.querySelector('.burger');
    if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
      toggleMenu();
    }
  });
});