/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module RobOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public cmdHistoryValue = 0,
                    public cmdHistory = []) {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        public resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...

                    //add buffer to cmdHistory array
                    this.cmdHistory[this.cmdHistory.length] = this.buffer;
                    this.cmdHistoryValue = this.cmdHistory.length;

                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                } else if (chr === String.fromCharCode(8)){ //handle backspace
                    //Delete last character put in the console/on the canvas
                    //Reset X Position
                    this.backspace();
                } else if ((chr == String.fromCharCode(38)) || 
                          (chr == String.fromCharCode(40))) { //handle up arrow
                    this.inputHistory(chr);
                }else if (chr == String.fromCharCode(9)) { //handle tab autofill
                    this.tabAutofill(this.buffer);
                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }

        public putText(text): void {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                //HANDLE LINE WRAP//
                //width from current position until the end of the canvas
                var remainingWidth = _Canvas.width - this.currentXPosition;
                //Empty/initalize buffer
                var buffer = "";
                var wrappedText = [];
                while(text.length > 0) {
                    while(text.length > 0 && _DrawingContext.measureText(this.currentFont, this.currentFontSize, (buffer + text.charAt(0))) <= remainingWidth) {
                        //add text to buffer
                        buffer += text.charAt(0);
                        text = text.slice(1);
                    }
                    //push wrapped text to buffer
                    wrappedText.push(buffer);
                    //empty buffer
                    buffer = "";
                    //new line (entire width)
                    remainingWidth = _Canvas.width;
                }
                //END END HANDLE LINE WRAP//

                //IMPLEMENT LINE WRAP//
                for(var i = 0; i < wrappedText.length; i ++) {
                    var line = wrappedText[i];

                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, line);
                    // Move the current X position.
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, line);
                    this.currentXPosition = this.currentXPosition + offset;
                    //
                    if(i + 1 < wrappedText.length) {
                        this.advanceLine();
                    }
                }
            }
        }
        backspace() {
            //get last entered character on console
            var lastChr = this.buffer.slice(-1); // Get last character in buffer (character to backspace)
            
            var width = _DrawingContext.measureText(this.currentFont, this.currentFontSize, lastChr);
            // Move cursor position
            this.currentXPosition -= width; 
            
            //Erase Character from console
            //clearRect() - Clear Rectangle of cursor
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, width, this.consoleHeight());
            
            // Remove character from buffer
            this.buffer = this.buffer.slice(0, -1); 
            //TODO: Fix line wrap bakspacing
        }
        inputHistory(chr) {
            if (chr == String.fromCharCode(38) && this.cmdHistoryValue > 0){
                this.cmdHistoryValue -= 1;
            }else if (chr == String.fromCharCode(40) && this.cmdHistoryValue < this.cmdHistory.length - 1) {
                this.cmdHistoryValue += 1;
            }
            //Clear Buffer//
            this.currentXPosition = 0;
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, _Canvas.width, this.consoleHeight());
            _StdOut.putText(_OsShell.promptStr);
            //add to buffer
            this.buffer = this.cmdHistory[this.cmdHistoryValue];
            //Display command
            this.putText(this.buffer);
        }
        tabAutofill(cmd) {
            if(cmd.length == 0) { //check if buffer is empty
                return;
            } else {
                var command = "";
                var letter = 0;
                if(cmd[0] == "h"){
                    command = "help";
                    switch(cmd) {
                        case "h":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case"he":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "hel":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            //add command to buffer
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                    }
                } else if(cmd[0] == "v") {
                    command = "ver";
                    switch(cmd) {
                        case "v":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "ve":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                    }
                } else if(cmd[0] == "s") {
                    command = "shutdown";
                        switch(cmd) {
                            case "s":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                        }
                    if(cmd[1] == "h") {
                        command = "shutdown";
                        switch(cmd) {
                            case "sh":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "shu":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "shut":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "shutd":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "shutdo":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "shutdow":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                        }
                    } else if(cmd[1] == "t") {
                        command = "status";
                        switch(cmd) {
                            case "st":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "sta":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "stat":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "statu":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                        }
                    }
                    /* CYCLE BETWEEN COMMANDS */
                    if(cmd == "shutdown") {
                        command = "status";
                        //delete letters in buffer already
                        for(letter; letter <= cmd.length; letter++) {this.backspace();}
                        this.buffer = command;
                        this.putText(this.buffer);
                    } else if(cmd == "status") {
                        command = "shutdown";
                        //delete letters in buffer already
                        for(letter; letter <= cmd.length; letter++) {this.backspace();}
                        this.buffer = command;
                        this.putText(this.buffer);
                    }
                } else if(cmd[0] == "c") {
                    command = "cls";
                    switch(cmd){
                        case "c":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                    }
                    if(cmd[1] == "l") {
                        command = "cls";
                        switch(cmd) {
                            case "cl":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                        }
                    }
                    if(cmd[2] == "e") {
                        switch(cmd) {
                            case "cl":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                        }
                    }
                    /* CYCLE BETWEEN COMMANDS */
                    if(cmd == "cls") {
                        command = "clearmem";
                        //delete letters in buffer already
                        for(letter; letter <= cmd.length; letter++) {this.backspace();}
                        this.buffer = command;
                        this.putText(this.buffer);
                    } else if(cmd == "clearmem") {
                        command = "cls";
                        //delete letters in buffer already
                        for(letter; letter <= cmd.length; letter++) {this.backspace();}
                        this.buffer = command;
                        this.putText(this.buffer);
                    }
                } else if(cmd[0] == "m") {
                    command = "man";
                    switch(cmd) {
                        case "m":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "ma":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                    }
                } else if(cmd[0] == "t") {
                    command = "trace";
                    switch(cmd) {
                        case "t":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "tr":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "tra":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "trac":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                    }
                } else if(cmd[0] == "r") {
                    command = "run";
                    switch(cmd) {
                        case "r":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                    }
                    if(cmd[1] == "o") {
                        command = "rot13";
                        switch(cmd) {
                            case "ro":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "rot":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "rot1":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                        }
                    } else if(cmd[1] == "u") {
                        command = "run";
                        switch(cmd) {
                            case "ru":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                        }
                    }
                    if(cmd[3] == "n") {
                        command = "runall";
                        switch(cmd) {
                            case "run":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "runa":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "runal":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                        }
                    }
                    /* CYCLE BETWEEN COMMANDS */
                    if(cmd == "rot13") {
                        command = "run";
                        //delete letters in buffer already
                        for(letter; letter <= cmd.length; letter++) {this.backspace();}
                        this.buffer = command;
                        this.putText(this.buffer);
                    } else if(cmd == "run") {
                        command = "runall";
                        //delete letters in buffer already
                        for(letter; letter <= cmd.length; letter++) {this.backspace();}
                        this.buffer = command;
                        this.putText(this.buffer);
                    } else if(cmd == "runall") {
                        command = "rot13";
                        //delete letters in buffer already
                        for(letter; letter <= cmd.length; letter++) {this.backspace();}
                        this.buffer = command;
                        this.putText(this.buffer);
                    }
                } else if(cmd[0] == "p") {
                    command = "ps";
                        switch(cmd) {
                            case "p":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                        }
                    if(cmd[1] == "r") {
                        command = "prompt";
                        switch(cmd) {
                            case "pr":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "pro":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "prom":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "promp":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                        }
                    }
                    /* CYCLE BETWEEN COMMANDS */
                    if(cmd == "ps") {
                        command = "prompt";
                        //delete letters in buffer already
                        for(letter; letter <= cmd.length; letter++) {this.backspace();}
                        this.buffer = command;
                        this.putText(this.buffer);
                    } else if(cmd == "prompt") {
                        command = "ps";
                        //delete letters in buffer already
                        for(letter; letter <= cmd.length; letter++) {this.backspace();}
                        this.buffer = command;
                        this.putText(this.buffer);
                    }
                } else if(cmd[0] == "d") {
                    command = "date";
                    switch(cmd) {
                        case "d":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "da":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "dat":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                    }
                } else if(cmd[0] == "w") {
                    command = "whereami"
                    switch(cmd){
                        case "w":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "wh":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "whe":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "wher":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "where":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "wherea":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "wheream":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                    }
                } else if(cmd[0] == "l") {
                    command = "load";
                    switch(cmd) {
                        case "l":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "lo":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "loa":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                    }
                    /* CYCLE BETWEEN COMMANDS */
                    if(cmd == "load") {
                        command = "loz";
                        //delete letters in buffer already
                        for(letter; letter <= cmd.length; letter++) {this.backspace();}
                        this.buffer = command;
                        this.putText(this.buffer);
                    } else if(cmd == "loz") {
                        command = "load";
                        //delete letters in buffer already
                        for(letter; letter <= cmd.length; letter++) {this.backspace();}
                        this.buffer = command;
                        this.putText(this.buffer);
                    }
                } else if(cmd[0] == "b") {
                    command = "bsod";
                    switch(cmd) {
                        case "b":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "bs":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "bso":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                    }
                } else if(cmd[0] == "k") {
                    command = "kill";
                    switch(cmd) {
                        case "k":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "ki":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "kil":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                    }
                    if(cmd[4] == "a"){
                        command = "killall";
                        switch(cmd) {
                            case "killa":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                            case "killal":
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                        }
                    }
                    /* CYCLE BETWEEN COMMANDS */
                    if(cmd == "kill") {
                        command = "killall";
                        //delete letters in buffer already
                        for(letter; letter <= cmd.length; letter++) {this.backspace();}
                        this.buffer = command;
                        this.putText(this.buffer);
                    } else if(cmd == "killall") {
                        command = "kill";
                        //delete letters in buffer already
                        for(letter; letter <= cmd.length; letter++) {this.backspace();}
                        this.buffer = command;
                        this.putText(this.buffer);
                    }
                } else if(cmd[0] == "q") {
                    command = "quantum";
                    switch(cmd) {
                        case "q":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "qu":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "qua":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "quan":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "quant":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                        case "quantu":
                            //delete letters in buffer already
                            for(letter; letter <= cmd.length; letter++) {this.backspace();}
                            this.buffer = command;
                            this.putText(this.buffer);
                            break;
                    }
                }

                //TODO: figure out for loop autocomplete
                // iterate through command list
                /*for (var i = 0; i <= _OsShell.commandList[_OsShell.commandList.length]; i++) {
                    var command = _OsShell.commandList[i];
                    //iterate through command for indivdual letters
                    for (var n = 0; n <= command.length; n++) {
                        if(cmd[n] == command[n])
                        switch (cmd){
                            case cmd[n]:
                                //delete letters in buffer already
                                for(letter; letter <= cmd.length; letter++) {this.backspace();}
                                this.buffer = command;
                                this.putText(this.buffer);
                                break;
                        }

                    }
                }*/
            }
        }
        consoleHeight() {
            // advanceLine() function for reference
            return _DefaultFontSize + 
                   _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                   _FontHeightMargin;
        }
        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;
            
            // TODO: Handle scrolling. (iProject 1)
            //SCROLLING//
            var canvas = _Canvas;
            var height = _Canvas.height;
            var width = _Canvas.width;
            var ctx = _DrawingContext;
            //Check if at the bottom of the screen
            if (this.currentYPosition >= height) {
                //Scrolling on the Y axis
                var scrollY = (this.currentYPosition - height) + _FontHeightMargin;
                //Get a screenshot of the canvas 
                var screenshot = _DrawingContext.getImageData(0, 0, width, height);
                //clear the current screen
                this.clearScreen();
                this.currentYPosition -= scrollY;
                //place textabove the new input line
                _DrawingContext.putImageData(screenshot, 0, -scrollY);
            }
        }
    }
 }
