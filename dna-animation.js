// Global variables
let t = 0; // Time variable
let targetT = 0; // Target time value for smoothing

function setup() {
  // Create canvas and attach to the specific container
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('dna-canvas');
  canvas.style('display', 'block');
  canvas.style('position', 'fixed'); // Fixed position to stay in background
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1'); // Behind content
  
  noFill();
  strokeWeight(2);
}

function draw() {
  clear(); // Transparent background
  
  // Calculate scroll influence
  // We divide scrollY by a factor to control sensitivity
  // Negative sign makes it scroll "with" the page movement naturally
  let scrollInfluence = -window.scrollY * 0.01;
  
  // Smooth interpolation (lerp) towards the target scroll position
  // This adds a nice "weight" to the DNA movement
  targetT = scrollInfluence;
  t = lerp(t, targetT, 0.1); 
  
  // Styling
  let primaryColor = color(139, 92, 246); // Violet-500 (#8b5cf6)
  let secondaryColor = color(56, 189, 248); // Light Blue (#38bdf8) - for contrast
  
  // Parameters
  let amplitude = height / 8; // Height of the wave
  let frequency = 0.02; // How tight the helix is
  let phaseShift = PI / 2; // 90 degrees (pi/2) as requested.
  let strandSpacing = 20; // Distance between base pairs
  
  // Center the wave vertically
  let centerY = height / 2;
  
  // Loop through x-axis
  for (let x = 0; x < width; x += strandSpacing) {
    // Calculate y positions for the two strands
    // Strand 1
    let y1 = centerY + sin(x * frequency + t) * amplitude;
    
    // Strand 2 with phase shift
    let y2 = centerY + sin(x * frequency + t + phaseShift) * amplitude;
    
    // Draw connections (base pairs)
    stroke(255, 255, 255, 30); // Faint white for connections
    strokeWeight(1);
    line(x, y1, x, y2);
    
    // Draw Strand 1 points/segments
    stroke(primaryColor);
    strokeWeight(3);
    point(x, y1);
    
    // Draw Strand 2 points/segments
    stroke(secondaryColor);
    strokeWeight(3);
    point(x, y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
