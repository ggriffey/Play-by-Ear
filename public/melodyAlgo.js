/*
melodyAlgo.js features:
  - allow for internal access of differing scales (ex. major, natural minor)
  - generate a list of notes from a certain scale
  - generate melody from a given note and scale
  
  - TODO: 
    
    - Add octave numbering to melodies when generated.
    Tone.js needs the octave number to play the right 
    audio

    - disallow duplicate notes back to back
*/

const NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const MAJOR_SCALE_DISTANCES = [1, 3, 5, 6, 8, 10, 12];
const NATURAL_MINOR_SCALE_DISTANCES = [1, 3, 4, 6, 8, 9, 11];
const HARMONIC_MINOR_SCALE_DISTANCES = [1, 3, 4, 6, 8, 9, 12];

const getOctave = (letterName) => {
  let newNotes = NOTES.slice(0, NOTES.indexOf(letterName));
  newNotes =
    NOTES.slice(NOTES.indexOf(letterName), NOTES.length) + "," + newNotes;
  newNotes = newNotes.split(",");
  //   console.log("newNotes = ", newNotes);
  return newNotes;
};

const getMajorScale = (letterName) => {
  const scaleFormula = MAJOR_SCALE_DISTANCES;
  let scale = getScale(letterName, scaleFormula);
  console.log("major scale = ", scale);
};

const getNaturalMinorScale = (letterName) => {
  const scaleFormula = NATURAL_MINOR_SCALE_DISTANCES;
  let scale = getScale(letterName, scaleFormula);
  console.log("natural minor scale = ", scale);
};

const getScale = (letterName, scaleDistances) => {
  //   letterName = letterName.toString().toUpperCase();
  let notes = getOctave(letterName);
  let scale = [];
  for (let num of scaleDistances) {
    scale.push(notes[num - 1]);
  }
  scale.push(notes[0]);
  return scale;
};

const generateMelody = (len, complexity, key) => {
  // Key should be in form: 'letterName' + ' ' + 'scaleType'
  // ex.                     'Bb major'
  let letterName = key.split(" ")[0];
  letterName =
    letterName.length > 1
      ? letterName[0].toUpperCase() + letterName[1]
      : letterName[0].toUpperCase();
  let scaleQuality = key.split(" ");
  scaleQuality.shift();
  let scaleType = scaleQuality.join(" ").toLowerCase();

  console.log("let name = " + letterName);
  console.log("scaleType = " + scaleType);

  let melody = [];
  let scaleDistances;

  switch (scaleType.toLowerCase()) {
    case "natural minor":
      scaleDistances = NATURAL_MINOR_SCALE_DISTANCES;
    case "major":
      scaleDistances = MAJOR_SCALE_DISTANCES;
  }

  let scale = getScale(letterName, scaleDistances);
  // console.log(scale);

  for (let i = 0; i < len; i++) {
    //For right now, three random notes will be generated within key
    let note = scale[Math.floor(Math.random() * (7 - i))];

    // in the future, this "4" should be adaptive to the octave number
    melody.push([note + "4", 500]);

    // Need to remove the note from the melody so it doesn't get used again
    // or find a way to make it less likely

    // scale =
    //   scale.slice(0, scale.indexOf(note)) +
    //   scale.slice(scale.indexOf(note), scale.length);
    // console.log(scale);
  }
  return melody;
};

// console.log("melody generated! ... ", generateMelody(4, 1, "B majoR"));
