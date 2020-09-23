/* ------------
     Memory.ts

     
     ------------ */
module RobOS {

  export class Memory {
    
    constructor (public sectOneArr = new Array(256), 
                 public sectOneMin = 0,
                 public sectOneMax = 255,
                 public sectTwoArr = new Array(256),
                 public sectTwoMin = 0,
                 public sectTwoMax = 255,
                 public sectThreeArr = new Array(256),
                 public sectThreeMin = 0,
                 public sectThreeMax = 255) {

      //Total memory between 3 segments is 768
      this.sectOneArr = new Array(256);
      this.sectOneMin = 0;
      this.sectOneMax = 255;
      this.sectTwoArr = new Array(256);
      this.sectTwoMin = 0;
      this.sectTwoMax = 255;
      this.sectThreeArr = new Array(256);
      this.sectThreeMin = 0;
      this.sectThreeMax = 255;
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