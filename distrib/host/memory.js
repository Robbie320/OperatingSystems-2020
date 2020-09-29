/* ------------
Memory.ts


------------ */
var RobOS;
(function (RobOS) {
    class Memory {
        constructor(sectOneArr = new Array(256), sectOneAvailable = true, sectTwoArr = new Array(256), sectTwoAvailable = true, sectThreeArr = new Array(256), sectThreeAvailable = true) {
            this.sectOneArr = sectOneArr;
            this.sectOneAvailable = sectOneAvailable;
            this.sectTwoArr = sectTwoArr;
            this.sectTwoAvailable = sectTwoAvailable;
            this.sectThreeArr = sectThreeArr;
            this.sectThreeAvailable = sectThreeAvailable;
            //Total memory between 3 segments is 768
            this.sectOneArr = new Array(256);
            this.sectOneAvailable = sectOneAvailable;
            this.sectTwoArr = new Array(256);
            this.sectTwoAvailable = sectTwoAvailable;
            this.sectThreeArr = new Array(256);
            this.sectThreeAvailable = sectThreeAvailable;
            this.init();
        }
        init() {
            //set all memory to "00"
            for (var i = 0; i < 256; i++) {
                this.sectOneArr[i] = "00";
                this.sectTwoArr[i] = "00";
                this.sectThreeArr[i] = "00";
            }
        }
    }
    RobOS.Memory = Memory;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=memory.js.map