/* ------------
scheduler.ts


------------ */
module RobOS {

    export class Scheduler {

        constructor (public numCycles: number = 1,
                     public turnaroundTime: number = 0,
                     public waitTime: number = 0,
                     public Pointer: number = 0) {
            this.numCycles = numCycles;
            this.turnaroundTime = turnaroundTime;
            this.waitTime = waitTime;
            this.Pointer = Pointer;
        }
        schedule() {
            var params;
            var interrupt;
            if(_SchedulingAlgorithm == "ROUND ROBIN") {
                if(readyPCBQueue.length > 0) {
                    if(readyPCBQueue.length == 1 && currentPCB == null) {
                        params = readyPCBQueue[0];
                        interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                        _KernelInterruptQueue.enqueue(interrupt);
                    } else if(readyPCBQueue.length >= 2 && currentPCB == null) {
                        this.findNextProcess();
                    } else if(readyPCBQueue.length >= 2) {
                        if(!(currentPCB.numCycles < _Quantum)) {
                            currentPCB.state = "Ready";
                            this.findNextProcess();
                        }
                    }
                    this.numCycles++;
                    _CPU.isExecuting = true;
                } else {
                    _CPU.isExecuting = false;
                }
            } else if(_SchedulingAlgorithm == "FIRST COME FIRST SERVE") {
                if(readyPCBQueue.length > 0) {
                    if(readyPCBQueue.length == 1 && currentPCB == null) {
                        params = readyPCBQueue[0];
                        interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                        _KernelInterruptQueue.enqueue(interrupt);
                    } else if(readyPCBQueue.length >= 2 && currentPCB == null) {
                        this.findNextProcess();
                    } else if(readyPCBQueue.length >= 2) {
                        if(!(currentPCB.numCycles < _Quantum)) {
                            currentPCB.state = "Ready";
                            this.findNextProcess();
                        }
                    }
                    this.numCycles++;
                    _CPU.isExecuting = true;
                } else {
                    _CPU.isExecuting = false;
                }
            }else if(_SchedulingAlgorithm == "PRIORITY") {
                if(readyPCBQueue.length > 0) {
                    if(readyPCBQueue.length == 1 && currentPCB == null) {
                        params = readyPCBQueue[0];
                        interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                        _KernelInterruptQueue.enqueue(interrupt);
                    } else if(readyPCBQueue.length >= 2 && currentPCB == null) {
                        this.findNextProcess();
                    }
                    _CPU.isExecuting = true;
                } else {
                    _CPU.isExecuting = false;
                }
            } else {
                _StdOut.putText("Uh oh. Something went wrong. Scheduling Algorithm not found.");
            }
        }
        findNextProcess() {
            var params;
            var interrupt;
            var tempPCB;

            var next = false;
            if(_SchedulingAlgorithm == "ROUND ROBIN") {
                for(var process = 0; process < readyPCBQueue.length; process++) {
                    if(readyPCBQueue[process].numCycles < _Quantum) {
                        params = readyPCBQueue[process];
                        //CONTEXT SWITCH//
                        interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                        _KernelInterruptQueue.enqueue(interrupt);
                        next = true;
                        break;
                    }
                }
                if(!next) {
                    this.numCycles = 0;
                    for(var process = 0; process < readyPCBQueue.length; process++) {
                        readyPCBQueue[process].numCycles = 0;
                    }
                    //CONTEXT SWITCH//
                    params = readyPCBQueue[this.Pointer];
                    interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, interrupt);
                    _KernelInterruptQueue.enqueue(interrupt);
                }
            } else if(_SchedulingAlgorithm == "FIRST COME FIRST SERVE") {
                for(var process = 0; process < readyPCBQueue.length; process++) {
                    if(readyPCBQueue[process].numCycles < _Quantum) {
                        params = readyPCBQueue[process];
                        //CONTEXT SWITCH//
                        interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                        _KernelInterruptQueue.enqueue(interrupt);
                        next = true;
                        break;
                    }
                }
                if(!next) {
                    for(var process = 0; process < readyPCBQueue.length; process++) {
                        readyPCBQueue[process].numCycles = 0;
                    }
                    //CONTEXT SWITCH//
                    params = readyPCBQueue[this.Pointer];
                    interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, interrupt);
                    _KernelInterruptQueue.enqueue(interrupt);
                }
            } else if(_SchedulingAlgorithm == "PRIORITY") {
                tempPCB = readyPCBQueue[0];
                for(var process = 1; process < readyPCBQueue.length; process++) {
                    if(tempPCB.priority > readyPCBQueue[process].priority) {
                        tempPCB = readyPCBQueue[process];
                    }
                    //CONTEXT SWITCH//
                    params = [tempPCB];
                    interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                    _KernelInterruptQueue.enqueue(interrupt);
                }
            } else {
                _StdOut.putText("Uh oh. Something went wrong. Scheduling Algorithm not found.");
            }
        }
    }
}