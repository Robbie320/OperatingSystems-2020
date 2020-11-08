/* ------------
disk.ts


------------ */
module RobOS {

    export class Disk {

        constructor(public tracks = 4,
                    public sectors = 8,
                    public blocks = 8, 
                    public blockSize = 64) {
            this.tracks = tracks;
            this.sectors = sectors;
            this.blocks = blocks;
            this.blockSize = blockSize;
        }
    }
}