console.log("MidiCtrl Script is working!");

/* 
midiCtrl.js features:
  - check for and add MIDI functionality to webpage
  - parse MIDI inputs and returns them as the note name and 'on' or 'off'
*/

let notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

// Check whether browser supports MIDI API
if (navigator.requestMIDIAccess) {
  console.log("This browser supports WebMIDI!");
} else {
  console.log("WebMIDI is not supported in this browser.");
}

// Establish connection with the MIDI devices
navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function onMIDIFailure() {
  console.log("Could not access your MIDI devices.");
}

// Assign listeners to the MIDI devices (inputs)
function onMIDISuccess(midiAccess) {
  console.log(midiAccess);
  for (let input of midiAccess.inputs.values()) {
    input.onmidimessage = getMIDIMessage;
  }
}

const parseNoteNum = (noteNum) => {
  let num = noteNum % 12;
  return notes[num];
};

// Parse MIDI data and pass to handler functions
function getMIDIMessage(message) {
  let command = message.data[0];
  let noteNum = message.data[1];
  let velocity = message.data.length > 2 ? message.data[2] : 0;
  // a velocity value might not be included with a noteOff command
  let note = parseNoteNum(noteNum);
  let noteOn = false;

  // return the value
  switch (command) {
    case 144: // noteOn
      if (velocity > 0) {
        noteOn = true;
        console.log(`${note} is playing`);
        return [note, noteOn];
      } else {
        console.log("sound is not playing");
      }
      break;
    case 128: // noteOff
      noteOn = false;
      console.log(`${note} note off`);
      return [note, noteOn];
  }
}
