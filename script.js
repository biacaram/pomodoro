const pomodoroTimer = document.querySelector('#pomodoro-timer');
const startButton = document.getElementById('pomodoro-start');
const pauseButton = document.getElementById('pomodoro-pause');
const stopButton = document.getElementById('pomodoro-stop');
let isClockRunning = false;
let workSessionDuration = 1500; // in seconds = 25 mins
let currentTimeLeftInSession = 1500;
let breakSessionDuration = 300; // in seconds = 5 mins;
let type = 'Work';
let timeSpentInCurrentSession = 0;
let currentTaskLabel = document.querySelector('#pomodoro-clock-task')
let updatedWorkSessionDuration;
let updatedBreakSessionDuration;
let isClockStopped = true;
let workDurationInput = document.querySelector('#input-work-duration');
let breakDurationInput = document.querySelector('#input-break-duration');

const progressBar = new ProgressBar.Circle('#pomodoro-timer', {
  strokeWidth: 2,
  text: {
    value: '25:00',
  },
  trailColor: '#f4f4f4',
})

workDurationInput.value = '25'
breakDurationInput.value = '5'

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

// UPDATE WORK TIME
workDurationInput.addEventListener('input', () => {
  updatedWorkSessionDuration = minuteToSeconds(workDurationInput.value)
})

// UPDATE PAUSE TIME
breakDurationInput.addEventListener('input', () => {
  updatedBreakSessionDuration = minuteToSeconds(breakDurationInput.value)
})

const toggleClock = (reset) => {
  if (reset) {
    // STOP THE TIMER
    stopClock()
  } else {
    if (isClockStopped) {
      setUpdatedTimers()
      isClockStopped = false
    }
    if (isClockRunning === true) {
      // PAUSE THE TIMER
      clearInterval(clockTimer);
      isClockRunning = false;
    } else {
      // START THE TIMER
      clockTimer = setInterval(() => {
        // decrease time left / increase time spent
        stepDown();
        displayCurrentTimeLeftInSession();
      }, 1000)
      isClockRunning = true;
    }
  }
}

const displayCurrentTimeLeftInSession = () => {
  const secondsLeft = currentTimeLeftInSession;
  let result = '';
  const seconds = secondsLeft % 60;
  const minutes = parseInt(secondsLeft / 60) % 60;
  let hours = parseInt(secondsLeft / 3600);
  // add leading zeroes if it's less than 10
  function addLeadingZeroes(time) {
    return time < 10 ? `0${time}` : time
  }
  if (hours > 0) result += `${hours}:`
  result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`
  pomodoroTimer.innerText = result.toString();
}

const stopClock = () => {
  setUpdatedTimers()
  displaySessionLog(type)
  // 1) reset the timer we set
  clearInterval(clockTimer)
  // 2) update our variable to know that the timer is stopped
  isClockStopped = true
  isClockRunning = false
  // reset the time left in the session to its original state
  currentTimeLeftInSession = workSessionDuration
  // update the timer displayed
  displayCurrentTimeLeftInSession()
  type = 'Work'
  timeSpentInCurrentSession = 0
}

const stepDown = () => {
  if (currentTimeLeftInSession > 0) {
    // decrease time left / increase time spent
    currentTimeLeftInSession--
    timeSpentInCurrentSession++
  } else if (currentTimeLeftInSession === 0) {
    // Timer is over -> if work switch to break, viceversa
    timeSpentInCurrentSession = 0
    if (type === 'Work') {
      currentTimeLeftInSession = breakSessionDuration
      displaySessionLog('Work')
      type = 'Break'
      currentTaskLabel.value = 'Break';
      currentTaskLabel.disabled = true;
    } else {
      currentTimeLeftInSession = workSessionDuration
      type = 'Work'
      if (currentTaskLabel.value === 'Break') {
      currentTaskLabel.value = workSessionLabel;
      }
      currentTaskLabel.disabled = false;
      displaySessionLog('Break')
    }
  }
  displayCurrentTimeLeftInSession()
}

const displaySessionLog = type => {
  const sessionsList = document.querySelector('#pomodoro-sessions')
  // append li to it
  const li = document.createElement('li')
  if (type === 'Work') {
  sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'Work'
  workSessionLabel = sessionLabel
  } else {
  sessionLabel = 'Break'
  }
  let elapsedTime = parseInt(timeSpentInCurrentSession / 60)
  elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1'

  const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`)
  li.appendChild(text)
  sessionsList.appendChild(li)
}

const minuteToSeconds = mins => {
  return mins * 60
}

const setUpdatedTimers = () => {
  if (type === 'Work') {
    currentTimeLeftInSession = updatedWorkSessionDuration
      ? updatedWorkSessionDuration
      : workSessionDuration
    workSessionDuration = currentTimeLeftInSession
  } else {
    currentTimeLeftInSession = updatedBreakSessionDuration
      ? updatedBreakSessionDuration
      : breakSessionDuration
    breakSessionDuration = currentTimeLeftInSession
  }
}

