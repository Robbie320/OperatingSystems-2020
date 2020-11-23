/* ------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
------------ */

module RobOS {

    // Extends DeviceDriver
    export class DeviceDriverDisk extends DeviceDriver {

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
            var emptyBlockArr = new Array(64);
            for(var i = 0; i < emptyBlockArr.length; i++) {
                if(i < 4) {
                    emptyBlockArr[i] = "0";
                } else {
                    emptyBlockArr[i] = "00";
                }
            }
            //Track, Sector, Block for loops to set up using the HTML5 Session Storage
            for(var x = 0; x < _Disk.tracks; x++) { //tracks loop
                for(var y = 0; y < _Disk.sectors; y++) { //sectors loop
                    for(var z = 0; z < _Disk.blocks; z++) { //blocks loop
                        sessionStorage.setItem(x + ":" + y + ":" + z, emptyBlockArr.join());
                    }
                }
            }
            //update Disk table
            RobOS.Control.diskTbUpdate();
        }
        getFilename(dataArr) {
            var filename = "";
            for(var f = 4; f < dataArr.length; f++) {
                if(dataArr[f] == "00") {
                    return filename;
                } else {
                    filename += String.fromCharCode(parseInt(dataArr[f], 16));
                }
            }
            return filename;
        }
        findFile(filename) {
            var dataArr;
            var dataName;
            for(var i = 0 ; i < _Disk.sectors; i++) {
                for(var j = 0; j < _Disk.sectors; j++) {
                    dataArr = sessionStorage.getItem("0:" + i + ":" + j).split(",");
                    dataName = this.getFilename(dataArr);
                    if(dataName == filename) {
                        return "0:" + i + ":" + j;
                    }
                }
            }
            return null;
        }
        getFirstAvailableTSBData() {
            var dataArr;
            for(var t = 1; t < _Disk.tracks; t++) {//Avoid Master Boot Record (MBR)
                for(var s = 0; s < _Disk.sectors; s++) {
                    for(var b = 0; b < _Disk.blocks; b++) {
                        dataArr = sessionStorage.getItem(t + ":" + s + ":" + b).split(",");
                        if(dataArr[0] == "0") {
                            return t + ":" + s + ":" + b;
                        }
                    }
                }
            }
        }
        getFirstAvailableTSBName() {
            var dataArr;
            for(var s = 0; s < _Disk.sectors; s++) {
                for(var b = 1; b < _Disk.blocks; b++) { //Avoid Master Boot Record (MBR)
                    dataArr = sessionStorage.getItem("0:" + s + ":" + b).split(",");
                    if(dataArr[0] == "0") {
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

            for(var k = 1; k <= 3; k++) {
                var d = 0;
                dataArr[k] = "FF"; // FF:FF:FF
                nameArr[k] = data[d]; // Data = next TSB in name
                d += 2;
            }
            for(var e = 0; e < filename.length; e++) {
                nameArr[e + 4] = (filename.charCodeAt(e)).toString(16);
            }
            //save array back to session log
            console.log(nameArr);
            sessionStorage.setItem(name, nameArr.join());
            sessionStorage.setItem(data, dataArr.join());
            RobOS.Control.diskTbUpdate();
        }
        readFile() {

        }
        writeFile() {

        }
        deleteFile() {

        }
        listFilenames() {
            var filenameArr = [];
            var tempBlockArr = [];
            var swap = false;
            var swapFile;
            for(var s = 0; s < _Disk.sectors; s++) {
                for(var b = 0; b < _Disk.blocks; b++) {
                    tempBlockArr = sessionStorage.getItem("0:" + s + ":" + b).split(",");
                    swapFile = (String.fromCharCode(parseInt(tempBlockArr[4])) == "~");
                    if(tempBlockArr[0] == "1" && !swap) {
                        filenameArr[filenameArr.length] = this.getFilename(tempBlockArr);
                    }
                }
            }
            return filenameArr;
        }
    }
}