/* 
recordMelody.js features:
  - record button starts listening for midi data
  - once the first note is played, the function converts the notes and durations
  into a melody object
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

const recordMelody = () => {};
const playRecordedMelody = () => {};
const addMelodyToDB = () => {};
