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
            }
        }
        setSchedulingAlgorithm(algorithm) {
            switch(algorithm) {
                case "ROUND ROBIN":
                    _SchedulingAlgorithm = "ROUND ROBIN";
                    _StdOut.putText("Scheduling Algorithm: Round Robin");
                    this.roundRobin();
                    break;
                default:
                    _SchedulingAlgorithm = "ROUND ROBIN";
                    _StdOut.putText("Scheduling algorithm not found.");
                    _StdOut.advanceLine();
                    _StdOut.putText("Defaulting scheduling algorithm to Round Robin.");
                    break;
            }
        }
        roundRobin() {
            //if(readyPCBQueue.length > 0) {
                var params;
                var interrupt;
                params = [0];
                interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                if(readyPCBQueue.length == 1) {
                    _Pointer = 0;
                    if(currentPCB.PID != readyPCBQueue[_Pointer].PID) {
                        _Kernel.krnTrace("Context Switch | Round Robin");
                        //this.setPointer(_SchedulingAlgorithm);
                        //this.switchPCB();
                        _KernelInterruptQueue.enqueue(interrupt);
                    } else {
                        this.numCycles++;
                        if(this.numCycles > _Quantum) {
                            this.numCycles = 1;
                        }
                    }
                    return;
                }
                if((currentPCB.state == "Terminated" || this.numCycles >= _Quantum) && readyPCBQueue.length > 0) {
                    if(currentPCB.state == "Terminated") {
                        _Pointer--; //Reduce pointer by one if the process is terminated or if quanta cycles is met
                    }
                    if(readyPCBQueue.length > 1) {
                        _Kernel.krnTrace("Context Switch | Round Robin");
                    }
                    //this.setPointer(_SchedulingAlgorithm);
                    //this.switchPCB();
                    _KernelInterruptQueue.enqueue(interrupt);
                    return;
                } else {
                    if(readyPCBQueue.length == 0) {
                        _CPU.isExecuting = false;
                        this.numCycles = 1;
                        _CPU.init();
                    } else {
                        //_CPU.isExecuting = true;
                        this.numCycles++;
                    }
                }
            //}
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
            //REINSTATE//
            _CPU.PC = currentPCB.PC;
            _CPU.ACC = currentPCB.ACC;
            _CPU.Xreg = currentPCB.Xreg;
            _CPU.Yreg = currentPCB.Yreg;
            _CPU.Zflag = currentPCB.Zflag;
            
            currentPCB.state = "Runnning";
            RobOS.Control.proccessesTbUpdate();
            this.numCycles = 1;
        }
    }
}