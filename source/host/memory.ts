/* ------------
Memory.ts


------------ */
module RobOS {

    export class Memory {

        constructor (public memoryArr = new Array(256),
                     public sectOneMin = 0,
                     public sectOneMax = 255, 
                     public sectTwoMin = 256,
                     public sectTwoMax = 511,
                     public sectThreeMin = 512,
                     public sectThreeMax = 767,
                     public sectOneAvailable = true,
                     public sectTwoAvailable = true,
                     public sectThreeAvailable = true) {

            //Total memory between 3 segments is 768
            this.memoryArr = new Array(256);
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
        public init(): void {
            //set all memory to "00"
            for(var i = 0; i < this.memoryArr.length; i++) {
                this.memoryArr[i] = "00";
            }
        }
        getSectMin(section) {
            switch(section){
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
                    console.log(section)
                    console.log("Invalid section number.");
            }
        }
        getSectMax(section) {
            switch(section){
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
                    this.sectThreeMax;
                    break;
                default:
                    console.log(section);
                    console.log("Invalid section number.");
            }
        }
    }
}