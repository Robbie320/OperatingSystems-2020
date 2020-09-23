/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module RobOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc: ShellCommand;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            
            // date
            sc = new ShellCommand(this.shellDate,
                "date",
                " - Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhereami,
                "whereami",
                " - Tells you where you are on Earth.");
            this.commandList[this.commandList.length] = sc;

            // loz
            sc = new ShellCommand(this.shellLoz,
                "loz",
                " - Displays triforce text art... for now.");
            this.commandList[this.commandList.length] = sc;

            // status
            sc = new ShellCommand(this.shellStatus,
                "status",
                "<string> - Sets your preferred status.");
            this.commandList[this.commandList.length] = sc;
            
            // bsod
            sc= new ShellCommand(this.shellBSOD,
                "bsod",
                " - Displays a BSOD message.");
            this.commandList[this.commandList.length] = sc;
            
            // load
            sc = new ShellCommand(this.shellLoad,
                "load",
                " - Load to validate the user code in the HTML5 text area.");
            this.commandList[this.commandList.length] = sc;

            // run
            sc = new ShellCommand(this.shellRun,
                "run",
                "<pid> - Runs a program that's already loaded into memory.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
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

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
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
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args: string[]) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        public shellMan(args: string[]) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("The current version of RobOS.")
                        break;
                    case "shutdown":
                        _StdOut.putText("Shuts down RobOS, but leaves the underlying host / hardware simulation running.")
                        break;
                    case "cls":
                        _StdOut.putText("Clears the entire screen.  Resets cursor to the left side of the screen.")
                        break;
                    case "man":
                        _StdOut.putText(" The manual. That thing you're reading. duh.")
                        break;
                    case "trace":
                        _StdOut.putText("Turns the OS trace on or off.")
                        break;
                    case "rot13":
                        _StdOut.putText("Does rot13 obfuscation on <string>.")
                        break;
                    case "prompt":
                        _StdOut.putText("Sets the prompt.")
                        break;
                    case "date":
                        _StdOut.putText("Tells date and time.  Or look at your watch.")
                        break;
                    case "whereami":
                        _StdOut.putText("If you don't know where you are, I definitely don't")
                        break;
                    case "loz":
                        _StdOut.putText("The Legend of Zelda ... ya know, the game series?")
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
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
                    case "date":
                        _StdOut.putText("Tells date and time.  Or look at your watch.");
                        break;
                    case "whereami":
                        _StdOut.putText("If you don't know where you are, I definitely don't.");
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
                        _StdOut.putText("Validate the user code in the HTML5 text area.");
                        break;
                    case "run":
                        _StdOut.putText("Runs a program that's already loaded into memory.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate(args: string[]) {
           _StdOut.putText("Date: " + today);
        }

        public shellWhereami(args: string[]){
            _StdOut.putText("https://earth.google.com/web/");
        }

        public shellLoz(args: string[]){
            _StdOut.putText("          / \\          "); _StdOut.advanceLine();
            _StdOut.putText("         /   \\         "); _StdOut.advanceLine();
            _StdOut.putText("        /     \\        "); _StdOut.advanceLine();
            _StdOut.putText("       /       \\       "); _StdOut.advanceLine();
            _StdOut.putText("      /_________\\      "); _StdOut.advanceLine();
            _StdOut.putText("     /\\        /\\     "); _StdOut.advanceLine();
            _StdOut.putText("    /  \\      /  \\    "); _StdOut.advanceLine();
            _StdOut.putText("   /    \\    /    \\   "); _StdOut.advanceLine();
            _StdOut.putText("  /      \\  /      \\  "); _StdOut.advanceLine();
            _StdOut.putText(" /________\\/________\\ ");
        }

        public shellStatus(args: string[]){
            if (args.length > 0 && !null) {
                var statusIn = document.getElementById("statusIn").innerText = "Status: " + args.join(" ");
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string status update.");
            }
        }
        public shellBSOD(args: string[]){
            _StdOut.putText("WARNING:"); _StdOut.advanceLine();
            _StdOut.putText("Because of something you did,"); _StdOut.advanceLine();
            _StdOut.putText("RobOS is highly unstable"); _StdOut.advanceLine();
            _StdOut.putText("You can try to restore RobOS,"); _StdOut.advanceLine();
            _StdOut.putText("although that probably won't work,"); _StdOut.advanceLine();
            _StdOut.putText("or restart your stupid computer."); _StdOut.advanceLine();
            _StdOut.advanceLine();
            _StdOut.putText("CHOOSE FROM THE FOLLOWING:"); _StdOut.advanceLine();
            _StdOut.putText("Sacrifice something to Robbie"); _StdOut.advanceLine();
            _StdOut.putText("and hope he takes pity on you."); _StdOut.advanceLine();
            _Kernel.krnShutdown();
        }
        public shellLoad(args: string[]){
            var loaded = true;

            //Valid hex values to make program
            var validHex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', ' '];
            //User Program Input
            var upi = _UserCodeTextArea.value;
            upi = RobOS.Utils.trim(upi);
            
            //Validate Hex Characters
            for (var i = 0; i < upi.length; i++) {
                //Check if each character is in array
                if(validHex.indexOf(upi[i].toUpperCase()) == -1) {
                    _StdOut.putText("LOAD ERROR: - Please only enter valid hex characters (0-9, a-z, and A-Z).");
                    _StdOut.advanceLine();
                    _StdOut.putText("INVALID CHARACTER: " + upi[i].toUpperCase());
                    _StdOut.advanceLine();
                    loaded = false;
                }
            }
            //Loading Program
            if(loaded == true){
                //pid initialized in globals.ts 
                _StdOut.putText("Program loaded. PID: " + PID + ".");
                //Increment PID
                PID += 1;
                _StdOut.advanceLine();
                _StdOut.putText(upi);//user program input
                
            }
        }
        public shellRun(args: String[]) {
            //Check that arg is not empty and is a number
            if (args.length > 0 && (!isNaN(Number(args[0])))){
                let enteredPID = Number(args[0]);
                //check if PID is loaded in memory
                if(_MemoryManager) {
                    
                }
                else {
                    _StdOut.putText("PID number is invalid.");
                    _StdOut.putText("Please enter a valid PID number.");
                }
            }
            else {
                _StdOut.putText("Please enter a PID number.");
            }
        }
    }
}