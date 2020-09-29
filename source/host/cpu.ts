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
                    public section: string = "",
                    public isExecuting: boolean = false) {
            this.PC = PC;
            this.IR = IR;
            this.ACC = ACC;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.section = section;
            this.isExecuting = isExecuting;
        }
        
        public init(): void {
            this.PC = 0;
            this.IR = "0";
            this.ACC = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.section = "";
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //LDA and STA 6502a op codes
            
            currentPCB.state = "Running"
            //Fetch Instructions//
            //update CPU with PCB values
            this.PC = currentPCB.PC;
            this.IR = currentPCB.IR;
            this.ACC = currentPCB.ACC;
            this.Xreg = currentPCB.Xreg;
            this.Yreg = currentPCB.Yreg;
            this.section = currentPCB.section
            this.Zflag = currentPCB.Zflag;
            
            //Update GUI from control.ts
            RobOS.Control.updateAllTables();

            //Decode and Execute Instructions//
            switch(currentPCB.IR) {
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
                    //isCompleted = true;
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
                    _Kernel.krnTrapError("Instruction Not Valid:" + currentPCB.IR);
                    //terminate
                    this.isExecuting = false;
            }
            //Increment Program Counter
            this.PC++;
            this.IR = _MemoryAccessor.readMemoryHex(currentPCB.section, this.PC);
            //update Instruction Register
            //this.IR = memoryAccessor
            currentPCB.PC = this.PC;
            currentPCB.IR = this.IR;
            currentPCB.ACC = this.ACC;
            currentPCB.Xreg = this.Xreg;
            currentPCB.Yreg = this.Yreg;
            currentPCB.Zflag = this.Zflag;
            
            //update tables (GUI) again
            RobOS.Control.updateAllTables();
            //Break out of process
        }
        //OP CODE FUNCTIONS//
        increasePC() {
            this.PC++;
        }
        loadACCWithConstant() {
            this.increasePC();
            this.ACC = _MemoryAccessor.readOneByteDecimal(currentPCB.section, this.PC);
        }
        loadACCFromMemory() {
            this.increasePC();
            if(currentPCB.section == 1) {
                this.ACC = parseInt(_Memory.sectOneArr[_MemoryAccessor.readTwoBytesDecimal(1, this.PC)], 16);
            } else if(currentPCB.section == 2) {
                this.ACC = parseInt(_Memory.sectTwoArr[_MemoryAccessor.readTwoBytesDecimal(2, this.PC)], 16);
            } else if(currentPCB.section == 3) {
                this.ACC = parseInt(_Memory.sectThreeArr[_MemoryAccessor.readTwoBytesDecimal(1, this.PC)], 16);
            }
            //increase bc reading two bytes
            this.increasePC();
        }
        storeACCInMemory() {
            this.increasePC();
            if(currentPCB.section == 1) {
                _Memory.sectOneArr[_MemoryAccessor.readTwoBytesDecimal(1, this.PC)] = this.ACC.toString(16);
            } else if(currentPCB.section == 2) {
                _Memory.sectTwoArr[_MemoryAccessor.readTwoBytesDecimal(2, this.PC)] = this.ACC.toString(16);
            } else if(currentPCB.section == 3) {
                _Memory.sectThreeArr[_MemoryAccessor.readTwoBytesDecimal(1, this.PC)] = this.ACC.toString(16);
            }
            //increase bc reading two bytes
            this.increasePC();
        }
        addWithCarry() {
            this.increasePC();
            if(currentPCB.section == 1) {
                this.ACC += parseInt(_Memory.sectOneArr[_MemoryAccessor.readTwoBytesDecimal(1, this.PC)], 16);
            } else if(currentPCB.section == 2) {
                this.ACC += parseInt(_Memory.sectTwoArr[_MemoryAccessor.readTwoBytesDecimal(2, this.PC)], 16);
            } else if(currentPCB.section == 3) {
                this.ACC += parseInt(_Memory.sectThreeArr[_MemoryAccessor.readTwoBytesDecimal(1, this.PC)], 16);
            }
            //increase bc reading two bytes
            this.increasePC();
        }
        loadXRegWithConstant() {
            this.increasePC();
            if(currentPCB.section == 1) {
                this.Xreg = _MemoryAccessor.readOneByteDecimal(1, this.PC);
            } else if(currentPCB.section == 2) {
                this.Xreg = _MemoryAccessor.readOneByteDecimal(2, this.PC);
            } else if(currentPCB.section == 3) {
                this.Xreg = _MemoryAccessor.readOneByteDecimal(3, this.PC);
            }
        }
        loadXRegFromMemory() {
            this.increasePC();
            if(currentPCB.section == 1) {
                this.Xreg = _MemoryAccessor.readTwoBytesDecimal(1, this.PC);
            } else if(currentPCB.section == 2) {
                this.Xreg = _MemoryAccessor.readTwoBytesDecimal(2, this.PC);
            } else if(currentPCB.section == 3) {
                this.Xreg = _MemoryAccessor.readTwoBytesDecimal(3, this.PC);
            }
            this.increasePC();
        }
        loadYRegWithConstant() {
            this.increasePC();
            if(currentPCB.section == 1) {
                this.Yreg = _MemoryAccessor.readOneByteDecimal(1, this.PC);
            } else if(currentPCB.section == 2) {
                this.Yreg = _MemoryAccessor.readOneByteDecimal(2, this.PC);
            } else if(currentPCB.section == 3) {
                this.Yreg = _MemoryAccessor.readOneByteDecimal(3, this.PC);
            }
        }
        loadYRegFromMemory() {
            this.increasePC();
            if(currentPCB.section == 1) {
                this.Yreg = _MemoryAccessor.readTwoBytesDecimal(1, this.PC);
            } else if(currentPCB.section == 2) {
                this.Yreg = _MemoryAccessor.readTwoBytesDecimal(2, this.PC);
            } else if(currentPCB.section == 3) {
                this.Yreg = _MemoryAccessor.readTwoBytesDecimal(3, this.PC);
            }
            this.increasePC();
        }
        noOperation() {
            this.increasePC;
        }
        compareByteToXReg() {
            this.increasePC();
            var memoryByte;
            if(currentPCB.section == 1) {
                memoryByte = parseInt(_Memory.sectOneArr[_MemoryAccessor.readTwoBytesDecimal(1, this.PC)], 16);
            } else if(currentPCB.section == 2) {
                memoryByte = parseInt(_Memory.sectTwoArr[_MemoryAccessor.readTwoBytesDecimal(2, this.PC)], 16);
            } else if(currentPCB.section == 3) {
                memoryByte = parseInt(_Memory.sectThreeArr[_MemoryAccessor.readTwoBytesDecimal(3, this.PC)], 16);
            }
            this.increasePC();
        }
        branchBytes() {
            this.increasePC();
            var bytes;
            if(this.Zflag == 0) {
                if(currentPCB.section == 1) {
                    bytes = _MemoryAccessor.readTwoBytesDecimal(1, this.PC);
                } else if(currentPCB.section == 2) {
                    bytes = _MemoryAccessor.readTwoBytesDecimal(2, this.PC);
                } else if(currentPCB.section == 3) {
                    bytes = _MemoryAccessor.readTwoBytesDecimal(3, this.PC);
                }
                if((bytes + this.PC) > 256) {
                    this.PC = (this.PC + bytes) % 256;
                } else {
                    this.PC += bytes;
                }
            }
        }
        incrementByteValue() {
            this.increasePC();
            if(currentPCB.section == 1) {
                //Parse to int and increment
                _Memory.sectOneArr[_MemoryAccessor.readTwoBytesDecimal(1, this.PC)] = parseInt(_Memory.sectOneArr[_MemoryAccessor.readTwoBytesDecimal(1, this.PC)], 16) + 1;
                //change incremented hex to string hex
                _Memory.sectOneArr[_MemoryAccessor.readTwoBytesDecimal(1, this.PC)] = _Memory.sectOneArr[_MemoryAccessor.readTwoBytesDecimal(1, this.PC)].toString(16);
            } else if(currentPCB.section == 2) {
                _Memory.sectTwoArr[_MemoryAccessor.readTwoBytesDecimal(2, this.PC)] = parseInt(_Memory.sectTwoArr[_MemoryAccessor.readTwoBytesDecimal(2, this.PC)], 16) + 1;
                _Memory.sectTwoArr[_MemoryAccessor.readTwoBytesDecimal(2, this.PC)] = _Memory.sectTwoArr[_MemoryAccessor.readTwoBytesDecimal(2, this.PC)].toString(16);
            } else if(currentPCB.section == 3) {
                _Memory.sectThreeArr[_MemoryAccessor.readTwoBytesDecimal(3, this.PC)] = parseInt(_Memory.sectThreeArr[_MemoryAccessor.readTwoBytesDecimal(3, this.PC)], 16) + 1;
                _Memory.sectThreeArr[_MemoryAccessor.readTwoBytesDecimal(3, this.PC)] = _Memory.sectThreeArr[_MemoryAccessor.readTwoBytesDecimal(3, this.PC)].toString(16);
            }
            this.increasePC();
        }
        systemCall() {
            var paramaters = [];
            if(this.Xreg == 1) {
                //Print Yreg
                paramaters[0] = this.Yreg.toString();
                _KernelInterruptQueue.enqueue(new RobOS.Interrupt(2, paramaters)); // 2 = system call irq
            }else if(this.Xreg == 2) {
                //print string
                var loc = this.Yreg; //location
                var output = "";
                var byteStr;
                //var size = _Memory.sectOneArr.length + _Memory.sectTwoArr.length + _Memory.sectThreeArr.length;
                
                for(var i = 0; i + loc < 256; i++) {
                    if(currentPCB.section == 1) {
                        byteStr = _Memory.sectOneArr[loc + i];
                    } else if(currentPCB.section == 2){
                        byteStr = _Memory.sectTwoArr[loc + i];
                    } else if(currentPCB.section == 3){
                        byteStr = _Memory.sectThreeArr[loc + i];
                    }
                    if(byteStr == "00") {
                        break;
                    } else {
                        output += String.fromCharCode(parseInt(byteStr, 16));
                    }
                    paramaters[0] = output;
                    _KernelInterruptQueue.enqueue(new RobOS.Interrupt(2, paramaters)); // 2 = system call irq
                }
            }
            else {
            }
        }
    }
}
