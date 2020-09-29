/* ------------
PCB.ts


------------ */
module RobOS {

    export class PCB {
        constructor (public PID: number = 0,
                     public PC: number = 0,
                     public IR: string = "",
                     public ACC: number = 0,
                     public Xreg: number = 0,
                     public Yreg: number = 0,
                     public Zflag: number = 0,
                     public state: string = "",
                     public location: string = "",
                     public section: string = "") {

            this.PID = PID;
            this.PC = PC;
            this.IR = IR;
            this.ACC = ACC;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.state = state;
            this.location = location;
            this.section = section;
        }
    }
}