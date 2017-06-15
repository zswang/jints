import { BigInteger, EndianType } from './BigInteger'

/*<function name="Int64" depend="BigInteger">*/
class Int64 {

  high: number
  low: number

  value: BigInteger

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
   * @example Int64():base
    ```js
    var int64 = new jints.Int64('0x12345');
    console.log(int64.toString());
    // > 74565
    console.log(int64.low);
    // > 74565
    console.log(int64.high);
    // > 0
    ```
   */
  constructor(value: string | number) {
    this.value = new BigInteger(value)
    let arr32 = new Int32Array(new Uint8Array(this.toArray()).buffer)
    this.low = arr32[0]
    this.high = arr32[1]
  }

  /**
   * Compares two 64-bit integer values.
   *
   * @param a The first value to compare.
   * @param b The second value to compare.
   * @return The returned value is: -1 if a < b, 0 if a == b, and 1 if a > b.
   * @exception One or both of the specified values is not a 64-bit integer (either signed or unsigned).
   * @example Int64.compare():base
    ```js
    var a = new jints.Int64('0x12345');
    var b = new jints.Int64('0x12345');
    console.log(jints.Int64.compare(a, b));
    // > 0
    ```
   */
  static compare(a: Int64, b: Int64): number {
    return a.value.compare(b.value)
  }

  /**
   * Returns the high 32 bits of the specified value.
   *
   * @param num The value whose high 32 bits are to be returned.
   * @return The high 32 bits of num are returned. This is essentially num >> 32.
   * @exception TypeError num is not a 64-bit integer object.
   * @example Int64.hi():base
    ```js
    var a = new jints.Int64('0x12345');
    console.log(jints.Int64.hi(a));
    // > 0
    ```
   */
  static hi(num: Int64): number {
    return num.high
  }

  /**
   * Returns the low 32 bits of the specified value.
   * @param num The Int64 value whose low 32 bits are to be returned.
   * @return The high 32 bits of num are returned. This is essentially num & 0xFFFFFFFF.
   * @exception TypeError num is not a 64-bit integer object.
   * @example Int64.lo():base
    ```js
    var a = new jints.Int64('0x12345');
    console.log(jints.Int64.lo(a));
    // > 74565
    ```
   */
  static lo(num: Int64): number {
    return num.low
  }

  /**
   * Creates a 64-bit integer object whose value is constructed using the specified high and low order 32-bit values.
   *
   * @param high The high-order 32 bits of the value to create.
   * @param low The low-order 32 bits of the value to create.
   * @return A new 64-bit integer object comprised of the two values merged together. The returned value is (high << 32) + low.
   * @exception TypeError One or both of the specified numbers is not a JavaScript number with an integral value.
   * @example Int64.join():base
    ```js
    var a = new jints.Int64.join(1234, 5678);
    console.log(a.low);
    // > 5678
    console.log(a.high);
    // > 1234
    console.log(a.toString());
    // > 5299989648942
    ```
   * @example Int64.join():-1
    ```js
    var a = new jints.Int64.join(-1, -1);
    console.log(a.low);
    // > -1
    console.log(a.high);
    // > -1
    console.log(a.toString());
    // > -1
    ```
   * @example Int64.join():-0x1234567890abcdef
    ```js
    var a = new jints.Int64('-0x1234567890abcdef');
    var b = jints.Int64.join(a.high, a.low)
    console.log(b.toString(16));
    // > -1234567890abcdef
    ```
   */
  static join(high: number, low: number): Int64 {
    let result = new Int64(0)

    let arr8 = new Uint8Array(new Int32Array([low, high]).buffer)
    result.value.fromArray(arr8)
    if (high < 0) {
      result.value.negative = 1
      result.value.twos(64)
      result.value.negative = 1
    }
    result.low = low
    result.high = high
    return result
  }

  /**
   * Returns a string representation of the object's numeric value.
   *
   * @param radix The radix (base) to use when constructing the string. If you don't specify a radix, base 10 is used.
   * @return A string representation of the value in the specified radix. This string consists of a leading minus sign, if the value was negative, followed by one or more lower-case digits in the specified radix.
   * @example toString():base
    ```js
    var a = new jints.Int64.join(1234, 5678);
    console.log(a.toString(16));
    // > 4d20000162e
    ```
   * @example Int64():-1
    ```js
    var int64 = new jints.Int64(-1);
    console.log(int64.toString(16));
    // > -1
    ```
   */
  toString(radix: number = 10) {
    return this.value.toString(radix)
  }

  /**
   * Convert to byte Array, and optionally zero pad to length, throwing if already exceeding
   *
   * @param endian endian
   * @example toArray():base
    ```js
    var a = new jints.Int64.join(1234, 5678);
    console.log(JSON.stringify(a.toArray()));
    // > [46,22,0,0,210,4,0,0]

    console.log(JSON.stringify(a.toArray('be')));
    // > [0,0,4,210,0,0,22,46]
    ```
   * @example toArray():-1
    ```js
    var int64 = new jints.Int64(-1);
    console.log(JSON.stringify(int64.toArray()));
    // > [255,255,255,255,255,255,255,255]
    ```
   */
  toArray(endian: EndianType = 'le') {
    let c = this.value.clone()
    c.twos(64)
    return c.toArray(endian, 8)
  }

} /*</function>*/

export {
  Int64
}