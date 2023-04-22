const NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

// Check whether browser supports MIDI API
if (navigator.requestMIDIAccess) {
  console.log("This browser supports WebMIDI!");
} else {
  console.log("WebMIDI is not supported in this browser.");
}

// Establish connection with the MIDI devices
navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
  console.log(midiAccess);

  let inputs = midiAccess.inputs;
  let outputs = midiAccess.outputs;
}

function onMIDIFailure() {
  console.log("Could not access your MIDI devices.");
}

// Assign listeners to the MIDI devices (inputs)
function onMIDISuccess(midiAccess) {
  for (var input of midiAccess.inputs.values()) {
    input.onmidimessage = getMIDIMessage;
  }
}

function getMIDIMessage(midiMessage) {
  console.log(midiMessage);
}

const parseNoteNum = (noteNum) => {
  let num = noteNum % 12;
  return NOTES[num];
};

// Parse MIDI data and pass to handler functions
function getMIDIMessage(message) {
  let command = message.data[0];
  let noteNum = message.data[1];
  let velocity = message.data.length > 2 ? message.data[2] : 0;
  // a velocity value might not be included with a noteOff command

  // return the value
  switch (command) {
    case 144: // noteOn
      if (velocity > 0) {
        note = parseNoteNum(noteNum);
        console.log(`${note} is playing`);
      } else {
        console.log("sound is not playing");
      }
      break;
    case 128: // noteOff
      //   console.log("note off");
      break;
  }
}
