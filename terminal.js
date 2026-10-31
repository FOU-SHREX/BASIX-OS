const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");

let currentPath = "/home/capy";
const folders = {
    "/home/capy": []
};
const files = {};
let commandHistory = [];
let historyIndex = 0;
let historyDraft = "";

try {
    const saved = JSON.parse(localStorage.getItem("basixTerminalFS"));

    if (saved && saved.folders && saved.files &&
        Array.isArray(saved.folders["/home/capy"])) {
            Object.assign(folders, saved.folders);
            Object.assign(files, saved.files);
        }
} catch (error) {
    console.warn("CAPY could not load saved Terminal files.");
}

function saveTerminalFiles() {
    try {
        localStorage.setItem("basixTerminalFS", JSON.stringify({ folders, files }));
    } catch (error) {
        printLine("Warning: Terminal files could not be saved.");
    }
}

function printLine(text) {
    const line = document.createElement("div");
    line.textContent = text;
    terminalOutput.appendChild(line);
}

function capyReply(message) {
    document.getElementById("capyReaction").textContent = message;
    return "CAPY: " + message;
}

function runCommand(command, args) {
    if (command === "help") {
        return "help, clear, pwd, ls, mkdir, cd, touch, cat, write, rm, whoami, hostname, date, time, echo, history, about, capy, orange, 67, joke, flip, roll, exit";
    }

    if (command === "clear") {
        terminalOutput.textContent = "";
        return "";
    }

    if (command === "pwd") {
        return currentPath;
    }

    if (command === "cd") {
        const name = args[0];

        if (args.length > 1) return "Usage: cd foldername";

        if (!name || name === "~") {
            currentPath = "/home/capy";
            return "";
        }

        if (name === "..") {
            if (currentPath !== "/home/capy") {
                currentPath = currentPath.slice(0, currentPath.lastIndexOf("/"));
            }
            return "";
        }

        if (name === ".") return "";

        const nextPath = currentPath + "/" + name;

        if (!folders[nextPath]) return "cd: folder not found";

        currentPath = nextPath;
        return "";
    }

    if (command === "ls") {
        return folders[currentPath].join("  ") || "Folder is empty.";
    }

    if (command === "mkdir") {
        const name = args[0];

        if (!name || args.length !== 1 || name.includes("/")) {
            return "Usage: mkdir foldername";
        }

        if (folders[currentPath].includes(name)) {
            return "mkdir: folder already exists";
        }

        folders[currentPath].push(name);
        folders[currentPath + "/" + name] = [];

        return "Folder created" + " " + name;
    }

    if (command === "touch") {
        const name = args[0];

        if (!name || args.length !== 1 || name.includes("/")) {
            return "Usage: touch filename";
        }

        if (folders[currentPath].includes(name)) {
            return "touch: name already exists";
        }

        folders[currentPath].push(name);
        files[currentPath + "/" + name] = "";

        return "File created: " + name;
    }

    if (command === "cat") {
        const name = args[0];

        if (!name || args.length !== 1) {
            return "Usage: cat filename";
        }

        const path = currentPath + "/" + name;

        if (!Object.hasOwn(files, path)) {
            return "cat: file not found";
        }

        return files[path] || "(empty file)"
    }

    if (command === "write") {
        const name = args[0];

        if (args.length < 2) {
            return "Usage: write filename your text";
        }

        const path = currentPath + "/" + name;

        if (!Object.hasOwn(files, path)) {
            return "write: file not found. Use touch first.";
        }

        files[path] = args.slice(1).join(" ");

        return "File saved: " + name;
    }

    if (command === "rm") {
        const name = args[0];

        if (!name || args.length !== 1 || name.includes("/")) {
            return "Usage: rm filename";
        }

        const path = currentPath + "/" + name;

        if (!Object.hasOwn(files, path)) {
            if (folders[currentPath].includes(name)) {
                return "rm: cannot remove a folder";
            }

            return "rm: file not found";
        }

        delete files[path];

        folders[currentPath] = folders[currentPath].filter(function(item) {
            return item !== name;
        });

        return "File removed: " + name;
    }

    if (command === "whoami") {
        return "capy"
    }

    if (command === "hostname") {
        return "basix";
    }

    if (command === "date") {
        return new Date().toDateString();
    }

    if (command === "time") {
        return new Date().toLocaleTimeString();
    }

    if (command === "echo") {
        return args.join(" ");
    }

    if (command === "history") {
        return commandHistory.join("\n");
    }

    if (command === "about") {
        return "BASIX OS - made by CAPYBARA.";
    }

    if (command === "capy") {
        const action = (args[0] || "").toLowerCase();

        if (action === "hello") {
            return capyReply("Oh... hello. I was sleeping.");
        }

        if (action === "sleep") {
            return capyReply("Zzz... meeting cancelled.");
        }

        if (action === "dance") {
            return capyReply("CAPY CAPY CAPY! *dances for 2 seconds and falls asleep*");
        }

        if (action === "orange") {
            return capyReply("ORANGEEEEE!! FINALLY SOME GOOD FOOD!");
        }

        if (action === "67") {
            return capyReply("SIX SEVEEEEN!! WHAT IS EVEN HAPPENING? ! 💀");
        }

        if (action === "help") {
            return "Try: capy hello, capy sleep, capy dance, capy orange, capy 67";
        }

        return capyReply("I'm sleeping. Try 'capy help'.");
    }

    if (command === "orange") {
        return capyReply("You gave me an orange! You are now my favourite human.");
    }

    if (command === "67") {
        return capyReply("SIX SEVEEEEN!!! CAPY has lost another brain call 💀")
    }

    if (command === "joke") {
        return capyReply("Why do I love programming? Because I can automate my naps.");
    }

    if (command === "flip") {
        const result = Math.random() < 0.5 ? "Heads" : "Tails";
        return capyReply("I flipped an orange... " + result + "!");
    }

    if (command === "roll") {
        const number = Math.floor(Math.random() * 6) + 1;
        return capyReply("I rolled a " + number + "! Can I sleep now?");
    }

    if (command === "exit") {
        document.getElementById("terminalWindow").hidden = true;
        return "";
    }

    return command + ": command not found";
}

terminalInput.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") {
        if (commandHistory.length === 0) return;

        event.preventDefault();

        if (historyIndex === commandHistory.length) {
            historyDraft = terminalInput.value;
        }

        historyIndex = Math.max(0, historyIndex - 1);
        terminalInput.value = commandHistory[historyIndex];
        return;
    }

    if (event.key === "ArrowDown") {
        if (commandHistory.length === 0 ||
            historyIndex === commandHistory.length) return;

        event.preventDefault();

        historyIndex = Math.min(commandHistory.length, historyIndex + 1);

        terminalInput.value = historyIndex === commandHistory.length
            ? historyDraft
            : commandHistory[historyIndex];

        return;
    }

    if (event.key !== "Enter") return;

    const text = terminalInput.value.trim();
    terminalInput.value = "";

    if (text === "") return;

    commandHistory.push(text);
    historyIndex = commandHistory.length;
    historyDraft = "";
    printLine("capy@basix:" + currentPath.replace("/home/capy", "~") + "$ " + text);

    const parts = text.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const result = runCommand(command, args);

    if (["mkdir", "touch", "write", "rm"].includes(command)) {
        saveTerminalFiles();
    }

    if (result !== "") {
        printLine(result);
    }

    terminalOutput.parentElement.scrollTop =
        terminalOutput.parentElement.scrollHeight;
});