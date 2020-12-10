/* ------------
scheduler.ts


------------ */
var RobOS;
(function (RobOS) {
    class Scheduler {
        constructor(numCycles = 1, turnaroundTime = 0, waitTime = 0) {
            this.numCycles = numCycles;
            this.turnaroundTime = turnaroundTime;
            this.waitTime = waitTime;
            this.numCycles = numCycles;
            this.turnaroundTime = turnaroundTime;
            this.waitTime = waitTime;
        }
        schedule() {
            var params;
            var interrupt;
            if (_SchedulingAlgorithm == "ROUND ROBIN") {
                if (readyPCBQueue.length > 0) {
                    if (readyPCBQueue.length == 1 && currentPCB == null) {
                        params = readyPCBQueue[0];
                        interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                        _KernelInterruptQueue.enqueue(interrupt);
                    }
                    else if (readyPCBQueue.length >= 2 && currentPCB == null) {
                        this.findNextProcess();
                    }
                    else if (readyPCBQueue.length >= 2) {
                        if (!(currentPCB.numCycles < _Quantum)) {
                            currentPCB.state = "Waiting";
                            this.findNextProcess();
                        }
                    }
                    this.numCycles++;
                    _CPU.isExecuting = true;
                }
                else {
                    _CPU.isExecuting = false;
                }
            }
            else if (_SchedulingAlgorithm == "FIRST COME FIRST SERVE" || _SchedulingAlgorithm == "PRIORITY") {
                if (readyPCBQueue.length > 0) {
                    if (readyPCBQueue.length == 1 && currentPCB == null) {
                        params = readyPCBQueue[0];
                        interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                        _KernelInterruptQueue.enqueue(interrupt);
                    }
                    else if (readyPCBQueue.length >= 2 && currentPCB == null) {
                        this.findNextProcess();
                    }
                    _CPU.isExecuting = true;
                }
                else {
                    _CPU.isExecuting = false;
                }
            }
            else {
                _StdOut.putText("Uh oh. Something went wrong. Scheduling Algorithm not found.");
            }
        }
        findNextProcess() {
            var params;
            var interrupt;
            var tempPCB;
            var next = false;
            if (_SchedulingAlgorithm == "ROUND ROBIN") {
                for (var process = 0; process < readyPCBQueue.length; process++) {
                    if (this.numCycles < _Quantum) {
                        params = readyPCBQueue[process];
                        interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                        _KernelInterruptQueue.enqueue(interrupt);
                        next = true;
                        break;
                    }
                }
                if (!next) {
                    this.numCycles = 0;
                    params = readyPCBQueue[0];
                    interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, interrupt);
                    _KernelInterruptQueue.enqueue(interrupt);
                }
            }
            else if (_SchedulingAlgorithm == "FIRST COME FIRST SERVE") {
                tempPCB = readyPCBQueue[0];
                for (var process = 1; process < readyPCBQueue.length; process++) {
                    if (tempPCB.PID > readyPCBQueue[process].PID) {
                        tempPCB = readyPCBQueue[process];
                    }
                    params = [tempPCB];
                    interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                    _KernelInterruptQueue.enqueue(interrupt);
                }
            }
            else if (_SchedulingAlgorithm == "PRIORITY") {
                tempPCB = readyPCBQueue[0];
                for (var process = 1; process < readyPCBQueue.length; process++) {
                    if (tempPCB.priority > readyPCBQueue[process].priority) {
                        tempPCB = readyPCBQueue[process];
                    }
                    params = [tempPCB];
                    interrupt = new RobOS.Interrupt(CONTEXT_SWITCH, params);
                    _KernelInterruptQueue.enqueue(interrupt);
                }
            }
            else {
                _StdOut.putText("Uh oh. Something went wrong. Scheduling Algorithm not found.");
            }
        }
    }
    RobOS.Scheduler = Scheduler;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=scheduler.js.map