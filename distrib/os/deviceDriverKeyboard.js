/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var RobOS;
(function (RobOS) {
    // Extends DeviceDriver
    class DeviceDriverKeyboard extends RobOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted == true) {
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                }
                else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 48) && (keyCode <= 57))) { // digits
                if (isShifted == true) { // Special Characters
                    if (keyCode == 48) {
                        keyCode = 41; // ) closing parenthesis
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 49) {
                        keyCode = 33; // ! exclamation mark
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 50) {
                        keyCode = 64; // @ at symbol
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 51) {
                        keyCode = 35; // # pound symbol/hashtag
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 52) {
                        keyCode = 36; // $ dollar sign
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 53) {
                        keyCode = 37; // % percent symbol
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 54) {
                        keyCode = 94; // ^ caret
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 55) {
                        keyCode = 38; // & ampersand
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 56) {
                        keyCode = 42; // * asterisk 
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 57) {
                        keyCode = 40; // ( opening parenthesis
                        chr = String.fromCharCode(keyCode);
                    }
                }
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            // Punctuation
            else if ((keyCode >= 186) && (keyCode <= 222)) {
                if (isShifted == false) {
                    if (keyCode == 186) {
                        keyCode = 59; // ; semicolon
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 187) {
                        keyCode = 61; // = equal
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 188) {
                        keyCode = 44; // , comma
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 189) {
                        keyCode = 45; // - minus
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 190) {
                        keyCode = 46; // . period
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 191) {
                        keyCode = 47; // / forward slash
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 219) {
                        keyCode = 91; // [ opening bracket
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 220) {
                        keyCode = 92; // \ backslash
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 221) {
                        keyCode = 93; // ] closing bracket
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 222) {
                        keyCode = 39; // ' single quote
                        chr = String.fromCharCode(keyCode);
                    }
                }
                ///////Shifted Punctuation///////
                else if (isShifted == true) {
                    if (keyCode == 186) {
                        keyCode = 58; // : colon
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 187) {
                        keyCode = 43; // + plus
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 188) {
                        keyCode = 60; // < less-than symbol
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 189) {
                        keyCode = 95; // _ underscore
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 190) {
                        keyCode = 62; // > greater-than symbol
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 191) {
                        keyCode = 63; // ? question mark
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 219) {
                        keyCode = 123; // { opening curly braces
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 220) {
                        keyCode = 124; // | straight vertical line
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 221) {
                        keyCode = 125; // } closing curly braces
                        chr = String.fromCharCode(keyCode);
                    }
                    else if (keyCode == 222) {
                        keyCode = 34; // " double quote
                        chr = String.fromCharCode(keyCode);
                    }
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 38) || (keyCode == 40)) { // left-, up-, right-, down- arrows
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 32) || // space
                (keyCode == 8) || //backspace
                (keyCode == 9) || //tab
                (keyCode == 13)) { // enter
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
        }
    }
    RobOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=deviceDriverKeyboard.js.map