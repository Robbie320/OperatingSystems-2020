/* ------------
Memory.ts


------------ */
var RobOS;
(function (RobOS) {
    class Memory {
        constructor(memoryArr = new Array(768), sectOneMin = 0, sectOneMax = 255, sectTwoMin = 256, sectTwoMax = 511, sectThreeMin = 512, sectThreeMax = 767, sectOneAvailable = true, sectTwoAvailable = true, sectThreeAvailable = true) {
            this.memoryArr = memoryArr;
            this.sectOneMin = sectOneMin;
            this.sectOneMax = sectOneMax;
            this.sectTwoMin = sectTwoMin;
            this.sectTwoMax = sectTwoMax;
            this.sectThreeMin = sectThreeMin;
            this.sectThreeMax = sectThreeMax;
            this.sectOneAvailable = sectOneAvailable;
            this.sectTwoAvailable = sectTwoAvailable;
            this.sectThreeAvailable = sectThreeAvailable;
            //Total memory between 3 segments is 768
            this.memoryArr = new Array(767);
            this.sectOneMin = sectOneMin;
            this.sectOneMax = sectOneMax;
            this.sectTwoMin = sectTwoMin;
            this.sectTwoMax = sectTwoMax;
            this.sectThreeMin = sectThreeMin;
            this.sectThreeMax = sectThreeMax;
            this.sectOneAvailable = sectOneAvailable;
            this.sectTwoAvailable = sectTwoAvailable;
            this.sectThreeAvailable = sectThreeAvailable;
            this.init();
        }
        init() {
            //set all memory to "00"
            for (var i = 0; i < this.memoryArr.length; i++) {
                this.memoryArr[i] = "00";
            }
        }
        getSectMin(section) {
            switch (section) {
                case "1":
                    return this.sectOneMin;
                    break;
                case "2":
                    return this.sectTwoMin;
                    break;
                case "3":
                    return this.sectThreeMin;
                    break;
                case "all":
                    return this.sectOneMin;
                    break;
                default:
                    console.log(section);
                    console.log("Invalid section number.");
            }
        }
        getSectMax(section) {
            switch (section) {
                case "1":
                    return this.sectOneMax;
                    break;
                case "2":
                    return this.sectTwoMax;
                    break;
                case "3":
                    return this.sectThreeMax;
                    break;
                case "all":
                    return this.sectThreeMax;
                    break;
                default:
                    console.log(section);
                    console.log("Invalid section number.");
            }
        }
    }
    RobOS.Memory = Memory;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=memory.js.map