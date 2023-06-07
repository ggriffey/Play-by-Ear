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

const recordMelody = () => {
  /* 

  this will be the hardest function of the three on this page..

  1. Initialize a blank melody array on the click of Record button
  2. Use onmidimessage to add the first note, and simulatenously start a 
  stopwatch (through Tone.js?) that will take care of duration
  3. When the note is released:
    - if another note is held down, simply move to that note
    - if no notes are playing, add a placeholder note (rest) and the time elapsed before
    either a) the next note is pressed or b) the Listen button is pressed
  4. Stops listening when either of the other two buttons are pressed
    - Discard the inevitable rest at the end of the melody
  
  Maybe this function should return the array
  
  */
  /*
  1st attempt semi-pseudo:

  let tempMelody = []
  
  onmidimessage([start of note]) => { HERE: need to check if there are other notes playing
    let noteDuration;               if so, need a way to add the right notes in right order
    let noteStartTime = Tone.now() 
    
    onmidimessage([end of note]) => {
      noteDuration = Tone.now() - noteStartTime;
    }
    tempMelody.push([{note}, noteDuration ]);
  }
  */
};

const playRecordedMelody = () => {
  /* 
  For now, all melodies and melody playbacks will be treated monophonically. No harmonic
  or chordal movements will be allowed, as it makes playback and dealing with note ORDER
  too nuanced... 
  Simply uses script.js functions to play back the melody stored 
  in the array from recordMelody 
  
  will use Tone.js time methods like Tone.now() and start()
  */
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
};
