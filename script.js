const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const resultsArea = document.querySelector(".results");
const WPM = document.querySelector(".wpm");
const ACCURACY = document.querySelector(".accuracy");

var timer = [0,0,0,0];
var interval;
var timerRunning = false;
var charsTyped = -1;
var errors = 0;

// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
    if(time <= 9) {
        time = "0" + time;
    }
    return time;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
    let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
    theTimer.innerHTML = currentTime;
    timer[3]++;
    
    timer[0] = Math.floor((timer[3]/100)/60);
    timer[1] = Math.floor((timer[3]/100) - (timer[0] * 60));
    timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));
}

// Count words per minute
function wordsCount() {
    let totalWordsNumber = originText.split(' ').length;
    let wpm = Math.floor(totalWordsNumber/((timer[3]/100)/60));
    WPM.innerHTML = wpm;
    resultsArea.style.display = "block";
}

// Calculate the accuracy
function accuracyCalculate() {
    let accuracy = Math.floor(100*(charsTyped-errors)/charsTyped);
    ACCURACY.innerHTML = accuracy + '%';

    if (accuracy >= 85) {
        ACCURACY.style.color = "green";
    } else if (accuracy >= 65) {
        ACCURACY.style.color = "blue";
    } else {
        ACCURACY.style.color = "#E95D0F";
    }
}

// Match the text entered with the provided text on the page:
function spellCheck(e) {
    let textEntered = testArea.value;
    let textEnteredLength = textEntered.length;
    let originTextMatch = originText.substring(0, textEnteredLength);

    if (textEntered == originText) {
        clearInterval(interval);
        wordsCount();
        accuracyCalculate();
        testWrapper.style.borderColor = "#429890";
    } else if (textEntered == originTextMatch) {
        testWrapper.style.borderColor = "#65CCf3";
    } else {
        if(e.key != "Backspace") {
            errors++;
            console.log(errors);
        }
        testWrapper.style.borderColor = "#E95D0F";
    }
}

// Start the timer:
function start() {
    let textEnteredLength = testArea.value.length;
    if(textEnteredLength === 0 && !timerRunning) {
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    } 
}

// Reset everything:
function reset() {
    clearInterval(interval);
    interval = null;
    timer = [0,0,0,0];
    timerRunning = false;
    charsTyped = -1;
    errors = 0;

    testArea.value = "";
    theTimer.innerHTML = "00:00:00";
    testWrapper.style.borderColor = "grey";
    resultsArea.style.display = "none";
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keydown", () => charsTyped++, false);
testArea.addEventListener("beforeinput", start, false);
testArea.addEventListener("keyup", spellCheck, false);
resetButton.addEventListener("click", reset, false);