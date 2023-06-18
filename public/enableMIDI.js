console.log("MidiCtrl Script is working!");

/* 
enableMidi.js features:
  - adds midi playability:
    - check for MIDI compatabilty and devices
    - allow midi inputs to be received and interpretted
    - use script.js to play sounds from those MIDI inputs, 
    based on note name and 'on' / 'off'
*/

let tempMelody;
let notesRinging = [];

// Allows user to play any notes in any order with their connected device.
// Returns an array of the notes and durations
function enableMidiDevice(/* params? */) {
  // initialize tempMelody & notesRinging
  tempMelody = [];
  notesRinging = [];

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
    // console.log(midiAccess);
    for (let input of midiAccess.inputs.values()) {
      input.onmidimessage = getMIDIMessage;
    }
  }

  let notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

  const parseNoteNum = (noteNum) => {
    let note = notes[noteNum % 12];
    return note + Math.floor(noteNum / 12 - 1);
  };

  // Initialize ToneJS access
  let sampler = initializeToneJS();

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
          sampler.releaseAll();
          playNote(note);
          console.log(`${note} is playing`);
          tempMelody.push(note);
          notesRinging.push(note);
          return [note, noteOn];
        } else {
          //   console.log("sound is not playing");
        }
        break;
      case 128: // noteOff
        noteOn = false;
        if (notesRinging.length === 0) {
          tempMelody.push("REST");
        } else {
          /* remove a note from notesRinging
             NOTE: it does NOT matter which note we remove. It only matters that 
             their is either sound (at least one note) or none at all */
          notesRinging.pop();
        }
        console.log(`${note} note off`);
        return [note, noteOn];
    }
  }
}

const recordMelody = () => {
  enableMidiDevice();
};

const playRecordedMelody = () => {
  console.log("tempmelody = " + tempMelody);
  if (tempMelody != undefined && tempMelody.length != 0) {
    playMelodyWithoutDuration(tempMelody);
  }
  transportTest();
};
