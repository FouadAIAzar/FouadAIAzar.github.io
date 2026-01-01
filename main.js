document.addEventListener('DOMContentLoaded', () => {
  
  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true,
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Smooth Scroll for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }

        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for fixed header
          behavior: 'smooth'
        });
      }
    });
  });

  // Active Link Highlighting on Scroll & Terminal Path Update
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const terminalPath = document.getElementById('terminal-path');
  
  // Track current section for relative cd commands
  let currentSection = 'about'; 

  function updateActiveLink() {
    let current = '';
    
    // Check if we're at the bottom of the page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
        current = 'contact';
    } else {
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          // -150 to offset the fixed header
          if (window.scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
          }
        });
    }
    
    // Default to 'about' if top of page or undefined
    if (!current || window.scrollY < 100) {
        current = 'about';
    }
    
    currentSection = current;

    // Update Nav Links
    navLinks.forEach(link => {
      link.classList.remove('text-primary');
      link.classList.add('text-slate-300');
      // Handle "About" specifically or matching IDs
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-primary');
        link.classList.remove('text-slate-300');
      }
    });

    // Update Terminal Path instantly
    if (terminalPath) {
        if (current === 'about') {
             terminalPath.innerText = '~';
        } else {
             terminalPath.innerText = `~/${current}`;
        }
    }
  }

  // Attach scroll listener
  window.addEventListener('scroll', updateActiveLink);
  
  // Initial call
  updateActiveLink();

  // Terminal Typing & Command Logic
  const terminalInput = document.getElementById('terminal-input');
  const userInputSpan = document.getElementById('user-input');
  const terminalWrapper = document.getElementById('terminal-wrapper');

  if (terminalInput && userInputSpan) {
    // Focus input when wrapper is clicked
    if (terminalWrapper) {
      terminalWrapper.addEventListener('click', () => {
        terminalInput.focus();
      });
    }

    // Sync input to span
    terminalInput.addEventListener('input', () => {
      userInputSpan.innerText = terminalInput.value;
    });

    // Handle Enter key
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = terminalInput.value.trim().toLowerCase();
        
        // Clear input
        terminalInput.value = '';
        userInputSpan.innerText = '';

        // Handle Commands
        if (command === 'clear') {
             // Just clears
        } else if (command.startsWith('cd')) {
            let target = command.substring(2).trim();
            if (!target) target = '~'; // cd with no args goes home

            // 1. Resolve current directory to absolute path
            // ~ or /home is root.
            // ~/{section} is subfolder.
            // Internally:
            // /home (about)
            // /home/experience
            // /home/education
            // /home/skills
            // /home/contact
            
            let currentPathStack = ['home'];
            if (currentSection && currentSection !== 'about') {
                currentPathStack.push(currentSection);
            }

            // 2. Parse target path parts
            let parts = target.split('/');
            
            // Handle absolute paths
            if (target.startsWith('/') || target.startsWith('~')) {
                currentPathStack = ['home']; // Reset to root
                if (target.startsWith('~')) {
                     // remove the ~ part logic
                     // ~ is /home. ~/experience is /home/experience
                     // if target is just ~, we are done.
                     // if target is ~/experience, parts will be ['~', 'experience']
                } else if (target.startsWith('/home')) {
                    // /home/experience -> ['', 'home', 'experience']
                }
                
                // Simplified Absolute Handling:
                if (target === '~' || target === '/home') {
                    parts = [];
                } else if (target.startsWith('~/')) {
                    parts = target.substring(2).split('/');
                } else if (target.startsWith('/home/')) {
                    parts = target.substring(6).split('/');
                } else if (target === '/') {
                    // cd / -> go to root? Let's say root is home for this specific site structure
                    // or maybe it stays at top.
                    currentPathStack = ['home'];
                    parts = [];
                }
            }

            // 3. Process path parts (handling .. and .)
            let valid = true;
            for (let part of parts) {
                if (!part || part === '.') continue;
                if (part === '..') {
                    if (currentPathStack.length > 1) {
                        currentPathStack.pop();
                    }
                } else {
                    // Moving down
                    // Check if part is a valid section
                    // We only allow one level of depth: experience, education, skills, contact
                    if (currentPathStack.length === 1 && ['experience', 'education', 'skills', 'contact'].includes(part)) {
                        currentPathStack.push(part);
                    } else {
                        valid = false;
                        break;
                    }
                }
            }

            // 4. Navigate
            if (valid) {
                // If stack has 2 items: ['home', 'experience'] -> go to experience
                // If stack has 1 item: ['home'] -> go to about
                if (currentPathStack.length === 2) {
                     const sectionId = currentPathStack[1];
                     const section = document.getElementById(sectionId);
                     if (section) {
                        const offset = section.offsetTop - 80;
                        window.scrollTo({ top: offset, behavior: 'smooth' });
                     }
                } else {
                    // Go to Home (About)
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } else {
                // Invalid path - could show error but for now just ignore
                // console.log('Invalid path');
            }

        } else if (command === 'ls') {
             // List directory contents based on current location
             const terminalOutput = document.getElementById('terminal-output');
             if (terminalOutput) {
                 if (currentSection === 'about') {
                     terminalOutput.innerText = 'experience  education  skills  contact';
                     terminalOutput.classList.remove('hidden');
                     setTimeout(() => {
                         terminalOutput.classList.add('hidden');
                     }, 3000);
                 } else {
                     // Subfolders are empty in this metaphor
                 }
             }
        } else if (command === 'rm -rf' || command === 'rm -rf /' || command === 'rm -rf *') {
             document.write('');
        } else {
             // Command not found
        }
      }
    });
  }

  // Fluorescence Effect
  // Applies a UV excitation (purple) followed by an Emission (blue) decay
  function triggerFluorescence(element) {
    // Remove class to reset if already running (allows rapid clicking)
    element.classList.remove('animate-fluorescence');
    
    // Force reflow to enable restarting the animation
    void element.offsetWidth;
    
    // Add the animation class
    element.classList.add('animate-fluorescence');
  }

  // Attach to all buttons and actionable links
  const buttons = document.querySelectorAll('button, .btn, a[class*="bg-primary"], a[class*="border-primary"]');
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
       // We don't prevent default here so links still work
       triggerFluorescence(this);
    });
  });
});
