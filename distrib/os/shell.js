/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var RobOS;
(function (RobOS) {
    class Shell {
        constructor() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        init() {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new RobOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new RobOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new RobOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new RobOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new RobOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new RobOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new RobOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new RobOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new RobOS.ShellCommand(this.shellDate, "date", "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new RobOS.ShellCommand(this.shellWhereami, "whereami", "- Tells you where you are on Earth.");
            this.commandList[this.commandList.length] = sc;
            // loz
            sc = new RobOS.ShellCommand(this.shellLoz, "loz", "- Displays triforce text art...");
            this.commandList[this.commandList.length] = sc;
            // status
            sc = new RobOS.ShellCommand(this.shellStatus, "status", "<string> - Sets your preferred status.");
            this.commandList[this.commandList.length] = sc;
            // bsod
            sc = new RobOS.ShellCommand(this.shellBSOD, "bsod", "- Displays a BSOD message.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new RobOS.ShellCommand(this.shellLoad, "load", "- Load UPI into memory for execution.");
            this.commandList[this.commandList.length] = sc;
            // run
            sc = new RobOS.ShellCommand(this.shellRun, "run", "<pid> - Runs a program already loaded in memory.");
            this.commandList[this.commandList.length] = sc;
            // runall
            sc = new RobOS.ShellCommand(this.shellRunAll, "runall", "- Execute all programs at once.");
            this.commandList[this.commandList.length] = sc;
            // clearmem
            sc = new RobOS.ShellCommand(this.shellClearMem, "clearmem", "- Clear all memory partitions.");
            this.commandList[this.commandList.length] = sc;
            // ps
            sc = new RobOS.ShellCommand(this.shellPS, "ps", "- Display the PID and state of all processes.");
            this.commandList[this.commandList.length] = sc;
            // kill <id>
            sc = new RobOS.ShellCommand(this.shellKill, "kill", "<pid> - Kill one process.");
            this.commandList[this.commandList.length] = sc;
            // killall
            sc = new RobOS.ShellCommand(this.shellKillAll, "killall", "- Kill all processes.");
            this.commandList[this.commandList.length] = sc;
            // quantum <int>
            sc = new RobOS.ShellCommand(this.shellQuantum, "quantum", "<int> - Sets the RR (Round Robin) quantum.");
            this.commandList[this.commandList.length] = sc;
            // create <filename>
            sc = new RobOS.ShellCommand(this.shellCreate, "create", "<filename> - Create a new file.");
            this.commandList[this.commandList.length] = sc;
            // read <filename>
            sc = new RobOS.ShellCommand(this.shellRead, "read", "<filename> - Read and display the contents of a file.");
            this.commandList[this.commandList.length] = sc;
            // write <filename>
            sc = new RobOS.ShellCommand(this.shellWrite, "write", "<filename> - Write the data inside the quotes to the file.");
            this.commandList[this.commandList.length] = sc;
            // delete <filename>
            sc = new RobOS.ShellCommand(this.shellDelete, "delete", "<filename> - Remove the file from storage.");
            this.commandList[this.commandList.length] = sc;
            // format
            sc = new RobOS.ShellCommand(this.shellFormat, "format", "- Initalize all blocks in all sectors in all sectors in all tracks.");
            this.commandList[this.commandList.length] = sc;
            // ls
            sc = new RobOS.ShellCommand(this.shellLS, "ls", "- List the files currently stored on the disk.");
            this.commandList[this.commandList.length] = sc;
            // setschedule
            sc = new RobOS.ShellCommand(this.shellSetSchedule, "setschedule", "- Set a specified CPU scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;
            // getschedule
            sc = new RobOS.ShellCommand(this.shellGetSchedule, "getschedule", "- Return the currently selected CPU scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;
            // Display the initial prompt.
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + RobOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }
        parseInput(buffer) {
            var retVal = new RobOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = RobOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = RobOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = RobOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("The current version of RobOS.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shuts down RobOS, but leaves the underlying host / hardware simulation running.");
                        break;
                    case "cls":
                        _StdOut.putText("Clears the entire screen.  Resets cursor to the left side of the screen.");
                        break;
                    case "man":
                        _StdOut.putText(" The manual. That thing you're reading. duh.");
                        break;
                    case "trace":
                        _StdOut.putText("Turns the OS trace on or off.");
                        break;
                    case "rot13":
                        _StdOut.putText("Does rot13 obfuscation on <string>.");
                        break;
                    case "prompt":
                        _StdOut.putText("Sets the prompt.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    case "date":
                        _StdOut.putText("Tells date and time.  Or look at your watch.");
                        break;
                    case "whereami":
                        _StdOut.putText("If you don't know where you are, I definitely don't");
                        break;
                    case "loz":
                        _StdOut.putText("The Legend of Zelda ... ya know, the game series?");
                        break;
                    case "status":
                        _StdOut.putText("Displays your status in the task bar above.");
                        break;
                    case "bsod":
                        _StdOut.putText("Test BSOD message.");
                        break;
                    case "load":
                        _StdOut.putText("Load the UPI (User Program Input) into memory for execution.");
                        break;
                    case "run":
                        _StdOut.putText("Runs a program that's already loaded into memory.");
                        break;
                    case "runall":
                        _StdOut.putText("Execute all programs at once.");
                        break;
                    case "clearmem":
                        _StdOut.putText("Clear all memory partitions.");
                        break;
                    case "ps":
                        _StdOut.putText("Display the PID and state of all processes.");
                        break;
                    case "kill":
                        _StdOut.putText("Kill a specified process in memory.");
                        break;
                    case "killall":
                        _StdOut.putText("Kill all processes in memory.");
                        break;
                    case "quantum":
                        _StdOut.putText("Lets the user set the RR (Round Robin) quantum (measured in cpu cycles).");
                        break;
                    case "create":
                        _StdOut.putText("Create the file 'filename'.");
                        break;
                    case "read":
                        _StdOut.putText("Read and display the contents of the file 'filename'.");
                        break;
                    case "write":
                        _StdOut.putText("Write the data inside the quotes to the file 'filename'.");
                        break;
                    case "delete":
                        _StdOut.putText("Remove the file 'filename' from storage.");
                        break;
                    case "format":
                        _StdOut.putText("Initialize all blocks in all sectors in all tracks.");
                        break;
                    case "ls":
                        _StdOut.putText("List the files currently stored on the disk.");
                        break;
                    case "setschedule":
                        _StdOut.putText("Select a CPU scheduling algorithm [rr, fcfs, priority].");
                        break;
                    case "getschedule":
                        _StdOut.putText("Return the currently selected CPU scheduling algorithm.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + RobOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        shellDate(args) {
            _StdOut.putText("Date: " + today);
        }
        shellWhereami(args) {
            _StdOut.putText("https://earth.google.com/web/");
        }
        shellLoz(args) {
            _StdOut.putText("          / \\          ");
            _StdOut.advanceLine();
            _StdOut.putText("         /   \\         ");
            _StdOut.advanceLine();
            _StdOut.putText("        /     \\        ");
            _StdOut.advanceLine();
            _StdOut.putText("       /       \\       ");
            _StdOut.advanceLine();
            _StdOut.putText("      /_________\\      ");
            _StdOut.advanceLine();
            _StdOut.putText("     /\\        /\\     ");
            _StdOut.advanceLine();
            _StdOut.putText("    /  \\      /  \\    ");
            _StdOut.advanceLine();
            _StdOut.putText("   /    \\    /    \\   ");
            _StdOut.advanceLine();
            _StdOut.putText("  /      \\  /      \\  ");
            _StdOut.advanceLine();
            _StdOut.putText(" /________\\/________\\ ");
        }
        shellStatus(args) {
            if (args.length > 0 && !null) {
                var statusIn = document.getElementById("statusIn").innerText = "Status: " + args.join(" ");
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string status update.");
            }
        }
        shellBSOD(args) {
            _StdOut.putText("WARNING:");
            _StdOut.advanceLine();
            _StdOut.putText("Because of something you did,");
            _StdOut.advanceLine();
            _StdOut.putText("RobOS is highly unstable");
            _StdOut.advanceLine();
            _StdOut.putText("You can try to restore RobOS,");
            _StdOut.advanceLine();
            _StdOut.putText("although that probably won't work,");
            _StdOut.advanceLine();
            _StdOut.putText("or restart your stupid computer.");
            _StdOut.advanceLine();
            _StdOut.advanceLine();
            _StdOut.putText("CHOOSE FROM THE FOLLOWING:");
            _StdOut.advanceLine();
            _StdOut.putText("Sacrifice something to Robbie");
            _StdOut.advanceLine();
            _StdOut.putText("and hope he takes pity on you.");
            _StdOut.advanceLine();
            _Kernel.krnShutdown();
        }
        shellLoad(args) {
            var valid = true;
            //Valid hex values to make program
            var validHex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
            var validOPCodes = ['A9', 'AD', '8D', '6D', 'A2', 'AE', 'A0', 'AC', 'EA', '00', 'EC', 'D0', 'EE', 'FF'];
            //User Program Input
            _UserCodeTextArea = document.getElementById("taProgramInput");
            var upi = _UserCodeTextArea.value;
            //Split at Space into array
            upi = upi.toUpperCase();
            var hexChrArr = upi.split('');
            var OPCodeArr = upi.split(' ');
            upi = upi.replace(/\s/g, '');
            //Checks for only hex characters
            for (var i = 0; i < upi.length; i++) {
                //Check if each character is in array
                if (validHex.indexOf(upi[i]) == -1) {
                    _StdOut.putText("LOAD ERROR: - Please only enter valid hex characters (0-9, a-z, and A-Z).");
                    _StdOut.advanceLine();
                    _StdOut.putText("INVALID CHARACTER: " + upi[i]);
                    _StdOut.advanceLine();
                    valid = false;
                }
            }
            //TODO: Validate OP Codes
            //Loading Program
            if (valid == true) {
                //_PID initialized in globals.ts
                //_StdOut.putText("Entered hex OP codes are valid.");
                //_StdOut.advanceLine();
                if (_MemoryManager.checkMemoryAvailability()) {
                    var pcb = new RobOS.PCB();
                    pcb.PID = _PID;
                    //currentPCB = pcb;
                    pcb.location = "Memory";
                    pcb.state = "Waiting";
                    //Assign to memory section
                    pcb.section = _MemoryManager.assignMemory();
                    PCBList[PCBList.length] = pcb;
                    residentPCB[residentPCB.length] = pcb;
                    //Load Memory
                    _MemoryManager.loadMemory(OPCodeArr, pcb.section, pcb.PID);
                    //Update PCB's IR
                    pcb.IR = _MemoryAccessor.readMemoryHex(pcb.section, pcb.PC);
                    //Update the Memory Table
                    RobOS.Control.memoryTbUpdate();
                    //Update the Processes Table
                    RobOS.Control.proccessesTbUpdate();
                    //Program successfully loaded
                    _StdOut.putText("Program loaded.");
                    _StdOut.advanceLine();
                    _StdOut.putText("PID: " + pcb.PID);
                    //_StdOut.putText(upi); //print user program input to debug/validate
                    //Increment PID
                    _PID++;
                }
                else if (!_MemoryManager.checkMemoryAvailability() && _DiskFormatted) {
                    _StdOut.putText("Memory full. Loading process to disk.");
                    var pcb = new RobOS.PCB();
                    pcb.PID = _PID;
                    //currentPCB = pcb;
                    pcb.location = "Disk";
                    pcb.state = "Waiting";
                    //Assign to memory section
                    pcb.section = "disk";
                    PCBList[PCBList.length] = pcb;
                    residentPCB[residentPCB.length] = pcb;
                    //Load Memory
                    _MemoryManager.loadMemory(OPCodeArr, pcb.section, pcb.PID);
                    //Update PCB's IR
                    pcb.IR = upi[0] + upi[1] + " ";
                    //Update the Memory Table
                    RobOS.Control.memoryTbUpdate();
                    //Update the Processes Table
                    RobOS.Control.proccessesTbUpdate();
                    //Program successfully loaded
                    _StdOut.putText("Program loaded.");
                    _StdOut.advanceLine();
                    _StdOut.putText("PID: " + pcb.PID);
                    //_StdOut.putText(upi); //print user program input to debug/validate
                    //Increment PID
                    _PID++;
                }
                else {
                    _StdOut.putText("Memory is full.");
                }
            }
        }
        shellRun(args) {
            //Check that arg is not empty and is a number
            if (args.length > 0 && (!isNaN(Number(args[0])))) {
                var enteredPID = Number(args[0]);
                //check if PID is loaded in memory
                if (_MemoryManager.checkPCBisResident(enteredPID)) {
                    PCBList[_MemoryManager.getIndex(PCBList, enteredPID)].state = "Ready";
                    //RobOS.Control.proccessesTbUpdate();
                    readyPCBQueue[readyPCBQueue.length] = _MemoryManager.getPCB(enteredPID);
                    currentPCB = _MemoryManager.getPCB(enteredPID);
                    _CPU.isExecuting = true;
                    RobOS.Control.updateAllTables();
                }
                else {
                    _StdOut.putText("Please enter a valid PID number.");
                }
            }
            else {
                _StdOut.putText("Please put a number for the PID.");
            }
        }
        shellRunAll(args) {
            if (residentPCB.length == 0) {
                _StdOut.putText("There are no processes in memory to run.");
                return;
            }
            else {
                //Turn all processes from waiting to ready
                for (var i = 0; i < residentPCB.length; i += 0) {
                    if (residentPCB[i].state == "Waiting") {
                        residentPCB[i].state = "Ready";
                        readyPCBQueue[readyPCBQueue.length] = residentPCB[i];
                        residentPCB.splice(i, 1);
                    }
                }
                if (!_CPU.isExecuting) {
                    _CPU.init();
                    currentPCB = readyPCBQueue[0];
                    if (_SingleStep == true) {
                        _CPU.isExecuting = false;
                    }
                    else {
                        _CPU.isExecuting = true;
                    }
                    RobOS.Control.updateAllTables();
                }
            }
        }
        shellClearMem(args) {
            if (!_CPU.isExecuting) {
                //Clear PCB list and queue, then clear memory which updates tables
                PCBList = [];
                readyPCBQueue = [];
                residentPCB = [];
                var section = "all";
                _MemoryManager.clearMem(section);
                RobOS.Control.memoryTbUpdate();
            }
            else {
                _StdOut.putText("HALT: Memory can only be cleared when there are no programs being executed.");
            }
        }
        shellPS(args) {
            if (PCBList.length > 0) {
                for (var i = 0; i < PCBList.length; i++) {
                    _StdOut.putText("PID: " + PCBList[i].PID + " | State: " + PCBList[i].state);
                    _StdOut.advanceLine();
                }
            }
            else {
                _StdOut.putText("There are currently no processes in memory.");
            }
        }
        shellKill(args) {
            if (args.length == 1 && (!isNaN(Number(args[0])))) {
                var enteredPID = Number(args[0]);
                //Check if PCB is resident
                if (_MemoryManager.checkPCBisResident(enteredPID) || _MemoryManager.checkPCBinReadyQueue(enteredPID)) {
                    _StdOut.putText("Process " + enteredPID + ": Terminated");
                    //if current PCB is not null and PID is equal to the entered PID
                    if (currentPCB != null && currentPCB.PID == enteredPID) {
                        currentPCB = null; //set currentPCB to null
                    }
                    if (_MemoryManager.getPCB(enteredPID).section == "disk") {
                    }
                    //Get PCB section by enteredPID and clear section
                    var section = _MemoryManager.getPCB(enteredPID).section;
                    _MemoryManager.clearMem(section);
                    //Get index in the PCBList by enteredPID and remove that section from PCBList
                    var indexPCBList = _MemoryManager.getIndex(PCBList, enteredPID);
                    PCBList.splice(indexPCBList, 1);
                    //Get index in the residentPCB list
                    if (_MemoryManager.checkPCBisResident(enteredPID)) {
                        var indexResidentPCB = _MemoryManager.getIndex(residentPCB, enteredPID);
                        residentPCB.splice(indexResidentPCB, 1);
                    }
                    //check if PCB is in the ready queue and remove it from the readyPCBQueue
                    if (_MemoryManager.checkPCBinReadyQueue(enteredPID)) {
                        var indexPCBReadyQueue = _MemoryManager.getIndex(readyPCBQueue, enteredPID);
                        readyPCBQueue.splice(indexPCBReadyQueue, 1);
                    }
                    //Update Tables
                    RobOS.Control.updateAllTables();
                    _Scheduler.schedule();
                }
                else {
                    _StdOut.putText("Please enter a valid PID number that is in memory.");
                }
            }
            else {
                _StdOut.putText("Please enter a PID number.");
            }
        }
        shellKillAll(args) {
            //Stop CPU
            _CPU.isExecuting = false;
            //Let user know which processes are being terminated
            for (var i = 0; i < PCBList.length; i++) {
                _StdOut.putText("Process " + PCBList[i].PID + ": Terminated");
                _StdOut.advanceLine();
            }
            //clear all memory partitions/sections and update tables
            _MemoryManager.clearMem("all");
            //Clear all lists
            PCBList = [];
            readyPCBQueue = [];
            residentPCB = [];
            //set currentPCB to null
            currentPCB = null;
            RobOS.Control.updateAllTables();
        }
        shellQuantum(args) {
            //Check if quantum is valid
            if (args.length > 0 && !(isNaN(Number(args[0])))) {
                var enteredQuantum = Number(args[0]);
                if (enteredQuantum > 0) {
                    //set quantum to the entered number
                    _Quantum = enteredQuantum;
                }
                else {
                    _StdOut.putText("Please enter a quantum greater than 0.");
                }
            }
            else {
                _StdOut.putText("Please enter a valid quantum.");
            }
        }
        shellCreate(args) {
            var filename = args[0];
            if (_DiskFormatted) { //Disk must be formatted to create a file
                if (args.length == 1) { //No spaces allowed in Filenames
                    if (filename[0] != "~") { // "~" represents blank
                        if (filename.length < 60) {
                            if (_krnFSDD.findFile(filename) == null) {
                                _krnFSDD.createFile(filename);
                                _StdOut.putText("Successfully created file: " + filename);
                            }
                            else {
                                _StdOut.putText("File, " + filename + ", already exists.");
                                _StdOut.advanceLine();
                                _StdOut.putText("Please name your file something different.");
                            }
                        }
                        else {
                            _StdOut.putText("ERROR: Filename too large.");
                            _StdOut.advanceLine();
                            _StdOut.putText("Please enter a filename of 60 characters or less.");
                        }
                    }
                    else {
                        _StdOut.putText("ERROR: '~' is invalid character in a filename.");
                        _StdOut.advanceLine();
                    }
                }
                else {
                    _StdOut.putText("ERROR: Invalid filename.");
                    _StdOut.advanceLine();
                    _StdOut.putText("Please enter a valid filename.");
                }
            }
            else {
                _StdOut.putText("ERROR: Disk is not yet formatted.");
                _StdOut.advanceLine();
                _StdOut.putText("The disk must be formatted before a file can be created.");
            }
        }
        shellRead(args) {
            if (_DiskFormatted) { //Disk must be formatted to read a file
                if (args.length == 1) { //check for filename with no spaces
                    var filename = args[0];
                    var returnedFilename = _krnFSDD.findFile(filename);
                    if (returnedFilename != null) {
                        var returnedFileData = _krnFSDD.readFile(returnedFilename);
                        if (returnedFileData != " ") {
                            _StdOut.putText(returnedFileData);
                        }
                        else {
                            _StdOut.putText("There is no data in this file to read.");
                            _StdOut.advanceLine();
                            _StdOut.putText("Please write something to the file to read it.");
                        }
                    }
                    else {
                        _StdOut.putText("ERROR: File, " + filename + ", not found.");
                        _StdOut.advanceLine();
                        _StdOut.putText("Please enter a valid filename that has been created.");
                    }
                }
                else {
                    _StdOut.putText("ERROR: Incomplete command.");
                    _StdOut.advanceLine();
                    _StdOut.putText("Please enter a filename (without spaces) to read.");
                }
            }
            else {
                _StdOut.putText("ERROR: Disk is not yet formatted.");
                _StdOut.advanceLine();
                _StdOut.putText("The disk must be formatted before a files can be created then read.");
            }
        }
        shellWrite(args) {
            if (_DiskFormatted) {
                if (args.length > 1) {
                    var filename = args[0];
                    //get text to write to file
                    var start = args[1];
                    var end = args[args.length - 1];
                    var returnedFilename = _krnFSDD.findFile(filename);
                    if (returnedFilename != null) {
                        if ((start.charAt(0) == "\"" && end.charAt(end.length - 1) == "\"") || (start.charAt(0) == "\'" && end.charAt(end.length - 1) == "\'")) {
                            if (args.length == 2) {
                                start = start.slice(1, start.length - 1);
                                args[1] = start;
                            }
                            else {
                                start = start.slice(1, start.length);
                                args[1] = start;
                                end = end.slice(0, end.length - 1);
                                args[args.length - 1] = end;
                            }
                            args.shift();
                            _krnFSDD.writeFile(returnedFilename, args.join(" "), "no swap");
                            _StdOut.putText("Text written to file, " + filename + ", successfully.");
                        }
                        else {
                            _StdOut.putText("ERROR: Incomplete command.");
                            _StdOut.advanceLine();
                            _StdOut.putText("Please put the text you want to write to the file in double OR single quotes.");
                        }
                    }
                    else {
                        _StdOut.putText("ERROR: File, " + filename + ", not found.");
                        _StdOut.advanceLine();
                        _StdOut.putText("Please enter a valid filename that has been created.");
                    }
                }
                else if (args.length == 1) {
                    _StdOut.putText("ERROR: Incomplete command.");
                    _StdOut.advanceLine();
                    _StdOut.putText("Please entering a filename, enter text to write to the file in double or single quotes .");
                }
                else {
                    _StdOut.putText("ERROR: Incomplete command.");
                    _StdOut.advanceLine();
                    _StdOut.putText("Please enter a filename followed by a text to write to the file.");
                }
            }
            else {
                _StdOut.putText("ERROR: Disk is not yet formatted.");
                _StdOut.advanceLine();
                _StdOut.putText("The disk must be formatted before a files can be created then written to.");
            }
        }
        shellDelete(args) {
            if (_DiskFormatted) { //Disk must be formatted to read a file
                if (args.length == 1) { //check for filename with no spaces
                    var filename = args[0];
                    var returnedFilename = _krnFSDD.findFile(filename);
                    if (returnedFilename != null) {
                        _krnFSDD.deleteFile(returnedFilename);
                        _StdOut.putText("Deleted file, " + filename + ", successfully.");
                    }
                    else {
                        _StdOut.putText("ERROR: File, " + filename + ", not found.");
                        _StdOut.advanceLine();
                        _StdOut.putText("Please enter a valid filename that has been created.");
                    }
                }
                else {
                    _StdOut.putText("ERROR: Incomplete command.");
                    _StdOut.advanceLine();
                    _StdOut.putText("Please enter a filename (without spaces) to delete.");
                }
            }
            else {
                _StdOut.putText("ERROR: Disk is not yet formatted.");
                _StdOut.advanceLine();
                _StdOut.putText("The disk must be formatted before a files can be created then deleted.");
            }
        }
        shellFormat(args) {
            if (_DiskFormatted) {
                _StdOut.putText("The Disk has already been formatted. The Disk can only be formatted once.");
            }
            else {
                _krnFSDD.formatDisk();
                _DiskFormatted = true;
                _StdOut.putText("The Disk has been formatted.");
            }
        }
        shellLS(args) {
            //List Files
            if (_DiskFormatted) {
                var filenamesArr = _krnFSDD.listFilenames();
                if (filenamesArr.length > 0) { //make sure there were filenames returned to the array
                    _StdOut.putText("Files:");
                    _StdOut.advanceLine();
                    for (var l = 0; l < filenamesArr.length; l++) {
                        _StdOut.putText(filenamesArr[l]);
                        _StdOut.advanceLine();
                    }
                }
                else {
                    _StdOut.putText("NO FILES ON THE DISK.");
                }
            }
            else {
                _StdOut.putText("ERROR: Disk is not yet formatted.");
                _StdOut.advanceLine();
                _StdOut.putText("The disk must be formatted before a files can be created then display filenames.");
            }
        }
        shellSetSchedule(args) {
            var setAlgorithm = args[0];
            if (setAlgorithm == "rr" || setAlgorithm == "Red Robin"
                || setAlgorithm == "RED ROBIN" || setAlgorithm == "red robin") { //Red Robin Scheduling
                _SchedulingAlgorithm = "ROUND ROBIN";
                _StdOut.putText("Scheduling Algorithm set to Round Robin.");
            }
            else if (setAlgorithm == "fcfs" || setAlgorithm == "First Come First Serve"
                || setAlgorithm == "FIRST COME FIRST SERVE" || setAlgorithm == "first come first serve") { //First Come First Serve Scheduling
                _SchedulingAlgorithm = "FIRST COME FIRST SERVE";
                _StdOut.putText("Scheduling Algorithm set to First Come First Serve.");
            }
            else if (_SchedulingAlgorithm == "priority" || _SchedulingAlgorithm == "PRIORITY") { //Priority Scheduling
                _SchedulingAlgorithm = "PRIORITY";
                _StdOut.putText("Scheduling Algorithm set to Priority.");
            }
            else {
                _StdOut.putText("Please enter a valid Scheduling Algorithm [rr, fcfs, priority]");
            }
        }
        shellGetSchedule(args) {
            _StdOut.putText("The current Scheduling Algorithm is " + _SchedulingAlgorithm + ".");
        }
    }
    RobOS.Shell = Shell;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=shell.js.map