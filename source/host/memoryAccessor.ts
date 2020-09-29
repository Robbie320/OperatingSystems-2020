/* ------------
     MemoryAccessor.ts

     
     ------------ */
module RobOS {

    export class MemoryAccessor {
        constructor() { }
        readOneByteDecimal(section, PC) {
            var hexString = "";
            if(section == 1) {
                hexString = _Memory.sectOneArr[PC];
            } else if(section == 2) {
                hexString = _Memory.sectTwoArr[PC];
            } else if(section == 3) {
                hexString = _Memory.sectThreeArr[PC];
            }
            //Hex String to Decimal int
            var decimalInt = parseInt(hexString, 16);
            return decimalInt;
        }
        readTwoBytesDecimal(section, PC) {
            var hexString = "";
            var decimalInt = parseInt(hexString, 16);
            if(section == 1) {
                hexString = _Memory.sectOneArr[PC+1];
                hexString += _Memory.sectOneArr[PC];
                if(decimalInt > _Memory.sectOneArr.length) {
                    console.log("Memory overflow.");
                    throw(Error);
                } else {
                    return decimalInt;
                }
            } else if(section == 2) {
                hexString = _Memory.sectTwoArr[PC+1];
                hexString += _Memory.sectTwoArr[PC];
                if(decimalInt > _Memory.sectTwoArr.length) {
                    console.log("Memory overflow.");
                    throw(Error);
                } else {
                    return decimalInt;
                }
            } else if(section == 3) {
                hexString = _Memory.sectThreeArr[PC+1];
                hexString += _Memory.sectThreeArr[PC];
                if(decimalInt > _Memory.sectThreeArr.length) {
                    console.log("Memory overflow.");
                    throw(Error);
                } else {
                    return decimalInt;
                }
            }
        }
        readMemoryHex(section, PC) {
            var hexString = "";
            if(section == 1) {
                hexString = _Memory.sectOneArr[PC];
            } else if(section == 2) {
                hexString = _Memory.sectTwoArr[PC];
            } else if(section == 3) {
                hexString = _Memory.sectThreeArr[PC];
            }
            return hexString;
        }
    }
}