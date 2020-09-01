/* ------------------------------
     DeviceDriver.ts

     The "base class" for all Device Drivers.
     ------------------------------ */
var RobOS;
(function (RobOS) {
    class DeviceDriver {
        constructor() {
            this.version = '0.07';
            this.status = 'unloaded';
            this.preemptable = false;
            this.driverEntry = null;
            this.isr = null;
            // The constructor below is useless because child classes
            // cannot pass "this" arguments when calling super().
            //constructor(public driverEntry = null,
            //            public isr = null) {
            //}
        }
    }
    RobOS.DeviceDriver = DeviceDriver;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=deviceDriver.js.map