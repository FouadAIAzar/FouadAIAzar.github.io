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
  const themeIcon = document.querySelector('.theme-icon');
  themeIcon.className = theme === 'light' ? 'fa-solid fa-moon theme-icon' : 'fa-solid fa-sun theme-icon';
}

// Navbar scroll behavior
function handleNavbarScroll() {
  const navbar = document.getElementById('mainNav');
  if (window.scrollY > 50) {
    navbar.classList.add('navbar-scrolled');
  } else {
    navbar.classList.remove('navbar-scrolled');
  }
}

// Scroll to element smoothly
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 70,
      behavior: 'smooth'
    });
  }
}

// Add active class to navbar items based on scroll position
function updateActiveNavItem() {
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navItems.forEach(item => {
    item.classList.remove('active');
    const href = item.getAttribute('href');
    if (href && href.substring(1) === currentSection) {
      item.classList.add('active');
    }
  });
}

// Skill animation
function animateSkills() {
  const skills = document.querySelectorAll('.skill');
  
  skills.forEach((skill, index) => {
    skill.style.animationDelay = `${index * 0.1}s`;
    skill.classList.add('animated');
  });
}

// Preloader
function handlePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        preloader.classList.add('fade-out');
        setTimeout(function() {
          preloader.style.display = 'none';
        }, 500);
      }, 500);
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Handle preloader
  handlePreloader();
  
  // Initialize AOS animations
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
  
  // Initialize theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  updateThemeIcon(savedTheme);
  
  // Add scroll event listeners
  window.addEventListener('scroll', handleNavbarScroll);
  window.addEventListener('scroll', updateActiveNavItem);
  
  // Auto-collapse navbar on mobile when clicking a nav item
  const navLinks = document.querySelectorAll('.nav-link');
  const menuToggler = document.querySelector('.navbar-toggler');
  const navMenu = document.querySelector('#navbarResponsive');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navMenu.classList.contains('show')) {
        menuToggler.click();
      }
      
      // Smooth scroll to section if it's a hash link
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        event.preventDefault();
        scrollToElement(href.substring(1));
      }
    });
  });
  
  // Animate skills on load
  animateSkills();
  
  // Back to top button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Initialize navbar scroll state on page load
  handleNavbarScroll();
  updateActiveNavItem();
});