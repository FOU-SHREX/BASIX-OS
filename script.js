const startButton = document.getElementById("startBtn");

startButton.addEventListener("click", function() {
    document.getElementById("welcomeScreen").hidden = true;
    document.getElementById("desktopScreen").hidden = false;
});

function updateClock() {
    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
}

updateClock();
setInterval(updateClock, 1000)

const notesWindow = document.getElementById("notesWindow");

document.getElementById("closeNotes").addEventListener("click", function() {
    notesWindow.hidden = true;
});

document.getElementById("openNotes").addEventListener("click", function() {
    notesWindow.hidden = false;
});

document.getElementById("copyNotes").addEventListener("click", function() {
    const text = document.querySelector("#notesWindow textarea").value;

    navigator.clipboard.writeText(text).then(function() {
        alert("Copied!");
    }).catch(function() {
        alert("Could not copy text. (try again)");
    });
});

const titleBars = document.querySelectorAll(".window-title");

let activeWindow = null;
let offsetX = 0;
let offsetY = 0;

titleBars.forEach(function(titleBar) {
    titleBar.addEventListener("mousedown", function(event) {
        if (event.target.tagName === "BUTTON") return;

        event.preventDefault();
        activeWindow = titleBar.parentElement;

        offsetX = event.clientX - activeWindow.offsetLeft;
        offsetY = event.clientY - activeWindow.offsetTop;
    });
});

document.addEventListener("mousemove", function(event) {
    if (!activeWindow) return;

    const maxX = Math.max(0, window.innerWidth - activeWindow.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - activeWindow.offsetHeight - 48);

    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;

    activeWindow.style.left = Math.min(Math.max(x, 0), maxX) + "px";
    activeWindow.style.top = Math.min(Math.max(y, 0), maxY) + "px";
});

document.addEventListener("mouseup", function() {
    activeWindow = null;
});

const aboutWindow = document.getElementById("aboutWindow");

document.getElementById("closeAbout").addEventListener("click", function() {
    aboutWindow.hidden = true;
});

document.getElementById("openAbout").addEventListener("click", function() {
    aboutWindow.hidden = false;
});

let toplayer = 1;

document.querySelectorAll(".app-window").forEach(function(app) {
    app.addEventListener("mousedown", function() {
        toplayer += 1;
        app.style.zIndex = toplayer;
    });
});