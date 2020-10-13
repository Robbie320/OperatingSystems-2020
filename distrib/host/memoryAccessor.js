/* ------------
     MemoryAccessor.ts

     
     ------------ */
var RobOS;
(function (RobOS) {
    class MemoryAccessor {
        constructor() { }
        readOneByteDecimal(section, PC) {
            var hexString = "";
            var decimalInt = 0;
            hexString = _Memory.memoryArr[_Memory.getSectMin(section) + PC];
            //Hex String to Decimal int
            decimalInt = parseInt(hexString, 16);
            return decimalInt;
        }
        readTwoBytesDecimal(section, PC) {
            var hexString = "";
            var decimalInt = 0;
            var len;
            hexString = _Memory.memoryArr[_Memory.getSectMin(section) + PC + 1];
            hexString += _Memory.memoryArr[_Memory.getSectMin(section) + PC];
            decimalInt = parseInt(hexString, 16) + _Memory.getSectMin(section);
            len = _Memory.memoryArr.length;
            if (decimalInt > len) {
                console.log("Memory overflow.");
                //throw(Error);
            }
            else {
                return decimalInt;
            }
        }
        readMemoryHex(section, PC) {
            var hexString = "";
            hexString = _Memory.memoryArr[_Memory.getSectMin(section) + PC];
            return hexString;
        }
    }
    RobOS.MemoryAccessor = MemoryAccessor;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=memoryAccessor.js.map