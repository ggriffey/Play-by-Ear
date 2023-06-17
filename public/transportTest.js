console.log("transport test in progress");

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function transportTest() {
  Tone.Transport.start();
  console.log(Tone.Transport.now());
  sleep(500);
}

function playWithDuration() {
  Tone.Transport.scheduleOnce(
    // (callback, time(when to start playing)(opt.))
    {
      /*play sound here*/
    }
  );
}
// there's definitely a better way of doing this that allows me to pass in the entire melody
