/* 
script.js features:
  - implement on-screen keyboard functionality
  - allow playback of all sound
    (including melody playback)
*/

const keys = document.querySelectorAll(".key");
const whiteKeys = document.querySelectorAll(".key.white");
const blackKeys = document.querySelectorAll(".key.black");
let inst = document.querySelector(".instructions");
const sampleMelody = ["C", "D", "G"];

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
  const key = document.getElementById(noteName);
  const noteAudio = document.getElementById(noteName);
  noteAudio.currentTime = 0;
  noteAudio.play();
  key.classList.add("active");
  noteAudio.addEventListener("ended", () => {
    key.classList.remove("active");
  });
}

// play a melody from an array of note names (ex. ['C', 'F', 'Bb'])
const playMelody = (melody) => {
  for (let note of melody) {
    playNote(note);
    console.log(`playing note ${note}`);

    sleep(700);
  }
};

// initialize page, play sample melody
const start = () => {
  inst.textContent = "Listen to the melody!";
  console.log(inst.textContent);

  playMelody(sampleMelody);

  inst.textContent = `Play the melody back! Melody starts on ${sampleMelody[0]}`;

  handleUserResponse();
};

const handleUserResponse = (melody) => {
  let ableToPlay = true;
  let mel = melody.map((note) => note);
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
