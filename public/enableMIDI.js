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
    if (command != 248 && command != 254) {
      // console.log(`commnd = ${command}`);
    }

    let noteNum = message.data[1];
    let velocity = message.data.length > 2 ? message.data[2] : 0;
    // a velocity value might not be included with a noteOff command
    let note = parseNoteNum(noteNum);
    let noteOn = false;

    let prevNoteStartTime;
    let currNoteStartTime = 0;

    switch (command) {
      case 144:
        console.log(currNoteStartTime);

        prevNoteStartTime = currNoteStartTime;

        let tempNoteInfo;
        // New note is being played:
        if (velocity > 0) {
          // console.log(note);
          if (prevNoteStartTime > 0) {
            console.log(`prevTime =  ${prevNoteStartTime}`);
            // At least 1 note already played. Update the prev duration
            tempMelody[tempMelody.length - 2][1] = (
              Tone.now() - prevNoteStartTime
            ).toFixed(2);
          } else {
            // First note of the melody
            Tone.start();
          }
          // Create a new noteInfo with a placeholder duration
          tempNoteInfo = [note, "duration"];

          // set currNoteStartTime
          currNoteStartTime = Tone.now();
          // console.log("now = " + Tone.now());

          console.log(`${note} at ${currNoteStartTime.toFixed(2)}`);
          noteOn = true;
          sampler.releaseAll();
          playNote(note);
          tempMelody.push(tempNoteInfo);
          notesRinging.push(note);
          console.log(tempMelody);

          return [note, noteOn];
        } else {
          // velocity = 0 still gives a MIDI number of 144
          /* "A velocity of 0 is sometimes used in conjunction with a command 
          value of 144 (which typically represents “note on”) to indicate a “note off” 
          message, so it’s helpful to check if the given velocity is 0 as an alternate 
          way of interpreting a “note off” message." */

          // console.log(note);
          // console.log(`${notesRinging.length}`);
          console.log(`${note} at ${Tone.now().toFixed(2)}`);

          noteOn = false;
          /* NOT SURE IF I ACTUALLY NEED THIS CODE:*/
          // Update duration of PREVIOUS note
          // if (tempMelody.length > 1) {
          //   console.log("tempMel length > 1");
          //   console.log(`now ${Tone.now()} - prevTime (${prevNoteStartTime}):`);
          //   console.log((Tone.now() - prevNoteStartTime).toFixed(2));
          //   tempMelody[tempMelody.length - 2][1] =
          //     Tone.now() - prevNoteStartTime; // now - prevTime = duration
          // }
          if (velocity === 0) {
            notesRinging.pop();
            // no other notes are playing
            if (notesRinging.length === 0) {
              // console.log("No notes are ringing");
              // update the CURRENT note duration
              tempMelody[tempMelody.length - 1][1] =
                Tone.now() - prevNoteStartTime; // now - prevTime = duration
              // add a rest with a duration placeholder
              tempMelody.push(["REST", "duration"]);
              currNoteStartTime = Tone.now();
            }
          }
          console.log(tempMelody);
          return [note, noteOn];
        }

      case 128: // noteOff
        // DUPLICATE CODE FROM DIRECTLY ABOVE (less edited version here (older))
        console.log(`ringing = ${notesRinging}`);
        noteOn = false;
        if (notesRinging.length === 0) {
          tempMelody.push("REST");
          // Update duration of previous note
          tempMelody[tempMelody.length - 2][1] = Tone.now();
          console.log(`tempMelody = ${tempMelody}`);
        } else {
          /* remove a note from notesRinging
             NOTE: it does NOT matter which note we remove. It only matters that 
             their is either sound (at least one note) or none at all */
          notesRinging.pop();
          console.log(`tempMelody = ${tempMelody}`);
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
  // transportTest(); // UNNECESSARY
};
