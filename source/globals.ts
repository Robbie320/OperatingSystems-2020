/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in our text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
const APP_NAME: string    = "RobOS";   // 'cause Bob and I were at a loss for a better name.
const APP_VERSION: string = "Connery 3.5";   // What did you expect?

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

const TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                              // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ: number = 1;
//Interrupts
var SYSTEM_CALL: number = 2;
var CONTEXT_SWITCH: number = 3;

var today = new Date();

//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU: RobOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement;          // Initialized in Control.hostInit().
var _DrawingContext: any;                // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;       // Additional space added to font size when advancing a line.
var _UserCodeTextArea;
var _Trace: boolean = true;              // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: RobOS.Kernel;
var _KernelInterruptQueue: RobOS.Queue = null;
var _KernelInputQueue: RobOS.Queue = null; 
var _KernelBuffers = null; 

// Standard input and output
var _StdIn:  RobOS.Console = null; 
var _StdOut: RobOS.Console = null;

// UI
var _Console: RobOS.Console;
var _OsShell: RobOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver: RobOS.DeviceDriverKeyboard  = null;

var _hardwareClockID: number = null;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados-ip*.js http://alanclasses.github.io/TSOS/test/ .
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

//Process ID in load function in shell file
var _PID: number = 0;
//Process Control Block
var _PCB: RobOS.PCB;
var PCBList = [];
var currentPCB = null;
var readyPCBQueue = [];
var residentPCB = [];

//Memory
//Hardware (host)
var _Memory: RobOS.Memory;
var _MemoryAccessor: RobOS.MemoryAccessor;
//Software (OS)
var _MemoryManager: any = null;

//Scheduler
var _Scheduler: any = null;
var _SchedulingAlgorithm = "ROUND ROBIN"; //Round Robin by Default
var _Quantum = 6; //6 by default
var _Pointer = 0;

//Single Step
var _SingleStep = false;
var _NextStep = false;

var onDocumentLoad = function() {
	RobOS.Control.hostInit();
};
