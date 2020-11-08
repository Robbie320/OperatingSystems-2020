/* ------------
disk.ts


------------ */
var RobOS;
(function (RobOS) {
    class Disk {
        constructor(tracks = 4, sectors = 8, blocks = 8, blockSize = 64) {
            this.tracks = tracks;
            this.sectors = sectors;
            this.blocks = blocks;
            this.blockSize = blockSize;
            this.tracks = tracks;
            this.sectors = sectors;
            this.blocks = blocks;
            this.blockSize = blockSize;
        }
    }
    RobOS.Disk = Disk;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=disk.js.map