console.log("script is working!");

/* 
script.js features:
  - implement on-screen keyboard functionality
  - allow playback of all sound
    (including melody playback)
    (implement Tone.js)
*/

// TONE JS CONNECTION/SETUP
// import * as Tone from "tone";

// document.getElementById("start-btn")?.addEventListener("click", async () => {
//   await Tone.start();
//   console.log("audio is ready");
// });

//create a synth and connect it to the main output (your speakers)
// const synth = new Tone.Synth().toDestination();

//play a middle 'C' for the duration of an 8th note
// synth.triggerAttackRelease("C4", "8n");

// const piano = new Tone.Sampler({
//   urls: {
//     C: "./Audio/C.mp3",
//     Db: "./Audio/Db.mp3",
//     D: "./Audio/D.mp3",
//     Eb: "./Audio/Eb.mp3",
//     E: "./Audio/E.mp3",
//     F: "./Audio/F.mp3",
//     Gb: "./Audio/Gb.mp3",
//     G: "./Audio/G.mp3",
//     Ab: "./Audio/Ab.mp3",
//     A: "./Audio/A.mp3",
//     Bb: "./Audio/Bb.mp3",
//     B: "./Audio/B.mp3",
//     C2: "./Audio/C2.mp3",
//   },
//   release: 1,
//   baseUrl: "https://tonejs.github.io/audio/salamander/",
// }).toDestination();

// Tone.loaded().then(() => {
//   piano.triggerAttackRelease(["Eb", "G", "Bb"], 4);
// });

let sampleMelody = ["C", "D", "G"];

let json = fetch("./melodiesDB.json").then((response) =>
  response.json().then((json) => console.log(json))
);

// FIGURE OUT HOW TO WAIT FOR JSON TO PARSE BEFORE USING IT ^^

// like here...
// playMelody(json.melodies["1"]); // (currently returns undefined
// since it doesn't wait for above code to finish)

const keys = document.querySelectorAll(".key");
const whiteKeys = document.querySelectorAll(".key.white");
const blackKeys = document.querySelectorAll(".key.black");
let inst = document.querySelector(".instructions");

inst.innerHTML = "Listen to the melody!";

// unnecessary sleep function I should remove after I figure out a better way of doing this
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// play the note associated with the given key on the page
function playNoteFromKey(key) {
  console.log(`playNoteFromKey(${key})`);

  const noteAudio = document.getElementById(key.dataset.note);
  noteAudio.currentTime = 0;
  noteAudio.play();
  key.classList.add("active");
  noteAudio.addEventListener("ended", () => {
    key.classList.remove("active");
  });
}

// play the note associated with the given note name (C, Db, D)
function playNote(noteName) {
  console.log(`playNote(${noteName})`);

  const key = document.getElementById(noteName);
  const noteAudio = document.getElementById(noteName);
  noteAudio.currentTime = 0;
  noteAudio.play();
  //   key.classList.add("active");
  //   noteAudio.addEventListener("ended", () => {
  //     key.classList.remove("active");
  //   });
}

// play a melody from an array of note names (ex. ['C', 'F', 'Bb'])
function playMelody(melody) {
  console.log(`playMelody(${melody})`);

  for (let note of melody) {
    playNote(note);
    // console.log(`playing note ${note}`);

    sleep(700);
  }
}

// initialize page, play sample melody
const start = () => {
  console.log(`start()`);

  inst.textContent = "Listen to the melody!";
  console.log(inst.textContent);

  playMelody(sampleMelody);

  inst.textContent = `Play the melody back! Melody starts on ${sampleMelody[0]}`;

  handleUserResponse(sampleMelody);
};

const handleUserResponse = (melody) => {
  console.log(`handleUseResponfsdf(${melody})`);

  let ableToPlay = true;
  let mel = melody.map((note) => note);
  console.log(`ml = ${mel}`);

  keys.forEach((key) => {
    key.addEventListener("mousedown", () => {
      if (ableToPlay) {
        playNoteFromKey(key);
        if (key.dataset.note === mel[0]) {
          mel.shift();
          if (mel.length === 0) {
            ableToPlay = false;
            inst.textContent = "You did it!";
          }
        } else {
          ableToPlay = false;
          inst.textContent = "incorrect :/";
        }
      }
    });
  });
};

const autoMelodyGeneration = () => {
  let newMelody = generateMelody(4, 1, "C Major");
  inst.textContent = "Listen to the melody!";

  playMelody(newMelody);
  inst.textContent = `Play the melody back! Melody starts on ${newMelody[0]} and is in C major!`;

  handleUserResponse(newMelody);
};
