"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BigInteger_1 = require("./BigInteger");
/*<function name="UInt64">*/
var UInt64 = (function () {
    /**
     * Creates and returns a new 64-bit signed integer.
     * This may be specified as an integer (if the value can be represented as a 32-bit value),
     * another 64-bit integer object (either signed or unsigned), or as a string, which may consist of an optional minus sign,
     * followed by either a decimal number or "0x" or "0X" followed by a hexadecimal number.
     * The string is then converted into the corresponding 64-bit integer value.
     * You can therefore use a string to represent a 64-bit value that is too large to represent as a 32-bit JavaScript Number.
     *
     * @param value The value to assign the new 64-bit integer object.
     * @return A new object representing the specified value.
     * @exception TypeError The specified value cannot be converted into a 64-bit integer. Either it's not a Number, String, or 64-bit integer object, or it's a string that is incorrectly formatted or contains a value outside the range that can be represented in 64 bits. This will also be thrown if the source value is a floating-point number that can't be precisely represented as a 64-bit integer.
     * @example UInt64():base
      ```js
      var uint64 = new jints.UInt64('0x12345');
      console.log(uint64.toString());
      // > 74565
      console.log(uint64.low);
      // > 74565
      console.log(uint64.high);
      // > 0
      ```
     * @example UInt64():-1
      ```js
      var uint64 = new jints.UInt64(-1);
      console.log(uint64.toString(16));
      // > ffffffffffffffff
      ```
     */
    function UInt64(value) {
        this.value = new BigInteger_1.BigInteger(value);
        this.value.twos(64);
        var arr32 = new Int32Array(new Uint8Array(this.toArray()).buffer);
        this.low = arr32[0];
        this.high = arr32[1];
    }
    /**
     * Compares two 64-bit integer values.
     *
     * @param a The first value to compare.
     * @param b The second value to compare.
     * @return The returned value is: -1 if a < b, 0 if a == b, and 1 if a > b.
     * @exception One or both of the specified values is not a 64-bit integer (either signed or unsigned).
     * @example UInt64.compare():base
      ```js
      var a = new jints.UInt64('0x12345');
      var b = new jints.UInt64('0x12345');
      console.log(jints.UInt64.compare(a, b));
      // > 0
      ```
     */
    UInt64.compare = function (a, b) {
        return a.value.compare(b.value);
    };
    /**
     * Returns the high 32 bits of the specified value.
     *
     * @param num The value whose high 32 bits are to be returned.
     * @return The high 32 bits of num are returned. This is essentially num >> 32.
     * @exception TypeError num is not a 64-bit integer object.
     * @example UInt64.hi():base
      ```js
      var a = new jints.UInt64('0x12345');
      console.log(jints.UInt64.hi(a));
      // > 0
      ```
     */
    UInt64.hi = function (num) {
        return num.high;
    };
    /**
     * Returns the low 32 bits of the specified value.
     * @param num The UInt64 value whose low 32 bits are to be returned.
     * @return The high 32 bits of num are returned. This is essentially num & 0xFFFFFFFF.
     * @exception TypeError num is not a 64-bit integer object.
     * @example UInt64.lo():base
      ```js
      var a = new jints.UInt64('0x12345');
      console.log(jints.UInt64.lo(a));
      // > 74565
      ```
     */
    UInt64.lo = function (num) {
        return num.low;
    };
    /**
     * Creates a 64-bit integer object whose value is constructed using the specified high and low order 32-bit values.
     *
     * @param high The high-order 32 bits of the value to create.
     * @param low The low-order 32 bits of the value to create.
     * @return A new 64-bit integer object comprised of the two values merged together. The returned value is (high << 32) + low.
     * @exception TypeError One or both of the specified numbers is not a JavaScript number with an integral value.
     * @example UInt64.join():base
      ```js
      var a = new jints.UInt64.join(1234, 5678);
      console.log(a.low);
      // > 5678
      console.log(a.high);
      // > 1234
      console.log(a.toString());
      // > 5299989648942
      ```
     */
    UInt64.join = function (high, low) {
        var result = new UInt64(0);
        var arr8 = new Uint8Array(new Int32Array([low, high]).buffer);
        result.value.fromArray(arr8);
        result.low = low;
        result.high = high;
        return result;
    };
    /**
     * Returns a string representation of the object's numeric value.
     *
     * @param radix The radix (base) to use when constructing the string. If you don't specify a radix, base 10 is used.
     * @return A string representation of the value in the specified radix. This string consists of a leading minus sign, if the value was negative, followed by one or more lower-case digits in the specified radix.
     * @example toString():base
      ```js
      var a = new jints.UInt64.join(1234, 5678);
      console.log(a.toString(16));
      // > 4d20000162e
      ```
     */
    UInt64.prototype.toString = function (radix) {
        if (radix === void 0) { radix = 10; }
        return this.value.toString(radix);
    };
    /**
     * Convert to byte Array, and optionally zero pad to length, throwing if already exceeding
     *
     * @param endian endian
     * @example toArray():base
      ```js
      var a = new jints.UInt64.join(1234, 5678);
      console.log(JSON.stringify(a.toArray()));
      // > [46,22,0,0,210,4,0,0]
  
      console.log(JSON.stringify(a.toArray('be')));
      // > [0,0,4,210,0,0,22,46]
      ```
     */
    UInt64.prototype.toArray = function (endian) {
        if (endian === void 0) { endian = 'le'; }
        return this.value.toArray(endian, 8);
    };
    return UInt64;
}()); /*</function>*/
exports.UInt64 = UInt64;
