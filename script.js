function showDesktop() {
    document.getElementById("welcomeScreen").hidden = true;
    document.getElementById("desktopScreen").hidden = false;
}

setTimeout(showDesktop, 3000)

function updateClock() {
    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
}

updateClock();
setInterval(updateClock, 1000)

const notesWindow = document.getElementById("notesWindow");
const notesText = document.querySelector("#notesWindow textarea");

notesText.value = localStorage.getItem("basixNotes") || "";

notesText.addEventListener("input", function() {
    localStorage.setItem("basixNotes", notesText.value);
});

document.getElementById("closeNotes").addEventListener("click", function() {
    notesWindow.hidden = true;
});

document.getElementById("openNotes").addEventListener("click", function() {
    notesWindow.hidden = false;
});

document.getElementById("copyNotes").addEventListener("click", function() {
    const text = notesText.value;

    navigator.clipboard.writeText(text).then(function() {
        alert("Copied!");
    }).catch(function() {
        alert("Could not copy text. (try again)");
    });
});

document.getElementById("clearNotes").addEventListener("click", function() {
    if (!confirm("Clear all notes?")) return;

    notesText.value = "";
    localStorage.removeItem("basixNotes");
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

const clockWindow = document.getElementById("clockWindow");

document.getElementById("openClock").addEventListener("click", function() {
    clockWindow.hidden = false
});

document.getElementById("closeClock").addEventListener("click", function() {
    clockWindow.hidden = true
})

const terminalWindow = document.getElementById("terminalWindow");

document.getElementById("openTerminal").addEventListener("click", function() {
    terminalWindow.hidden = false;
    document.getElementById("terminalInput").focus();
});

document.getElementById("closeTerminal").addEventListener("click", function() {
    terminalWindow.hidden = true;
});

const calculatorWindow = document.getElementById("calculatorWindow");

document.getElementById("openCalculator").addEventListener("click", function() {
    calculatorWindow.hidden = false;
});

document.getElementById("closeCalculator").addEventListener("click", function() {
    calculatorWindow.hidden = true;
});

const calcDisplay = document.getElementById("calcDisplay");

let firstNumber = null;
let operator = null;
let newNumber = true;

function calculate(a, b, op) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return a / b;
}

document.querySelectorAll(".calculator-buttons button").forEach(function(button) {
    button.addEventListener("click", function() {
        const value = button.dataset.value;

        if (value === "C") {
            calcDisplay.value = "0";
            firstNumber = null;
            operator = null;
            newNumber = true;
            return;
        }

        if (Number.isInteger(Number(value))) {
            if (newNumber || calcDisplay.value === "0") {
                calcDisplay.value = value;
            } else {
                calcDisplay.value += value;
            }

            newNumber = false;
            return;
        }

        if (value === ".") {
            if (newNumber) {
                calcDisplay.value = "0.";
                newNumber = false;
            } else if (!calcDisplay.value.includes(".")) {
                calcDisplay.value += ".";
            }
            return;
        }

        if (["+", "-", "*", "/"].includes(value)) {
            if (calcDisplay.value === "Error") return;

            if (operator !== null && !newNumber) {
                const result = calculate(firstNumber, Number(calcDisplay.value), operator);

                if (!Number.isFinite(result)) {
                    calcDisplay.value = "Error";
                    firstNumber = null;
                    operator = null;
                    newNumber = true;
                    return;
                }

                calcDisplay.value = String(Number(result.toPrecision(12)));
            }

            firstNumber = Number(calcDisplay.value);
            operator = value;
            newNumber = true;
            return;
        }

        if (value === "=" && operator !== null && !newNumber) {
            const secondNumber = Number(calcDisplay.value);
            const result = calculate(firstNumber, secondNumber, operator);

            if (!Number.isFinite(result)) {
                calcDisplay.value = "Error";
            } else {
                calcDisplay.value = String(Number(result.toPrecision(12)));
            }

            firstNumber = null;
            operator = null;
            newNumber = true;
        }
    });
});

const galleryWindow = document.getElementById("galleryWindow");
const galleryImage = document.getElementById("galleryImage");
const galleryCaption = document.getElementById("galleryCaption");

const galleryPhotos = [
    ["assets/capy-wallpaper.png", "Capy chilling in the pond"],
    ["assets/welcome-capy.png", "Capy fixing BASIX OS"],
    ["assets/capy-orange-bath.png", "Orange capy taking a warm bath"],
    ["assets/capy-gallery-2.png", "Builder capy ready to fix BASIX OS"],
    ["assets/capy-gallery-3.png", "Cute capy moment"],
    ["assets/capy-gallery-4.png", "Just Capy vacation"],
    ["assets/capy-gallery-5.png", "Another funny capy pose"],
    ["assets/capy-gallery-6.png", "Suspicious capy look"]
];

let galleryIndex = 0;
showGalleryImage()

function showGalleryImage() {
    galleryImage.src = galleryPhotos[galleryIndex][0];
    galleryCaption.textContent = galleryPhotos[galleryIndex][1];
}

document.getElementById("openGallery").addEventListener("click", function() {
    galleryWindow.hidden = false;
});

document.getElementById("closeGallery").addEventListener("click", function() {
    galleryWindow.hidden = true;
});

document.getElementById("nextImage").addEventListener("click", function() {
    galleryIndex = (galleryIndex + 1) % galleryPhotos.length;
    showGalleryImage();
});

document.getElementById("prevImage").addEventListener("click", function() {
    galleryIndex = (galleryIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
    showGalleryImage();
});

const settingsWindow = document.getElementById("settingsWindow");
const desktopWallpaper = document.querySelector(".desktop-wallpaper")

desktopWallpaper.src = localStorage.getItem("basixWallpaper") || "assets/capy-wallpaper.png"

document.getElementById("openSettings").addEventListener("click", function() {
    settingsWindow.hidden = false;
});

document.getElementById("closeSettings").addEventListener("click", function() {
    settingsWindow.hidden = true;
});

document.getElementById("pondWallpaper").addEventListener("click", function() {
    desktopWallpaper.src = "assets/capy-wallpaper.png";
    localStorage.setItem("basixWallpaper", "assets/capy-wallpaper.png");
});

document.getElementById("builderWallpaper").addEventListener("click", function() {
    desktopWallpaper.src = "assets/welcome-capy.png";
    localStorage.setItem("basixWallpaper", "assets/welcome-capy.png")
});

function changeTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }

    localStorage.setItem("basixTheme", theme);
}

document.getElementById("lightTheme").addEventListener("click", function() {
    changeTheme("light");
});

document.getElementById("darkTheme").addEventListener("click", function() {
    changeTheme("dark");
});

if (localStorage.getItem("basixTheme") === "dark") {
    changeTheme("dark");
}

const clickerWindow = document.getElementById("clickerWindow");
const clickerScore = document.getElementById("clickerScore");
const clickerBest = document.getElementById("clickerBest");
const clickerMessage = document.getElementById("clickerMessage");

let oranges = 0;
let bestOranges = Number(localStorage.getItem("capyBestOranges")) || 0;

clickerBest.textContent = "Best: " + bestOranges;

const capyMessages = [
    "CAPY CAPY CAAAAPPPPYYY!!",
    "CAPY says you owe him more oranges.",
    "You are doing all the work. As usual.",
    "CAPY is becoming dangerously powerful.",
    "Stop clicking... actually don't stop!"
];

document.getElementById("openClicker").addEventListener("click", function() {
    clickerWindow.hidden = false;
});

document.getElementById("closeClicker").addEventListener("click", function() {
    clickerWindow.hidden = true;
    oranges = 0;
    clickerScore.textContent = "Oranges: 0";
    clickerMessage.textContent = "CAPY is waiting for the oranges...";
});

document.getElementById("clickCapy").addEventListener("click", function() {
    oranges += 1;
    clickerScore.textContent = "Oranges: " + oranges;

    if (oranges > bestOranges) {
        bestOranges = oranges;
        localStorage.setItem("capyBestOranges", bestOranges);
        clickerBest.textContent = "Best: " + bestOranges;
    }

    clickerMessage.textContent = capyMessages[(oranges - 1) % capyMessages.length];
})

const desktopCapy = document.querySelector(".desktop-wallpaper");
const capyReaction = document.getElementById("capyReaction");

const desktopMessages = [
    "CAPY CAPY CAAAPYYY!!",
    "Bro, I was literally asleep.",
    "Yes, I made this OS. From my bed.",
    "Stop poking me! I am working.",
    "Give me an orange and go away.",
    "CAPY has filed a complaint against your mouse.",
    "You clicked me. Congratulations. Now what?",
    "CAPY is buffering... mentally."
];

let lastMessage = -1;

function talkToCapy() {
    let index = Math.floor(Math.random() * desktopMessages.length);

    if (index === lastMessage) {
        index = (index + 1) % desktopMessages.length
    }

    lastMessage = index;
    capyReaction.textContent = desktopMessages[index];
}

desktopCapy.addEventListener("click", talkToCapy);

desktopCapy.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        talkToCapy();
    }
});

const paintWindow = document.getElementById("paintWindow");
const paintCanvas = document.getElementById("paintCanvas");
const paintContext = paintCanvas.getContext("2d");
const paintStatus = document.getElementById("paintStatus");

let paintColor = "#8b4513";
let painting = false;

paintContext.fillStyle = "white";
paintContext.fillRect(0, 0, paintCanvas.width, paintCanvas.height);

document.getElementById("openPaint").addEventListener("click", function() {
    paintWindow.hidden = false;
});

document.getElementById("closePaint").addEventListener("click", function() {
    paintWindow.hidden = true;
});

document.querySelectorAll(".paint-tools [data-color]").forEach(function(button) {
    button.addEventListener("click", function() {
        paintColor = button.dataset.color;
        paintStatus.textContent = "Brush: " + button.title;
    });
});

document.getElementById("paintEraser").addEventListener("click", function() {
    paintColor = "white";
    paintStatus.textContent = "Eraser selected";
});

function paintPosition(event) {
    const rect = paintCanvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * paintCanvas.width / rect.width,
        y: (event.clientY - rect.top) * paintCanvas.height / rect.height
    };
}

paintCanvas.addEventListener("pointerdown", function(event) {
    painting = true;
    paintCanvas.setPointerCapture(event.pointerId);

    const pos = paintPosition(event);

    paintContext.strokeStyle = paintColor;
    paintContext.lineWidth = paintColor === "white" ? 20 : 5;
    paintContext.lineCap = "round";
    paintContext.lineJoin = "round";
    paintContext.beginPath();
    paintContext.moveTo(pos.x, pos.y);
    paintContext.lineTo(pos.x, pos.y);
    paintContext.stroke();
});

paintCanvas.addEventListener("pointermove", function(event) {
    if (!painting) return;

    const pos = paintPosition(event);
    paintContext.lineTo(pos.x, pos.y);
    paintContext.stroke();
});

["pointerup", "pointercancel", "lostpointercapture"].forEach(function(type) {
    paintCanvas.addEventListener(type, function() {
        painting = false;
    });
});


document.getElementById("paintClear").addEventListener("click", function() {
    if (!confirm("Clear your drawing?")) return;

    paintContext.fillStyle = "white";
    paintContext.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
});

document.getElementById("paintSave").addEventListener("click", function() {
    const link = document.createElement("a");
    link.download = "capy-paint.png";
    link.href = paintCanvas.toDataURL("image/png");
    link.click();
});

const achievementWindow = document.getElementById("achievementWindow");

document.getElementById("openAchievements").addEventListener("click", function() {
    achievementWindow.hidden = false;
});

document.getElementById("closeAchievements").addEventListener("click", function() {
    achievementWindow.hidden = true;
});

const achievementNames = [
    "CAPY Has Awoken",
    "Professional Annoyance",
    "Orange Employee",
    "CAPYcasso",
    "Pond Explorer"
];

let unlockedAchievements = JSON.parse(localStorage.getItem("basixAchievements") || "[]");
let openedApps = JSON.parse(localStorage.getItem("basixOpenedApps") || "[]");
let capyTalkCount = Number(localStorage.getItem("basixCapyTalkCount")) || 0;

const achievementList = document.getElementById("achievementList");
const achievementCount = document.getElementById("achievementCount");
const achievementToast = document.createElement("div");

achievementToast.id = "achievementToast";
achievementToast.hidden = true;
document.body.appendChild(achievementToast);

let toastTimer;

function showAchievements() {
    achievementList.innerHTML = "";

    achievementNames.forEach(function(name, index) {
        const item = document.createElement("p");

        item.textContent = unlockedAchievements.includes(name)
            ? "🏆 " + name
            : "🔒 Secret " + (index + 1) + " - ???";

        achievementList.appendChild(item);
    });

    achievementCount.textContent = "Unlocked: " + unlockedAchievements.length + "/5";
}

function unlockAchievement(name) {
    if (unlockedAchievements.includes(name)) return;

    unlockedAchievements.push(name);
    localStorage.setItem("basixAchievements", JSON.stringify(unlockedAchievements));

    showAchievements();

    achievementToast.textContent = "🏆 Unlocked: " + name;
    achievementToast.hidden = false;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        achievementToast.hidden = true;
    }, 3000);
}

showAchievements();

function countCapyTalk() {
    capyTalkCount += 1;
    localStorage.setItem("basixCapyTalkCount", capyTalkCount);

    unlockAchievement("CAPY Has Awoken");

    if (capyTalkCount >= 10) {
        unlockAchievement("Professional Annoyance");
    }
}

desktopCapy.addEventListener("click", countCapyTalk);

desktopCapy.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
        countCapyTalk();
    }
});

document.getElementById("clickCapy").addEventListener("click", function() {
    if (oranges >= 25) {
        unlockAchievement("Orange Employee");
    }
});

paintCanvas.addEventListener("pointerdown", function() {
    unlockAchievement("CAPYcasso");
});

const appButtons = [
    "openNotes", "openAbout", "openClock",
    "openTerminal", "openCalculator", "openGallery",
    "openSettings", "openClicker", "openPaint"
];

appButtons.forEach(function(id) {
    document.getElementById(id).addEventListener("click", function() {
        if (!openedApps.includes(id)) {
            openedApps.push(id);
            localStorage.setItem("basixOpenedApps", JSON.stringify(openedApps));
        }

        if (openedApps.length === appButtons.length) {
            unlockAchievement("Pond Explorer")
        }
    });
});