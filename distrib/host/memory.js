/* ------------
     Memory.ts

     
     ------------ */
var RobOS;
(function (RobOS) {
    class Memory {
        constructor(sectOneArr, sectOneMin, sectOneMax, sectTwoArr, sectTwoMin, sectTwoMax, sectThreeArr, sectThreeMin, sectThreeMax) {
            this.sectOneArr = sectOneArr;
            this.sectOneMin = sectOneMin;
            this.sectOneMax = sectOneMax;
            this.sectTwoArr = sectTwoArr;
            this.sectTwoMin = sectTwoMin;
            this.sectTwoMax = sectTwoMax;
            this.sectThreeArr = sectThreeArr;
            this.sectThreeMin = sectThreeMin;
            this.sectThreeMax = sectThreeMax;
            //Total memory between 3 segments is 768
            this.sectOneArr = new Array(255);
            this.sectOneMin = 0;
            this.sectOneMax = 255;
            this.sectTwoArr = new Array(255);
            this.sectTwoMin = 0;
            this.sectTwoMax = 255;
            this.sectThreeArr = new Array(255);
            this.sectThreeMin = 0;
            this.sectThreeMax = 255;
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