const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");

let currentPath = "/home/capy";
const folders = {
    "/home/capy": []
};
let commandHistory = [];

function printLine(text) {
    const line = document.createElement("div");
    line.textContent = text;
    terminalOutput.appendChild(line);
}

function runCommand(command, args) {
    if (command === "help") {
        return "help, clear, pwd, ls, whoami, hostname, date, time, echo, history, about, capy, exit";
    }

    if (command === "clear") {
        terminalOutput.textContent = "";
        return "";
    }

    if (command === "pwd") {
        return currentPath;
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
        return "Capy is sleeping. Don't disturb him!";
    }

    if (command === "exit") {
        document.getElementById("terminalWindow").hidden = true;
        return "";
    }

    return command + ": command not found";
}

terminalInput.addEventListener("keydown", function(event) {
    if (event.key !== "Enter") return;

    const text = terminalInput.value.trim();
    terminalInput.value = "";

    if (text === "") return;

    commandHistory.push(text);
    printLine("capy@basix:~$ " + text);

    const parts = text.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const result = runCommand(command, args);

    if (result !== "") {
        printLine(result);
    }

    terminalOutput.parentElement.scrollTop =
        terminalOutput.parentElement.scrollHeight;
});