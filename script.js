const pomodoroTimer = document.querySelector('#pomodoro-timer');
const startButton = document.getElementById('pomodoro-start');
const pauseButton = document.getElementById('pomodoro-pause');
const stopButton = document.getElementById('pomodoro-stop');

// START
startButton.addEventListener('click', () => {
  toggleClock();
})

// PAUSE
pauseButton.addEventListener('click', () => {
  toggleClock();
})

// STOP
stopButton.addEventListener('click', () => {
  toggleClock(true);
})