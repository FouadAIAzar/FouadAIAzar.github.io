const { Renderer, Stave, Accidental, StaveNote, Beam, Formatter, Dot } = Vex.Flow;

// Create an SVG renderer and attach it to the DIV element named "boo".
const div = document.getElementById('theuh');
const renderer = new Renderer(div, Renderer.Backends.SVG);

// Configure the rendering context.
renderer.resize(450, 150);
const context = renderer.getContext();

// Create a stave of width 400 at position 10, 40 on the canvas.
const stave = new Stave(10, 40, 400);

// Add a clef and time signature.
stave.addClef('treble').addTimeSignature('4/4');

// Connect it to the rendering context and draw!
stave.setContext(context).draw();

const notes = [
  
  new StaveNote({ keys: ['e/5'], duration: '8' }),
  new StaveNote({ keys: ['d/5'], duration: '8' }),
  new StaveNote({ keys: ['b/4'], duration: '16' }),
  new StaveNote({ keys: ['a/4'], duration: '16' }),
  new StaveNote({ keys: ['g/4'], duration: '8' }),
  new StaveNote({ keys: ['a/4'], duration: '8' }),
  new StaveNote({ keys: ['b/4'], duration: '8' }),
  new StaveNote({ keys: ['g/4'], duration: '16' }),
  new StaveNote({ keys: ['a/4'], duration: '16' }),
  new StaveNote({ keys: ['e/4'], duration: '8' }),
];

const beams = Beam.generateBeams(notes);
Formatter.FormatAndDraw(context, stave, notes);
beams.forEach((b) => {
  b.setContext(context).draw();
});

// A helper function to add a dot to a note.
function dotted(note) {
  Dot.buildAndAttach([note]);
  return note;
}

