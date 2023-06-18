function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function transportTest() {
  console.log("transport test in progress");
  Tone.start();
  console.log(Tone.now());
  console.log("sleeping for 3 seconds");

  sleep(3000);
  console.log("slept for 3 seconds");

  console.log(Tone.now());
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
