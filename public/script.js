console.log("script is working!");

/* 
script.js features:
  - implement on-screen keyboard functionality
  - allow playback of all sound
    (including melody playback)
    (implement Tone.js)
*/

let initialized = false;
let sampler;

let sampleMelody = [
  ["C4", 700],
  ["D4", 700],
  ["G4", 700],
];

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
  sampler.triggerAttackRelease(key.dataset.note, 0.4);
  key.classList.add("active");
  sleep(400);
  key.classList.remove("active");
}

// play the note associated with the given note name (C, Db, D)
function playNote(noteName) {
  console.log(`playNote(${noteName})`);

  const key = document.getElementById(noteName);
  //   key.classList.add("active");
  //   noteAudio.addEventListener("ended", () => {
  //     key.classList.remove("active");
  //   });
}

// play a melody from an array of note names (ex. ['C', 'F', 'Bb'])
function playMelody(melody) {
  console.log(`playMelody(${melody})`);

  let time = 0;
  for (let noteInfo of melody) {
    sampler.triggerAttackRelease(
      /* (note, duration, time(to start attack) */
      noteInfo[0] /* note */,
      noteInfo[1] / 1000 /* duration */,
      time
    );

    time += noteInfo[1] / 1000;
  }
}

const initialize = () => {
  async () => {
    await Tone.start();
    console.log("audio is ready");
  };

  sampler = new Tone.Sampler({
    urls: {
      C4: "C.mp3",
      Db4: "Db.mp3",
      D4: "D.mp3",
      Eb4: "Eb.mp3",
      E4: "E.mp3",
      F4: "F.mp3",
      Gb4: "Gb.mp3",
      G4: "G.mp3",
      Ab4: "Ab.mp3",
      A4: "A.mp3",
      Bb4: "Bb.mp3",
      B4: "B.mp3",
      C5: "C2.mp3",
    },
    release: 1,
    baseUrl: "/Audio/",
  }).toDestination();

  Tone.loaded().then(() => {
    console.log("Tone loaded!");
  });
};

// initialize page, play sample melody
const start = () => {
  if (!initialized) {
    initialized = true;
    initialize();
  } else {
    console.log("previously initialized");
  }
};

const playSampleMelody = () => {
  inst.textContent = "Listen to the melody!";
  console.log(inst.textContent);

  playMelody(sampleMelody);

  inst.textContent = `Play the melody back! Melody starts on ${sampleMelody[0][0]}`;

  handleUserResponse(sampleMelody);
};

const handleUserResponse = (melody) => {
  console.log(`handleUserResponse(${melody})`);

  let ableToPlay = true;
  let mel = melody.map((note) => note);
  console.log(`ml = ${mel}`);
  console.log(mel);

  keys.forEach((key) => {
    key.addEventListener("mousedown", () => {
      if (ableToPlay) {
        playNoteFromKey(key);
        console.log(
          `key.dataset.note = ${key.dataset.note} and melody = ${mel}`
        );

        if (key.dataset.note === mel[0][0]) {
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
