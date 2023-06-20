/* 
recordMelody.js features:
  - record button starts listening for midi data

  - when the user plays their last note and then clicks listen back or submit, the 
  record function will stop listening for midi data
  
  - playback functionality (listen back button) will use stuff from script.js, and 
  enables the user to listen back before they submit

  - submit button adds that melody to the JSON object that is representing our melodies
  database 

  - I think for now, each melody should be given an ID. 
    - perhaps in the future you can add tags to your melody 
    (ie. folk, jazz, chick corea, South of the River, long, Bb major)


*/
// melody algo generatives

const recordButton = document.querySelector(".record-btn");
const listenButton = document.querySelector(".listen-btn");
const submitButton = document.querySelector(".submit-btn");
let recTitle = document.querySelector(".title");

let tempMelody;
let notesRinging = [];

// Allows user to play any notes in any order with their connected device.
// Returns an array of the notes and durations
const recordMelody = () => {
  /* 
  - Stops listening when either of the other two buttons are pressed
  - Discard the inevitable rest at the end of the melody
*/

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

  // initialize note start times
  let prevNoteStartTime;
  let currNoteStartTime = 0;
  recTitle.innerHTML = "Recording...";

  // Parse MIDI data and pass to handler functions
  function getMIDIMessage(message) {
    // console.log("getMIDIMessage is being called");

    let command = message.data[0];
    let noteNum;
    let velocity;
    let note;
    let noteOn;

    if (command != 248 && command != 254) {
      // console.log("command not 248 or 254");

      noteNum = message.data[1];
      velocity = message.data.length > 2 ? message.data[2] : 0;
      // a velocity value might not be included with a noteOff command
      note = parseNoteNum(noteNum);
      noteOn = false;
    }

    switch (command) {
      case 144:
        prevNoteStartTime = currNoteStartTime;

        let tempNoteInfo;
        // New note is being played:
        if (velocity > 0) {
          // console.log(note);
          currNoteStartTime = Tone.now();
          if (tempMelody.length > 0) {
            // At least 1 note already played
            // if duration is NOT already set
            console.log("setting prev duration");
            if (typeof (tempMelody[tempMelody.length - 1][1] != Number)) {
              tempMelody[tempMelody.length - 1][1] =
                Tone.now() - prevNoteStartTime;
            }
          } else {
            // First note of the melody
            Tone.start();
          }
          // Create a new noteInfo with a placeholder duration
          tempNoteInfo = [note, "duration"];

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

          // Note is released
          if (velocity === 0) {
            sampler.releaseAll();
            notesRinging.pop();
            // no other notes are playing
            if (notesRinging.length === 0) {
              // console.log("No notes are ringing");
              currNoteStartTime = Tone.now();
              // update the CURRENT note duration
              console.log("setting current duration");
              tempMelody[tempMelody.length - 1][1] =
                Tone.now() - prevNoteStartTime; // now - prevTime = duration
              // add a rest with a duration placeholder
              tempMelody.push(["REST", "duration"]);
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
  return sampler;
};

const playRecordedMelody = () => {
  /* 
  Uses script.js functions to play the melody stored from recordMelody function
  */
  recTitle.innerHTML = "Melody saved. Playing recording...";
  console.log("tempmelody = " + tempMelody);
  if (tempMelody != undefined && tempMelody.length != 0) {
    console.log("calling playMelody");
    playMelody(tempMelody);
  } else {
    recTitle.innerHTML = "Melody not found. Please record a melody first!";
  }
};

const addMelodyToDB = () => {
  /* If the user has:
    1. pressed recordMelody 
    2. pressed at least 1 midi key
    ..the function will take the melody returned from recordMelody 
    and add it to the JSON database of melodies 
    
    How should we create IDs for each melody ?
    How should we play melodies on the main page? Currently, and if 
    we create IDs randomly (ie. sap919n8f76k8sdbn83), we will only 
    be able to select melodies randomly, and will have no way of 
    looking for or playing a specific melody.
    */
  recTitle.innerHTML = "Melody submitted...";
};
