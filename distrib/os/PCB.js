/* ------------
PCB.ts


------------ */
var RobOS;
(function (RobOS) {
    class PCB {
        constructor(PID = 0, PC = 0, IR = "", ACC = 0, Xreg = 0, Yreg = 0, Zflag = 0, state = "", location = "", section = "") {
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
    RobOS.PCB = PCB;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=PCB.js.map