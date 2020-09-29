/* ------------
Memory.ts


------------ */
module RobOS {

    export class Memory {

        constructor (public sectOneArr = new Array(256), 
                     public sectOneAvailable = true,
                     public sectTwoArr = new Array(256),
                     public sectTwoAvailable = true,
                     public sectThreeArr = new Array(256),
                     public sectThreeAvailable = true) {

            //Total memory between 3 segments is 768
            this.sectOneArr = new Array(256);
            this.sectOneAvailable = sectOneAvailable;
            this.sectTwoArr = new Array(256);
            this.sectTwoAvailable = sectTwoAvailable;
            this.sectThreeArr = new Array(256);
            this.sectThreeAvailable = sectThreeAvailable;
            this.init();
        }
        public init(): void {
            //set all memory to "00"
            for(var i = 0; i < 256; i++) {
                this.sectOneArr[i] = "00";
                this.sectTwoArr[i] = "00";
                this.sectThreeArr[i] = "00";
            }
        }
    }
}