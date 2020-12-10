/* ------------
    File System Device Driver.ts
    AKA the fsDD of DeviceDriverDisk
    The Kernel Disk Device Driver.
------------ */
var RobOS;
(function (RobOS) {
    // Extends DeviceDriver
    class FileSystemDeviceDriver extends RobOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnDiskDriverEntry);
            // So instead...
            super();
            this.driverEntry = this.krnDiskDriverEntry;
        }
        krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        formatDisk() {
            //create empty block array
            var emptyBlockArr = this.createEmptyBlockArr(emptyBlockArr);
            //Track, Sector, Block for loops to set up using the HTML5 Session Storage
            for (var t = 0; t < _Disk.tracks; t++) { //tracks loop
                for (var s = 0; s < _Disk.sectors; s++) { //sectors loop
                    for (var b = 0; b < _Disk.blocks; b++) { //blocks loop
                        sessionStorage.setItem(t + ":" + s + ":" + b, emptyBlockArr.join());
                    }
                }
            }
            //update Disk table
            RobOS.Control.diskTbUpdate();
        }
        getFilename(dataArr) {
            var filename = "";
            for (var f = 4; f < dataArr.length; f++) {
                if (dataArr[f] == "00") {
                    return filename;
                }
                else {
                    filename += String.fromCharCode(parseInt(dataArr[f], 16));
                }
            }
            return filename;
        }
        findFile(filename) {
            var dataArr;
            var dataName;
            for (var s = 0; s < _Disk.sectors; s++) {
                for (var b = 0; b < _Disk.blocks; b++) {
                    dataArr = sessionStorage.getItem("0:" + s + ":" + b).split(",");
                    dataName = this.getFilename(dataArr);
                    if (dataName == filename) {
                        return "0:" + s + ":" + b;
                    }
                }
            }
            return null;
        }
        getFirstAvailableTSBData() {
            var dataArr;
            for (var t = 1; t < _Disk.tracks; t++) { //Avoid Master Boot Record (MBR)
                for (var s = 0; s < _Disk.sectors; s++) {
                    for (var b = 0; b < _Disk.blocks; b++) {
                        dataArr = sessionStorage.getItem(t + ":" + s + ":" + b).split(",");
                        if (dataArr[0] == "0") {
                            return t + ":" + s + ":" + b;
                        }
                    }
                }
            }
        }
        getFirstAvailableTSBName() {
            var dataArr;
            for (var s = 0; s < _Disk.sectors; s++) {
                for (var b = 1; b < _Disk.blocks; b++) { //Avoid Master Boot Record (MBR)
                    dataArr = sessionStorage.getItem("0:" + s + ":" + b).split(",");
                    if (dataArr[0] == "0") {
                        return "0:" + s + ":" + b;
                    }
                }
            }
        }
        createFile(filename) {
            var data = this.getFirstAvailableTSBData();
            var dataArr = sessionStorage.getItem(data).split(",");
            var name = this.getFirstAvailableTSBName();
            var nameArr = sessionStorage.getItem(name).split(",");
            //Assign the "used" bit, 1
            dataArr[0] = "1";
            nameArr[0] = "1";
            var d = 0;
            for (var k = 1; k < 4; k++) {
                dataArr[k] = "FF"; // FF:FF:FF
                nameArr[k] = data[d]; // Data = next TSB in name
                d += 2;
            }
            for (var e = 0; e < filename.length; e++) {
                nameArr[e + 4] = (filename.charCodeAt(e)).toString(16);
            }
            //save array back to session log
            sessionStorage.setItem(name, nameArr.join());
            sessionStorage.setItem(data, dataArr.join());
            RobOS.Control.diskTbUpdate();
        }
        createSwapFile(PID, UPIArray) {
            if (this.findFile("~SwapFile " + PID) == null) {
                for (var d = UPIArray.length; d < 256; d++) {
                    UPIArray[UPIArray.length] = "00"; // Fill up extra file space with 00s
                }
                this.writeFile(this.findFile("~SwapFile " + PID), UPIArray.join(), "swap");
            }
            else {
                console.log("ERROR: SWAP FILE ALREADY EXISTS.");
            }
        }
        createEmptyBlockArr(emptyBlockArr) {
            emptyBlockArr = new Array(64);
            for (var b = 0; b < emptyBlockArr.length; b++) {
                if (b < 4) {
                    emptyBlockArr[b] = "0";
                }
                else {
                    emptyBlockArr[b] = "00";
                }
            }
            return emptyBlockArr;
        }
        readFile(filename) {
            var nameArr = [];
            var dataArr = [];
            var data = "";
            nameArr = sessionStorage.getItem(filename).split(",");
            dataArr = sessionStorage.getItem(nameArr[1] + ":" + nameArr[2] + ":" + nameArr[3]).split(",");
            //READ DATA
            var tempDataArr = dataArr;
            var loop = true;
            while (loop) {
                for (var f = 4; f < dataArr.length; f++) {
                    if (data[f] == "00") {
                        return data;
                    }
                    else {
                        data += String.fromCharCode(parseInt(dataArr[f], 16));
                    }
                }
                var nextBlock = dataArr[1] + ":" + dataArr[2] + ":" + dataArr[3];
                if (nextBlock == "FF:FF:FF") {
                    loop = false;
                    return data;
                }
                else {
                    loop = true;
                    tempDataArr = sessionStorage.getItem(nextBlock).split(",");
                }
            }
            return data;
        }
        readSwapFile(filename) {
            var swapDataArr = [];
            //Get TSB data
            var filenameArr = sessionStorage.getItem(filename).split(",");
            var data = filenameArr[1] + ":" + filenameArr[2] + ":" + filenameArr[3];
            var dataArr = sessionStorage.getItem(data).split(",");
            //add data to array
            for (var i = 4; i < dataArr.length; i++) {
                swapDataArr[swapDataArr.length] = dataArr[i];
            }
            var nextBlock = dataArr[1] + ":" + dataArr[2] + ":" + dataArr[3];
            //if data continues to new block
            if (nextBlock != "FF:FF:FF") {
                swapDataArr = swapDataArr.concat(this.readSwapFile(data));
                return swapDataArr;
            }
            else {
                return swapDataArr;
            }
        }
        writeFile(filename, data, swap) {
            //First get rid of delete current block of data
            var tempfilename = filename;
            var loop = true;
            while (loop) {
                var nameArrBlock = sessionStorage.getItem(tempfilename).split(",");
                var dataBlock = nameArrBlock[1] + ":" + nameArrBlock[2] + ":" + nameArrBlock[3];
                var dataArrBlock = sessionStorage.getItem(dataBlock).split(",");
                var nextBlock = dataArrBlock[1] + ":" + dataArrBlock[2] + ":" + dataArrBlock[3];
                if (nextBlock != "FF:FF:FF") {
                    tempfilename = dataBlock;
                }
                else {
                    loop = false;
                }
            }
            var emptyBlockArr = this.createEmptyBlockArr(emptyBlockArr);
            sessionStorage.setItem(dataBlock, emptyBlockArr.join());
            //WRITE
            nameArrBlock = sessionStorage.getItem(filename).split(",");
            dataBlock = nameArrBlock[1] + ":" + nameArrBlock[2] + ":" + nameArrBlock[3];
            //Change bit to in use
            emptyBlockArr[0] = "1";
            sessionStorage.setItem(dataBlock, emptyBlockArr.join());
            if (swap == "swap") {
                this.writeDataBlock(data.split(","), dataBlock);
            }
            else {
                var dataArr = [];
                for (var j = 0; j < data.length; j++) {
                    dataArr[dataArr.length] = (data.charCodeAt(j)).toString(16);
                }
                this.writeDataBlock(dataArr, dataBlock);
            }
            RobOS.Control.diskTbUpdate();
        }
        writeDataBlock(dataArr, dataBlock) {
            if (dataArr.length > 60) {
                var nextBlock = this.getFirstAvailableTSBData();
                var emptyBlockArr = this.createEmptyBlockArr(emptyBlockArr);
                //Change bit to in use
                emptyBlockArr[0] = "1";
                sessionStorage.setItem(nextBlock, emptyBlockArr.join());
                var newDataArr = dataArr.splice(0, 60);
                this.writeDataBlock(dataArr, nextBlock);
                var dataArrBlock = ["1", nextBlock[0], nextBlock[2], nextBlock[4]];
                for (var p = 0; p < 60; p++) {
                    dataArrBlock[dataArrBlock.length] = newDataArr[p];
                }
                sessionStorage.setItem(dataBlock, dataArrBlock.join());
            }
            else {
                for (var t = dataArr.length; t < 60; t++) {
                    dataArr[dataArr.length] = "00";
                }
                var lastBlockArr = ["1", "FF", "FF", "FF"];
                sessionStorage.setItem(dataBlock, lastBlockArr.concat(dataArr).join());
            }
        }
        deleteFile(filename) {
            //Delete Block Data
            var tempfilename = filename;
            var loop = true;
            while (loop) {
                var nameArrBlock = sessionStorage.getItem(tempfilename).split(",");
                var dataBlock = nameArrBlock[1] + ":" + nameArrBlock[2] + ":" + nameArrBlock[3];
                var dataArrBlock = sessionStorage.getItem(dataBlock).split(",");
                var nextBlock = dataArrBlock[1] + ":" + dataArrBlock[2] + ":" + dataArrBlock[3];
                if (nextBlock != "FF:FF:FF") {
                    tempfilename = dataBlock;
                }
                else {
                    loop = false;
                }
            }
            var emptyBlockArr = this.createEmptyBlockArr(emptyBlockArr);
            sessionStorage.setItem(dataBlock, emptyBlockArr.join());
            //Delete Name Block
            sessionStorage.setItem(filename, emptyBlockArr.join());
            RobOS.Control.diskTbUpdate();
        }
        deleteSwapFiles() {
            var tempBlockArr;
            var tempFilenameBlock;
            for (var s; s < _Disk.sectors; s++) {
                for (var b; b < _Disk.blocks; b++) {
                    tempBlockArr = sessionStorage.getItem("0:" + s + ":" + b).split(",");
                    tempFilenameBlock = this.getFilename(tempBlockArr);
                    if (tempFilenameBlock[0] == "~") {
                        this.deleteFile(this.findFile(tempFilenameBlock));
                    }
                }
            }
        }
        listFilenames() {
            var filenameArr = [];
            var tempBlockArr = [];
            var swap = false;
            for (var s = 0; s < _Disk.sectors; s++) {
                for (var b = 0; b < _Disk.blocks; b++) {
                    tempBlockArr = sessionStorage.getItem("0:" + s + ":" + b).split(",");
                    if (String.fromCharCode(parseInt(tempBlockArr[4])) != "~") {
                        //"~" means that there is no link to another block
                        swap = false;
                    }
                    else {
                        swap = true;
                    }
                    if (tempBlockArr[0] == "1" && !swap) {
                        filenameArr[filenameArr.length] = this.getFilename(tempBlockArr);
                    }
                }
            }
            return filenameArr;
        }
        getRollInData(PID) {
            var filename = this.findFile("~SwapFile " + PID);
            var data = this.readSwapFile(filename);
            this.deleteFile(filename);
            return data.slice(0, 256);
        }
        rollOutPCB() {
            var swap;
            var PCBsInMemory = [];
            for (var process = 0; process < PCBList.length; process++) {
                if (PCBList[process].location == "Memory") {
                    PCBsInMemory[PCBsInMemory.length] = PCBList[process];
                }
            }
            swap = PCBsInMemory[0];
            if (_SchedulingAlgorithm == "PRIORITY") {
                for (var p = 1; p < PCBsInMemory.length; p++) {
                    if (PCBsInMemory[p].priority > swap.priority) {
                        swap = PCBsInMemory[p];
                    }
                }
            }
            return swap;
        }
    }
    RobOS.FileSystemDeviceDriver = FileSystemDeviceDriver;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=fileSystemDeviceDriver.js.map