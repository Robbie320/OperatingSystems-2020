/* ------------
scheduler.ts


------------ */
module RobOS {

    export class Scheduler {

        constructor (public numCycles: number = 1,
                     public turnaroundTime: number = 0,
                     public waitTime: number = 0) {
            this.numCycles = numCycles;
            this.turnaroundTime = turnaroundTime;
            this.waitTime = waitTime;
        }
        schedule() {
            if(_SchedulingAlgorithm == "ROUND ROBIN") {
                this.roundRobin();
            } else if(_SchedulingAlgorithm == "FIRST COME FIRST SERVE") {
                this.firstComeFirstServe();
            } else if(_SchedulingAlgorithm == "PRIORITY") {
                this.priority();
            } else {
                this.roundRobin();
            }
        }
        roundRobin() {
            //if(readyPCBQueue.length > 0) {
                var params;
                var interrupt;
                params = [0];
                interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                //if there is only one process left
                if(readyPCBQueue.length == 1) {
                    _Pointer = 0;
                    if(currentPCB.PID != readyPCBQueue[_Pointer].PID) {
                        _Kernel.krnTrace("Context Switch | Round Robin (Only one process left)");
                        _KernelInterruptQueue.enqueue(interrupt);
                    } else {
                        this.numCycles++;
                        if(this.numCycles >= _Quantum) {
                            this.numCycles = 1;
                        }
                    }
                    return;
                }
                //if a process is terminated or if the quantum number is reached, then switch processes
                if((currentPCB.state == "Terminated" || this.numCycles >= _Quantum) && readyPCBQueue.length > 0) {
                    if(currentPCB.state == "Terminated") {
                        _Pointer++; //Reduce pointer by one if the process is terminated or if quanta cycles is met
                    }
                    if(readyPCBQueue.length > 1) {
                        _Kernel.krnTrace("Context Switch | Round Robin");
                    }
                    //Context Switch
                    _KernelInterruptQueue.enqueue(interrupt);
                    return;
                } else {
                    //If there are no more processes left
                    if(readyPCBQueue.length == 0) {
                        _CPU.isExecuting = false;
                        this.numCycles = 1;
                        _CPU.init();
                    } else { //processes is still running so increment number of cycles
                        //_CPU.isExecuting = true;
                        this.numCycles++;
                    }
                }
            //}
        }
        firstComeFirstServe() {
            //if(readyPCBQueue.length > 0) {
                var params;
                var interrupt;
                params = [0];
                interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                //if there is only one process left
                if(readyPCBQueue.length == 1) {
                    _Pointer = 0;
                    if(currentPCB.PID != readyPCBQueue[_Pointer].PID) {
                        _Kernel.krnTrace("Context Switch | First Come First Serve (Only one process left)");
                        //_KernelInterruptQueue.enqueue(interrupt);
                    } 
                    return;
                }
                //if a process is terminated or if the quantum number is reached, then switch processes
                if((currentPCB.state == "Terminated" ) && readyPCBQueue.length > 0) {
                    if(currentPCB.state == "Terminated") {
                        _Pointer--; //Reduce pointer by one if the process is terminated or if quanta cycles is met
                    }
                    if(readyPCBQueue.length > 1) {
                        _Kernel.krnTrace("Context Switch | First Come First Serve");
                    }
                    //Context Switch
                    _KernelInterruptQueue.enqueue(interrupt);
                    return;
                } else {
                    //If there are no more processes left
                    if(readyPCBQueue.length == 0) {
                        _CPU.isExecuting = false;
                        this.numCycles = 1;
                        _CPU.init();
                    } else { //processes is still running so increment number of cycles
                        //_CPU.isExecuting = true;
                        this.numCycles++;
                    }
                }
            //}
        }
        priority() {

        }
        setPointer(scheduling) {
            //Set which PCB to pointer is pointing at
            if(scheduling == "ROUND ROBIN") {
                if(_Pointer < 0) {
                    _Pointer = 0;
                }
                if(this.numCycles >= _Quantum) {
                    _Pointer++;
                }
                if(_Pointer >= readyPCBQueue.length) {
                    _Pointer = 0;
                }
            } else if(scheduling == "FIRST COME FIRST SERVE") {
                
            } else if(scheduling == "PRIORITY") {

            } else {
                _CPU.isExecuting = false;
                return;
            }
        }
        switchPCB() {
            //Switch to next PCB after quanta is reached
            //SNAPSHOT//
            currentPCB.PC = _CPU.PC;
            currentPCB.ACC = _CPU.ACC;
            currentPCB.Xreg = _CPU.Xreg;
            currentPCB.Yreg = _CPU.Yreg;
            currentPCB.Zflag = _CPU.Zflag;

            if(currentPCB.state == "Running") {
                currentPCB.state = "Ready";
            }
            RobOS.Control.proccessesTbUpdate();
            currentPCB = readyPCBQueue[_Pointer];

            //CPU = CURRENTPCB//
            _CPU.PC = currentPCB.PC;
            _CPU.ACC = currentPCB.ACC;
            _CPU.Xreg = currentPCB.Xreg;
            _CPU.Yreg = currentPCB.Yreg;
            _CPU.Zflag = currentPCB.Zflag;
            
            currentPCB.state = "Runnning";
            RobOS.Control.proccessesTbUpdate();
            //reset number of cycles when switching PCBs
            this.numCycles = 1;
        }
    }
}