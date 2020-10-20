/* ------------
scheduler.ts


------------ */
var RobOS;
(function (RobOS) {
    class Scheduler {
        constructor(numCycles = 0, turnaroundTime = 0, waitTime = 0) {
            this.numCycles = numCycles;
            this.turnaroundTime = turnaroundTime;
            this.waitTime = waitTime;
            this.numCycles = numCycles;
            this.turnaroundTime = turnaroundTime;
            this.waitTime = waitTime;
        }
        setSchedulingAlgorithm(algorithm) {
            switch (algorithm) {
                case "Round Robin":
                    _SchedulingAlgorithm = "Round Robin";
                    _StdOut.putText("Scheduling Algorithm: Round Robin");
                    break;
                default:
                    _SchedulingAlgorithm = "Round Robin";
                    _StdOut.putText("Scheduling algorithm not found.");
                    _StdOut.advanceLine();
                    _StdOut.putText("Defaulting scheduling algorithm to Round Robin.");
                    break;
            }
        }
        setPointer(scheduling) {
            //Set which PCB to pointer is pointing at
            if (scheduling == "Round Robin") {
                if (_Pointer < 0) {
                    _Pointer = 0;
                }
                if (this.numCycles >= 6) {
                    _Pointer++;
                }
                if (_Pointer >= readyPCBQueue.length) {
                    _Pointer = 0;
                }
            }
        }
        switchPCB() {
            //Switch to next PCB after quanata is reached
            if (currentPCB.state == "Running") {
                currentPCB.state = "Ready";
            }
            currentPCB = readyPCBQueue[_Pointer];
            currentPCB.state = "Runnning";
            this.numCycles = 1;
        }
        roundRobin() {
            if (readyPCBQueue.length > 0) {
                var pointer;
                var params = [0];
                var interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, [0]);
                /*if(readyPCBQueue.length == 1 && currentPCB == null) { //Only one process and no Process running in currentPCB
                    params = [readyPCBQueue[0]];
                    interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                    _KernelInterruptQueue.enqueue(interrupt);
                } else if(readyPCBQueue.length >= 2) { //Two process and no Process running in currentPCB
                    if(currentPCB != null && !(currentPCB.quantaCycles < _Quantum)) { //Two process and a Process running in currentPCB
                        currentPCB.state = "Ready";
                    }
                    var next = true;
                    for(var i = 0; i < readyPCBQueue.length; i++) {
                        if(_Pointer < _Quantum) {
                            params = readyPCBQueue[i];
                            interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                            _KernelInterruptQueue.enqueue(interrupt);
                            next = true;
                            _Pointer++;
                            break;
                        }
                    }
                    if(!next) {
                        for(var i = 0; i < readyPCBQueue.length; i++) {
                            readyPCBQueue[i].quantaCycles = 0;
                        }
                        params = readyPCBQueue[0];
                        interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                        _KernelInterruptQueue.enqueue(interrupt);
                    }
                }*/
                if (readyPCBQueue.length == 1) {
                    _Pointer = 0;
                    if (currentPCB.PID != readyPCBQueue[_Pointer].PID) {
                        //Context Switch
                        _Kernel.krnTrace("Context Switch via Round Robin");
                        _KernelInterruptQueue.enqueue(interrupt);
                    }
                    else {
                        this.numCycles++;
                        //if number of cycles is larger than quantum
                        if (this.numCycles > _Quantum) {
                            this.numCycles = 1; //set quantum to 1
                        }
                    }
                }
                if (currentPCB.state == "Terminated" || this.numCycles >= _Quantum && readyPCBQueue.length > 0) {
                    if (currentPCB.state == "Terminated") { //If process has been terminates
                        _Pointer--; //reduce pointer number by 1
                    }
                    if (readyPCBQueue.length > 1) {
                        //Context Switch
                        _Kernel.krnTrace("Context Swtich via Round Robin.");
                        _KernelInterruptQueue.enqueue(interrupt);
                        return;
                    }
                }
                else {
                    if (readyPCBQueue.length == 0) { //if no processes left in ready queue
                        _CPU.isExecuting = false; //stop CPU
                        this.numCycles = 1;
                        _CPU.init();
                    }
                    else {
                        this.numCycles++;
                    }
                }
                _CPU.isExecuting = true;
            }
            else if (readyPCBQueue.length == 0) {
                _CPU.isExecuting = false;
                this.numCycles = 1;
                _CPU.init();
            }
            else {
                _CPU.isExecuting = false;
                this.numCycles++;
            }
        }
    }
    RobOS.Scheduler = Scheduler;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=scheduler.js.map