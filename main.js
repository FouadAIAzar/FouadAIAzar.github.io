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

  // CLI Modal Logic
  const terminalTrigger = document.getElementById('terminal-trigger');
  const cliModal = document.getElementById('cli-modal');
  const closeCli = document.getElementById('close-cli');
  const cliInput = document.getElementById('cli-input');
  const cliHistory = document.getElementById('cli-history');
  
  // Track current CLI path independently
  let cliPath = '~';
  
  // File System Data
  const fileSystem = {
    '~': {
        type: 'dir',
        children: {
            'about': { type: 'dir', children: {
                'about.txt': { type: 'file', content: "Hello, my name is\n\nFouad Azar.\nI do this because I am bored.\n\nBiomedical Engineer & Bioinformatician specializing in multi-omics databases, machine learning, and spectroscopy. Based in Abu Dhabi." },
                'me.jpg': { type: 'file', content: "[Image File]" }
            }},
            'experience': { type: 'dir', children: {
                'nyu_abu_dhabi.txt': { type: 'file', content: "Role: Research Engineer\nCompany: NYU Abu Dhabi\nDuration: Feb 2025 - Present\nLocation: Abu Dhabi\n\nDescription:\n- Research Engineer at the Public Health Research Center (PHRC).\n- Lead Developer of the OmniLIMS.\n- Focusing on multi-omics data analysis and pipeline development." },
                'prepaire.txt': { type: 'file', content: "Role: Bioinformatician\nCompany: Prepaire\nDuration: Nov 2022 - Jan 2025\n\nDescription:\n- Curated multi-omic databases by systematically annotating and validating personalized biological datasets.\n- Handled genomic, transcriptomic, proteomic, and metabolomic information integration." },
                'freelance.txt': { type: 'file', content: "Role: Biomedical Engineer\nCompany: Freelance\nDuration: Apr 2020 - Oct 2022\n\nDescription:\n- Executed projects in FMRI & EEG convolution and biomechanical simulations.\n- Conducted pitch analysis in speech processing." },
                'institute_bioengineering.txt': { type: 'file', content: "Role: Project Coordinator\nCompany: Institute of Bioengineering\nDuration: Jan 2019 - Dec 2020\n\nDescription:\n- Led team in multi-modal spectroscopy ML applications for urinalysis.\n- Created detailed catalogue of urine constituents." },
                'fh_aachen_research_tech.txt': { type: 'file', content: "Role: Research Technician\nCompany: FH Aachen\nDuration: June 2019 - Aug 2019\n\nDescription:\n- Calibrated and maintained ophthalmological devices." },
                'fh_aachen_research_asst.txt': { type: 'file', content: "Role: Research Assistant\nCompany: FH Aachen\nDuration: June 2019 - Aug 2019\n\nDescription:\n- Conducted finite element analysis to study and replicate stress behavior of kyphotic vertebrae." },
                'fh_aachen_prof_asst.txt': { type: 'file', content: "Role: Professor's Assistant\nCompany: FH Aachen\nDuration: June 2015 - Dec 2020\n\nDescription:\n- Prepared and lectured in various subjects, including Calculus I/II, Information Processing, German, and Biomolecular Physics." }
            }},
            'education': { type: 'dir', children: {
                'msc_biomedical_engineering.txt': { type: 'file', content: "Degree: MSc Biomedical Engineering\nInstitution: FH Aachen, Germany\nGPA: 3.6 (Note: 1.7)\n\nFocus:\n- Specialized in Medical Physics and Bioinformatics." },
                'beng_biomedical_engineering.txt': { type: 'file', content: "Degree: BEng Biomedical Engineering\nInstitution: FH Aachen, Germany\nGPA: 3.2 (Note: 2.3)\n\nFocus:\n- Focus on Medical Instrumentation and Signal Processing." }
            }},
            'skills': { type: 'dir', children: {
                'core_stack.txt': { type: 'file', content: "Languages & Core:\n- PHP\n- Python\n- Bash\n- C/C++\n- MATLAB\n- R\n\nDatabases & Architecture:\n- PostgreSQL\n- MySQL\n- LAMP/LAPP\n- MVC" },
                'ml_data_science.txt': { type: 'file', content: "Frameworks & Libraries:\n- TensorFlow\n- PyTorch\n- Scikit-learn\n- Pandas\n\nMethods:\n- Deep Neural Networks\n- Multivariate Analysis\n- Self-Organizing Maps" },
                'domain_expertise.txt': { type: 'file', content: "Optical Spectroscopy:\n- Fluorescence\n- Absorption\n- EEM\n\nBioinformatics:\n- Multi-omics Databases\n- NGS Technology" }
            }},
            'contact': { type: 'dir', children: {
                'contact_info.txt': { type: 'file', content: "Email: fouad.azar@live.com\n\nSocials:\n- GitHub: https://github.com/FouadAIAzar\n- LinkedIn: https://linkedin.com/in/fouad-a-i-azar" }
            }},
            'CV.pdf': { type: 'file', content: "[PDF File]" }
        }
    }
  };

  function resolvePath(path) {
    // Resolve absolute or relative path to a node in fileSystem
    // Current simple implementation only handles:
    // ~ -> root
    // ~/subdir -> root/subdir
    
    if (path === '~' || path === '/home') return fileSystem['~'];
    if (path.startsWith('~/')) {
        const parts = path.split('/'); // ~ / subdir
        const dirName = parts[1];
        if (fileSystem['~'].children[dirName]) {
            return fileSystem['~'].children[dirName];
        }
    }
    return null;
  }
  
  // Toggle CLI Modal
  if (terminalTrigger && cliModal && closeCli) {
    terminalTrigger.addEventListener('click', () => {
      // Sync CLI path with current section
      if (currentSection === 'about' || !currentSection) {
          cliPath = '~';
      } else {
          cliPath = `~/${currentSection}`;
      }
      const cliPathEl = document.getElementById('cli-path');
      if (cliPathEl) cliPathEl.innerText = cliPath;

      cliModal.classList.remove('hidden');
      cliInput.focus();
    });
    
    closeCli.addEventListener('click', () => {
      cliModal.classList.add('hidden');
    });
    
    // Close on backdrop click
    cliModal.addEventListener('click', (e) => {
      if (e.target === cliModal) {
        cliModal.classList.add('hidden');
      }
    });

    // Focus input on content click
    const cliContent = document.getElementById('cli-content');
    if (cliContent) {
        cliContent.addEventListener('click', () => {
            cliInput.focus();
        });
    }
  }

  // CLI Command Logic
  if (cliInput) {
    cliInput.addEventListener('keydown', (e) => {
      // Tab Autocomplete
      if (e.key === 'Tab') {
          e.preventDefault();
          const val = cliInput.value;
          const parts = val.split(' ');
          
          if (parts.length === 1) {
              // Command Autocomplete
              const cmds = ['help', 'cd', 'ls', 'cat', 'open', 'clear', 'whoami'];
              const current = parts[0].toLowerCase();
              const matches = cmds.filter(c => c.startsWith(current));
              if (matches.length === 1) {
                  cliInput.value = matches[0] + ' ';
              }
          } else if (parts.length === 2) {
              // Argument Autocomplete (Files/Dirs)
              const cmd = parts[0];
              const current = parts[1];
              
              const currentNode = resolvePath(cliPath);
              if (currentNode && currentNode.children) {
                  const options = Object.keys(currentNode.children);
                  // Add '..' if relevant (optional, but standard)
                  if (cliPath !== '~') options.push('..');
                  
                  const matches = options.filter(o => o.startsWith(current));
                  
                  if (matches.length === 1) {
                      cliInput.value = `${cmd} ${matches[0]}`;
                  } else if (matches.length > 1) {
                      // Find common prefix
                      const prefix = matches.reduce((acc, str) => {
                           let i = 0;
                           while(i < acc.length && i < str.length && acc[i] === str[i]) i++;
                           return acc.slice(0, i);
                      });
                      cliInput.value = `${cmd} ${prefix}`;
                  }
              }
          }
          return;
      }

      if (e.key === 'Enter') {
        const command = cliInput.value.trim();
        const args = command.split(' ');
        const cmd = args[0].toLowerCase();
        
        // Add to history
        const historyItem = document.createElement('div');
        historyItem.innerHTML = `
          <div class="flex">
            <span class="mr-2 font-mono">
                <span class="text-green-400">fouad@index</span>:<span class="text-blue-400">${cliPath}</span>$
            </span>
            <span>${command}</span>
          </div>
        `;
        cliHistory.appendChild(historyItem);
        
        // Execute Command
        let output = '';
        
        switch(cmd) {
            case 'help':
                output = `
                  <div class="text-slate-400">
                    Available commands:<br>
                    <span class="text-primary">cd [dir]</span> - Change directory<br>
                    <span class="text-primary">ls</span> - List directory contents<br>
                    <span class="text-primary">cat [file]</span> - Display file content<br>
                    <span class="text-primary">open [file]</span> - Open file in new tab<br>
                    <span class="text-primary">clear</span> - Clear terminal<br>
                    <span class="text-primary">whoami</span> - Display user info
                  </div>
                `;
                break;
                
            case 'ls':
                const currentNode = resolvePath(cliPath);
                if (currentNode && currentNode.type === 'dir') {
                    output = Object.keys(currentNode.children).join('  ');
                } else {
                    output = '';
                }
                break;
                
            case 'cat':
                const fileName = args[1];
                if (!fileName) {
                    output = 'usage: cat [file]';
                } else {
                    const currentNode = resolvePath(cliPath);
                    if (currentNode && currentNode.children && currentNode.children[fileName]) {
                        const fileNode = currentNode.children[fileName];
                        if (fileNode.type === 'file') {
                            // Preserve whitespace with pre tag style or replacement
                            output = fileNode.content.replace(/\n/g, '<br>');
                        } else {
                            output = `cat: ${fileName}: Is a directory`;
                        }
                    } else {
                        output = `cat: ${fileName}: No such file or directory`;
                    }
                }
                break;
                
            case 'cd':
                const target = args[1] || '~';
                
                let newSection = '';
                let newPath = cliPath;
                
                // Handle ..
                if (target === '..') {
                    if (cliPath !== '~') {
                        // Go up one level (simplified: we only have 1 level deep)
                        newPath = '~';
                        newSection = 'about'; 
                    }
                } else if (target === '~' || target === '/home') {
                    newPath = '~';
                    newSection = 'about';
                } else if (target.startsWith('/')) {
                     // Absolute path
                     // Not fully implemented, assume they mean sections
                } else {
                    // Relative path down
                    // Check if it exists in current dir
                    const currentNode = resolvePath(cliPath);
                    if (currentNode && currentNode.children && currentNode.children[target] && currentNode.children[target].type === 'dir') {
                        if (cliPath === '~') {
                            newPath = `~/${target}`;
                            newSection = target;
                        }
                    } else {
                         output = `<span class="text-red-400">cd: no such file or directory: ${target}</span>`;
                         newSection = ''; // Don't move
                    }
                }
                
                if (newSection) {
                    cliPath = newPath;
                    // Update visual path
                    const cliPathEl = document.getElementById('cli-path');
                    if (cliPathEl) cliPathEl.innerText = cliPath;

                    // Scroll the page
                    const sectionEl = document.getElementById(newSection === 'about' ? 'about' : newSection);
                    if (sectionEl) {
                        const offset = newSection === 'about' ? 0 : sectionEl.offsetTop - 80;
                        window.scrollTo({ top: offset, behavior: 'smooth' });
                    }
                }
                break;
                
            case 'clear':
                cliHistory.innerHTML = '';
                break;
                
            case 'whoami':
                output = 'visitor';
                break;
                
            case 'open':
                const openFile = args[1];
                if (!openFile) {
                    output = 'usage: open [file]';
                } else {
                    const currentNode = resolvePath(cliPath);
                    if (currentNode && currentNode.children && currentNode.children[openFile]) {
                        const fileNode = currentNode.children[openFile];
                        if (fileNode.type === 'file') {
                            // Construct path: home/ + relative path
                            let relativePath = '';
                            if (cliPath === '~' || cliPath === '/home') {
                                relativePath = openFile;
                            } else {
                                // cliPath is like ~/experience
                                const dir = cliPath.split('/')[1];
                                relativePath = `${dir}/${openFile}`;
                            }
                            
                            const url = `home/${relativePath}`;
                            window.open(url, '_blank');
                            output = `Opening ${openFile}...`;
                        } else {
                            output = `open: ${openFile}: Is a directory`;
                        }
                    } else {
                        output = `open: ${openFile}: No such file or directory`;
                    }
                }
                break;
                
            case 'rm':
                 if (args[1] === '-rf') {
                     output = "Permission denied: You do not have root access.";
                 } else {
                     output = "rm: missing operand";
                 }
                 break;

            case '':
                break;
                
            default:
                output = `<span class="text-red-400">command not found: ${cmd}</span>`;
        }
        
        if (output) {
            const outputDiv = document.createElement('div');
            outputDiv.className = 'mb-2';
            outputDiv.innerHTML = output;
            cliHistory.appendChild(outputDiv);
        }
        
        // Reset input and scroll
        cliInput.value = '';
        const cliContent = document.getElementById('cli-content');
        cliContent.scrollTop = cliContent.scrollHeight;
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
