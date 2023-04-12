const keys = document.querySelectorAll(".key");
const whiteKeys = document.querySelectorAll(".key.white");
const blackKeys = document.querySelectorAll(".key.black");
const inst = document.querySelector("h1");
const sampleMelody = ["C", "D", "G"];

inst.textContent = "Listen to the melody!";

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
    sleep(700);
  }
};

// initialize page, play sample melody
const start = () => {
  playMelody(sampleMelody);
  inst.textContent = "Play the melody back!";
  handleUserResponse();
};

const handleUserResponse = () => {
  keys.forEach((key) => {
    key.addEventListener("mousedown", () => {
      playNoteFromKey(key);
      if (key.dataset.note === sampleMelody[0]) {
        console.log("correct!");
        sampleMelody.shift();
        if (sampleMelody.length === 0) {
          console.log("You did it!");
        }
      } else console.log("incorrect");
    });
  });
};

// keyboard mappings ______________________________________________
// const WHITE_KEY_MAPPINGS = ["z", "x", "c", "v", "b", "n", "m"];
// const BLACK_KEY_MAPPINGS = ["s", "d", "g", "h", "j"];

// allows user to play with keyboard mappings ________________________________
// document.addEventListener("keydown", (e) => {
//   if (e.repeat) return;
//   const key = e.key;
//   const whiteKeyIndex = WHITE_KEY_MAPPINGS.indexOf(key);
//   const blackKeyIndex = BLACK_KEY_MAPPINGS.indexOf(key);

//   if (whiteKeyIndex > -1) playNoteFromKey(whiteKeys[whiteKeyIndex]);
//   if (blackKeyIndex > -1) playNoteFromKey(blackKeys[blackKeyIndex]);
// });
