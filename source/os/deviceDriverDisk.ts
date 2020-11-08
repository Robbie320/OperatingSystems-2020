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
                    emptyBlockArr[i] = "0"
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
    }
}