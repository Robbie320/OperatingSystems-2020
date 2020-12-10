/* ------------
MemoryManager.ts


------------ */
module RobOS {

    export class MemoryManager {
        construtor() {}

        loadMemory(UPIArray, section, PID) {
            if(section == "disk") {
                _krnFSDD.createSwapFile(PID, UPIArray);
            } else {
                for(var i = 0; i < UPIArray.length; i++) {
                    _Memory.memoryArr[_Memory.getSectMin(section) + i] = UPIArray[i];
                }
            }
            //UPDATE TABLES
            RobOS.Control.updateAllTables();
        }
        setPriority(Priority) {
            if(Priority != null) {
                if(!isNaN(Number(Priority))){
                    _StdOut.putText("Priority set to: " + Priority); _StdOut.advanceLine();
                    return Priority;
                }else {
                    _StdOut.putText("ERROR INVALID PRIORITY: Please enter a number to set the priority."); _StdOut.advanceLine();
                    _StdOut.putText("Priority set to: 10 (Default)."); _StdOut.advanceLine();
                    Priority = _DefaultPriority;
                    return Priority;
                }
            } else {
                _StdOut.putText("Priority set to: 10 (Default)."); _StdOut.advanceLine();
                Priority = _DefaultPriority;
                return Priority;
            }
        }
        checkMemoryAvailability() {
            var availability;

            //check section 1
            for(var i = _Memory.getSectMin("1"); i < _Memory.getSectMax("1"); i++) {
                if(_Memory.memoryArr[i] != "00") {
                    _Memory.sectOneAvailable = false;
                    break;
                } else {
                    _Memory.sectOneAvailable = true;
                }
            }
            //check section 2
            for(var i = _Memory.getSectMin("2"); i < _Memory.getSectMax("2"); i++) {
                if(_Memory.memoryArr[i] != "00") {
                    _Memory.sectTwoAvailable = false;
                    break;
                } else {
                    _Memory.sectTwoAvailable = true;
                }
            }
            //check section 3
            for(var i = _Memory.getSectMin("3"); i < _Memory.getSectMax("3"); i++) {
                if(_Memory.memoryArr[i] != "00") {
                    _Memory.sectThreeAvailable = false;
                    break;
                } else {
                    _Memory.sectThreeAvailable = true;
                }
            }
            //If all memory sections unavailable, availabilty is false
            if(_Memory.sectOneAvailable == false && _Memory.sectTwoAvailable == false && _Memory.sectThreeAvailable == false) {
                availability = false;
            }
            else {
                availability = true;
            }
            return availability;
        }
        assignMemory() {
            //check section availability
            if (_Memory.sectOneAvailable) {
                var sectionOneAvailable = false;
                return "1";
            }
            else if (_Memory.sectTwoAvailable) {
                var sectionTwoAvailable = false;
                return "2";
            }
            else if (_Memory.sectThreeAvailable) {
                var sectionThreeAvailable = false;
                return "3";
            }
        }
        clearMem(section) {
            var min = _Memory.getSectMin(section);
            var max = _Memory.getSectMax(section);
            for (var i = min; i <= max; i++) {
                _Memory.memoryArr[i] = "00";
            }
            RobOS.Control.updateAllTables();
        }
        getPCB(enteredPID) {
            var PCB;
            for(PCB of PCBList) {
                if(PCB.PID == enteredPID) {
                    return PCB;
                }
            }
        }
        getIndex(PCBList, enteredPID) {
            var index;
            for(index = 0; index < PCBList.length; index++){
                if(PCBList[index].PID == enteredPID) {
                    return index;
                }
            }
        }
        checkPCBisResident(enteredPID) {
            var PCB;
            for(PCB of residentPCB) {
                if (PCB.PID == enteredPID) {
                    return true;
                }
            }
        }
        checkPCBinReadyQueue(enteredPID) {
            var PCB;
            for(PCB of readyPCBQueue) {
                if(PCB.PID == enteredPID) {
                    return true;
                }
            }
        }
        sectAvailable(section) {
            if(section == "0") {
                _Memory.sectOneAvailable = true;
            } else if(section == "1") {
                _Memory.sectTwoAvailable = true;
            } else if(section == "2") {
                _Memory.sectThreeAvailable = true;
            }
        }
        sectUnavailable(section) {
            if(section == "0") {
                _Memory.sectOneAvailable = false;
            } else if(section == "1") {
                _Memory.sectTwoAvailable = false;
            } else if(section == "2") {
                _Memory.sectThreeAvailable = false;
            }
        }
        checkProcessOnDisk() {
            for(var d = 0; d < PCBList.length; d++) {
                if(PCBList[d].location == "Disk") {
                    return true;
                }
            }
            return false;
        }
        checkProcessInMemory() {
            for(var m = 0; m < PCBList.length; m++) {
                if(PCBList[m].location == "Memory") {
                    return PCBList[m];
                }
            }
            return false;
        }
        rollIn(PID) {
            var dataArr = [];
            var PCB = this.getPCB(PID);
            var PCBsInMemory = [];
            PCBsInMemory[PCBsInMemory.length] = this.checkProcessInMemory();
            if(PCBsInMemory.length >= 3) {
                this.rollOut;
            }
            dataArr = _krnFSDD.getRollInData(PID);
            PCB.section = this.assignMemory();
            PCB.location = "Memory";
            this.loadMemory(dataArr, PCB.section, PID);
        }
        rollOut() {
            var PCB = _krnFSDD.rollOutPCB();
            var dataArr = [];
            for(var i = _Memory.getSectMin(PCB.section); i < _Memory.getSectMax(PCB.section); i++) {
                dataArr[dataArr.length] = _Memory.memoryArr[i];
            }
            _krnFSDD.createSwapFile(PCB.PID, dataArr);
            //Clear memory
            this.clearMem(PCB.section);
            //Change to disk
            PCBList[this.getIndex(PCBList, PCB.PID)].location = "Disk";
            PCBList[this.getIndex(PCBList, PCB.PID)].section = "disk";
        }
        loadDisk() {
            if(this.checkProcessOnDisk) {
                var PCB;
                for(var process; process < PCBList.length; process++) {
                    if(PCBList[process].location == "Disk") {
                        PCB = PCBList[process];
                    }
                }
                this.rollIn(PCB.PID);
            }
        }
    }
}