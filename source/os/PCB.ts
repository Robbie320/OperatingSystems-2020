/* ------------
     PCB.ts

     
     ------------ */
     module RobOS {

      export class PCB {
        
        constructor(memSegment) {
          this.PC = 0;
          this.IR = "0";
          this.ACC = 0;
          this.Xreg = 0;
          this.Yreg = 0;
          this.Zflag = 0;
          this.isExecuting = false;
        }
      }
    }