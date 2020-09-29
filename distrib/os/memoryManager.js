/* ------------
MemoryManager.ts


------------ */
var RobOS;
(function (RobOS) {
    class MemoryManager {
        construtor() { }
        loadMemory(UPIArray, section, PID) {
            this.checkMemoryAvailability();
            for (var i = 0; i < UPIArray.length; i++) {
                if (section == 1 && _Memory.sectOneAvailable == true) {
                    _Memory.sectOneArr[i] = UPIArray[i];
                }
                else if (section == 2 && _Memory.sectTwoAvailable == true) {
                    _Memory.sectTwoArr[i] = UPIArray[i];
                }
                else if (section == 3 && _Memory.sectThreeAvailable == true) {
                    _Memory.sectThreeArr[i] = UPIArray[i];
                }
            }
            //UPDATE TABLES
            RobOS.Control.updateAllTables();
        }
        checkMemoryAvailability() {
            var availability;
            for (var i = 0; i < 256; i++) {
                if (_Memory.sectOneArr[i] != "00") {
                    _Memory.sectOneAvailable = false;
                    break;
                }
                else {
                    _Memory.sectOneAvailable = true;
                }
            }
            for (var i = 0; i < 256; i++) {
                if (_Memory.sectTwoArr[i] != "00") {
                    _Memory.sectTwoAvailable = false;
                    break;
                }
                else {
                    _Memory.sectTwoAvailable = true;
                }
            }
            for (var i = 0; i < 256; i++) {
                if (_Memory.sectThreeArr[i] != "00") {
                    _Memory.sectThreeAvailable = false;
                    break;
                }
                else {
                    _Memory.sectThreeAvailable = true;
                }
            }
            //If all memory sections unavailable, availabilty is false
            if (_Memory.sectOneAvailable == false && _Memory.sectTwoAvailable == false && _Memory.sectThreeAvailable == false) {
                availability = false;
            }
            else {
                availability = true;
            }
            return availability;
        }
        assignMemory() {
            //check section availability
            if (_Memory.sectOneAvailable) {
                var sectionOneAvailable = false;
                return 0;
            }
            else if (_Memory.sectOneAvailable) {
                var sectionTwoAvailable = false;
                return 1;
            }
            else if (_Memory.sectOneAvailable) {
                var sectionThreeAvailable = false;
                return 2;
            }
            else {
                return -1;
            }
        }
        sectionAvailable(section) {
            if (section == 0) {
                _Memory.sectOneAvailable = true;
            }
            else if (section == 1) {
                _Memory.sectTwoAvailable = true;
            }
            else if (section == 2) {
                _Memory.sectThreeAvailable = true;
            }
        }
        sectionUnavailable(section) {
            if (section == 0) {
                _Memory.sectOneAvailable = false;
            }
            else if (section == 1) {
                _Memory.sectTwoAvailable = false;
            }
            else if (section == 2) {
                _Memory.sectThreeAvailable = false;
            }
        }
    }
    RobOS.MemoryManager = MemoryManager;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=memoryManager.js.map