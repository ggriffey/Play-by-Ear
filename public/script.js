/* 
script.js features:
  - implement on-screen keyboard functionality
  - allow playback of all sound with Tone.js Sampler
  - play melodies and handle user responses
*/

const randomButton = document.getElementById("random");
const sampleButton = document.getElementById("sample");

let initialized = false;
let sampler;

let sampleMelody = [
  ["C4", 0.7],
  ["D4", 0.7],
  ["G4", 0.7],
];

// let json = fetch("./melodiesDB.json").then((response) =>
//   response.json().then((json) => console.log(json))
// );

// FIGURE OUT HOW TO WAIT FOR JSON TO PARSE BEFORE USING IT ^^

// like here...
// playMelody(json.melodies["1"]); // (currently returns undefined
// since it doesn't wait for above code to finish)

const keys = document.querySelectorAll(".key");
const whiteKeys = document.querySelectorAll(".key.white");
const blackKeys = document.querySelectorAll(".key.black");
let title = document.querySelector(".title");

if (title != undefined) {
  title.innerHTML = "Listen to the melody!";
}

// unnecessary sleep function I should remove after I figure out a better way of doing this
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const initializeToneJS = () => {
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

  return sampler;
};

// initialize page, play sample melody
const start = () => {
  if (!initialized) {
    initialized = true;
    initializeToneJS();
  } else {
    console.log("previously initialized");
  }
};

let ableToPlay;
function allowPianoUsage() {
  ableToPlay = true;
  keys.forEach((key) => key.classList.add("ableToPlay"));
}

function disallowPianoUsage() {
  ableToPlay = false;
  keys.forEach((key) => key.classList.remove("ableToPlay"));
}

// play the note associated with the given key on the page
function playNoteFromKey(key) {
  console.log(`playNoteFromKey(${key})`);
  sampler.releaseAll();
  sampler.triggerAttack(key.dataset.note);
  key.classList.add("active");
  sleep(500);
  key.classList.remove("active");
}

// play the note associated with the given note name (C4, Db6, D2)
function playNote(noteName) {
  sampler.triggerAttack(noteName);
}

// play a melody from an array of note names AND durations
//(ex. [[["C4", 0.7], ["D4", 0.7], ["G4", 0.7]])
function playMelody(melody) {
  // console.log("melody = " + Array.prototype.toString(melody));

  if (title != undefined) {
    title.textContent = "Listen to the melody!";
  }

  sampler.releaseAll();

  let time = 0.2;
  for (let noteInfo of melody) {
    if (noteInfo[0] === "REST") {
      // console.log("rest " + noteInfo[1] + " s");

      sleep(noteInfo[1] * 1000);
    } else {
      console.log(`${noteInfo[0]} for ${noteInfo[1].toFixed(2)}s`);

      sampler.triggerAttackRelease(
        /* (note, duration, time(to start attack) */
        noteInfo[0] /* note */,
        noteInfo[1] /* duration in seconds */,
        time
      );
      time += noteInfo[1];
    }
  }
  if (title != undefined) {
    title.textContent = `Play the melody back! Melody starts on ${melody[0][0]} and is in C major!`;
  }
  console.log("played entire melody");
}

// play a melody from an array of note names (NO durations) (ex. ['C4', 'F4', 'Bb4'])
function playMelodyWithoutDuration(melody) {
  sampler.releaseAll();
  let time = Tone.now();
  let duration = 0.6;

  sleep(100);

  for (let note of melody) {
    console.log(note);
    sampler.triggerAttackRelease(
      /* (note, duration, time(to start attack) */
      note,
      Number(duration),
      time
    );
    time += Number(duration);
  }
}

const playSampleMelody = () => {
  playMelody(sampleMelody);
  handleUserResponse(sampleMelody);
};

const autoMelodyGeneration = () => {
  let newMelody = generateMelody(4, 1, "C Major");
  console.log(newMelody);

  playMelody(newMelody);
  handleUserResponse(newMelody);
};

const handleUserResponse = (melody) => {
  console.log(`handleUserResponse(${melody})`);
  let buttons = [sample, random];
  allowPianoUsage();
  let mel = melody.map((note) => note);
  // console.log(`melody:`);
  // console.log(mel);

  keys.forEach((key) => {
    key.addEventListener("mousedown", () => {
      if (ableToPlay) {
        playNoteFromKey(key);
        // console.log(
        //   `key.dataset.note = ${key.dataset.note} and melody = ${mel}`
        // );

        if (key.dataset.note === mel[0][0]) {
          mel.shift();
          if (mel.length === 0) {
            ableToPlay = false;
            title.textContent = "You did it!";
            disallowPianoUsage();
            console.log(
              `local mel variable: ${mel}, and global melody variable (passed in) as ${melody}`
            );
          }
        } else {
          ableToPlay = false;
          title.textContent = "incorrect :/";
          disallowPianoUsage();
          console.log(
            `local mel variable: ${mel}, and global melody variable (passed in) as ${melody}`
          );
        }
      }
    });
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("button clicked. ending handler function now");
      disallowPianoUsage();
      return;
    });
  });
};

/*
Handle function for MIDI input instead of on-screen keyboard

const handleUserResponseMIDI = (melody) => {
  console.log(`handleUserResponseMIDI(${melody})`);

  let ableToPlay = true;
  let mel = melody.map((note) => note);
  console.log(`melody:`);
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
            title.textContent = "You did it!";
          }
        } else {
          ableToPlay = false;
          title.textContent = "incorrect :/";
        }
      }
    });
  });
};
*/
