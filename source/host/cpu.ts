/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module RobOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public IR: String = "0",
                    public ACC: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {
        }
        
        public init(): void {
            this.PC = 0;
            this.IR = "0";
            this.ACC = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //LDA and STA 6502a op codes
            //Fetch Instructions
            this.IR;
            //Decode and Execute Instructions
            switch(this.IR) {
                case "A9":
                    this.loadACCWithConstant();
                    break;
                case "AD":
                    this.loadACCFromMemory();
                    break;
                case "8D":
                    this.storeACCInMemory();
                    break;
                case "6D":
                    this.addWithCarry();
                    break;
                case "A2":
                    this.loadXRegWithConstant();
                    break;
                case "AE":
                    this.loadXRegFromMemory();
                    break;
                case "A0":
                    this.loadYRegWithConstant();
                    break;
                case "AC":
                    this.loadYRegFromMemory();
                    break;
                case "EA":
                    break;
                case "00":
                    //saveState()
                    //terminate
                    this.isExecuting = false;
                    break;
                case "EC":
                    this.compareByteToXReg();
                    break;
                case "D0":
                    this.branchBytes();
                    break;
                case "EE":
                    this.incrementByteValue();
                    break;
                case "FF":
                    this.systemCall();
                    break;
                default:
                    _Kernel.krnTrapError("Instruction Not Valid: .")
                    //this.PCB.terminate();
                    this.isExecuting = false;
            }
        }
        increasePC() {
            this.PC++;
        }
        loadACCWithConstant() {
            this.increasePC();
            this.ACC;
        }
        loadACCFromMemory() {
            this.increasePC();

        }
        storeACCInMemory() {
            this.increasePC();
        }
        addWithCarry() {
            this.increasePC();
        }
        loadXRegWithConstant() {
            this.increasePC();
        }
        loadXRegFromMemory() {
            this.increasePC();
        }
        loadYRegWithConstant() {
            this.increasePC();
        }
        loadYRegFromMemory() {
            this.increasePC();
        }
        noOperation() {
            this.increasePC;
        }
        compareByteToXReg() {
            this.increasePC();
        }
        branchBytes() {
            this.increasePC();
        }
        incrementByteValue() {
            this.increasePC();
        }
        systemCall() {
            
        }
    }
}
