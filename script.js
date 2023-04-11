const WHITE_KEY_MAPPINGS = ["z", "x", "c", "v", "b", "n", "m"];
const BLACK_KEY_MAPPINGS = ["s", "d", "g", "h", "j"];

const keys = document.querySelectorAll(".key");
const whiteKeys = document.querySelectorAll(".key.white");
const blackKeys = document.querySelectorAll(".key.black");

keys.forEach((key) => {
  key.addEventListener("mousedown", () => playNoteFromKey(key));
});

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const key = e.key;
  const whiteKeyIndex = WHITE_KEY_MAPPINGS.indexOf(key);
  const blackKeyIndex = BLACK_KEY_MAPPINGS.indexOf(key);

  if (whiteKeyIndex > -1) playNoteFromKey(whiteKeys[whiteKeyIndex]);
  if (blackKeyIndex > -1) playNoteFromKey(blackKeys[blackKeyIndex]);
});

function playNoteFromKey(key) {
  const noteAudio = document.getElementById(key.dataset.note);
  noteAudio.currentTime = 0;
  noteAudio.play();
  key.classList.add("active");
  noteAudio.addEventListener("ended", () => {
    key.classList.remove("active");
  });
}

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

const inst = document.querySelector(".instructions");

const main = () => {
  // ADDITIONAL SHIT
  inst.textContent = "Listen to the melody!";
  console.log("step 1", inst);
  sleep(600);

  // play melody
  const sampleMelody = ["C", "D", "G"];

  const playMelody = (melody) => {
    for (let note of melody) {
      console.log("playing note " + note);
      console.log("note is type " + typeof note);

      playNote(note);
      sleep(700);
    }
  };

  playMelody(sampleMelody);
  console.log("updating text");
  inst.textContent = "Play the melody back!";
};

// unnecessary sleep function I should remove after I figure out a better way of doing this
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
