export type EndianType = 'le' | 'be'

/*<function name="BigInteger">*/
const WORD_SIZE: number = 26

/**
 * 大整数
 *
 * @see https://github.com/indutny/bn.js
 */
class BigInteger {

  /**
   * 转换数字字符串
   *
   * @param text 字符串
   * @param start 起始位置
   * @param end 结束为止
   * @param radix 进制基数 2~36
   * @example parseText():base
     ```js
     console.log(jints.BigInteger.parseText('123', 0, 3, 10));
     // > 123

     console.log(jints.BigInteger.parseText('123', 1, 3, 10));
     // > 23

     console.log(jints.BigInteger.parseText('123', 1, 3, 16));
     // > 35

     console.log(jints.BigInteger.parseText('Aa', 0, 2, 16));
     // > 170
     ```
   */
  static parseText(text: string, start: number, end: number, radix: number): number {
    let result = 0
    let len = Math.min(text.length, end)
    for (let i = start; i < len; i++) {
      result *= radix

      let c = text.charCodeAt(i) - 48
      if (c >= 49) { // 'a'
        result += c - 49 + 0xa
      } else if (c >= 17) { // 'A'
        result += c - 17 + 0xa
      } else { // '0' - '9'
        result += c
      }
    }
    return result
  }

  /**
   * 内存字
   */
  public words: number[]

  /**
   * 是否为负数 1 为负数
   */
  public negative: 0 | 1

  /**
   * 构造大整数对象
   *
   * @param value 数值
   * @example BigInteger():value is undefined
    ```js
    var bi = new jints.BigInteger();
    console.log(bi.toString());
    // > 0
    ```
   * @example BigInteger():value is string
    ```js
    var bi = new jints.BigInteger('123');
    console.log(bi.toString());
    // > 123

    var bi = new jints.BigInteger('');
    console.log(bi.toString());
    // > 0
    ```
   * @example BigInteger():value is hex
    ```js
    var bi = new jints.BigInteger('0xff');
    console.log(bi.toString());
    // > 255
    ```
   * @example BigInteger():value is oct
    ```js
    var bi = new jints.BigInteger('0o77');
    console.log(bi.toString());
    // > 63
    ```
   * @example BigInteger():value is bin
    ```js
    var bi = new jints.BigInteger('-0b1111');
    console.log(bi.toString());
    // > -15
    ```
   * @example BigInteger():value is number
    ```js
    var bi = new jints.BigInteger(1000.12);
    console.log(bi.toString());
    // > 1000

    var bi = new jints.BigInteger(-1000.12);
    console.log(bi.toString());
    // > -1000

    var bi = new jints.BigInteger(0x4000000);
    console.log(bi.toString(16));
    // > 4000000

    var bi = new jints.BigInteger(0x10000000000000);
    console.log(bi.toString(16));
    // > 10000000000000
    ```
   */
  constructor(value: number | string = null) {
    this.negative = 0
    if (typeof value === 'string') {
      let match = value.match(/^([+-]?)((?:0x|0b|0o)?)(\w+)/i)
      if (match) {
        let radix = {
          "0b": 2,
          "0o": 8,
          "0x": 16,
        }[match[2].toLowerCase()] || 10

        if (match[1] === '-') {
          this.negative = 1
        }
        this.parse(match[3], radix, 0)
      } else {
        this.words = [0]
      }
    } else { // number
      if (value < 0) {
        this.negative = 1
        value = -value
      }
      if (value < 0x4000000) {
        this.words = [value & 0x3ffffff]
      } else if (value < 0x10000000000000) {
        this.words = [
          value & 0x3ffffff,
          (value / 0x4000000) & 0x3ffffff
        ]
      } else {
        this.words = [
          value & 0x3ffffff,
          (value / 0x4000000) & 0x3ffffff,
          1
        ]
      }
    }
  }

  /**
   * 解析数字字符
   *
   * @param number 数字字符串
   * @param radix 进制基数
   * @param start 起始位置
   * @example parse():base
    ```js
    var bi = new jints.BigInteger();
    bi.parse('0123456789abcdef', 16);
    console.log(bi.toString(16));
    // > 123456789abcdef

    bi.parse('0123456789abcdef', 16, 3);
    console.log(bi.toString(16));
    // > 3456789abcdef
    ```
   * @example parse():coverage
    ```js
    var bi = new jints.BigInteger();
    bi.parse('zzzzzzzzzzzz', 36);
    console.log(bi.toString(36));
    // > zzzzzzzzzzzz

    bi.parse('2821122424961', 10);
    console.log(bi.toString(10));
    // > 2821122424961
    ```
   */
  parse(number: string, radix: number, start: number = 0) {
    // Initialize as zero
    this.words = [0]

    // Find length of limb in base
    let limbLen = 0
    let limbPow = 1
    for (; limbPow <= 0x3ffffff; limbPow *= radix) {
      limbLen++
    }
    limbLen--
    limbPow = (limbPow / radix) | 0

    let total = number.length - start
    let mod = total % limbLen
    let end = Math.min(total, total - mod) + start

    let word = 0
    let i
    for (i = start; i < end; i += limbLen) {
      word = BigInteger.parseText(number, i, i + limbLen, radix)
      this.mul(limbPow)

      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word
      } else {
        this.add(word)
      }
    }

    if (mod !== 0) {
      let pow = 1
      word = BigInteger.parseText(number, i, number.length, radix)

      for (i = 0; i < mod; i++) {
        pow *= radix
      }

      this.mul(pow)
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word
      } else {
        this.add(word)
      }
    }
  }

  /**
   * 除于一个数
   *
   * @param num 被除数
   * @example div():base
    ```js
    var bi = new jints.BigInteger(101);
    bi.div(2);
    console.log(bi.toString());
    // > 50

    var bi = new jints.BigInteger(101);
    bi.div(3);
    console.log(bi.toString());
    // > 33
    ```
   */
  div(num: number) {
    let carry = 0
    for (let i = this.words.length - 1; i >= 0; i--) {
      let w = (this.words[i] | 0) + carry * 0x4000000
      this.words[i] = (w / num) | 0
      carry = w % num
    }
    this.strip()
  }

  private strip() {
    while (this.words.length > 1 && this.words[this.words.length - 1] === 0) {
      this.words.length--
    }
    this.normSign()
  }

  private normSign() {
    if (this.words.length === 1 && this.words[0] === 0) {
      this.negative = 0
    }
  }

  /**
   * 乘于一个数
   *
   * @param num 该数
   * @example mul():base
    ```js
    var bi = new jints.BigInteger(101);
    bi.mul(2);
    console.log(bi.toString());
    // > 202

    var bi = new jints.BigInteger(7);
    bi.mul(3);
    console.log(bi.toString());
    // > 21
    ```
   */
  mul(num: number) {
    // Carry
    let carry = 0
    let i = 0
    for (; i < this.words.length; i++) {
      let w = (this.words[i] | 0) * num
      let lo = (w & 0x3ffffff) + (carry & 0x3ffffff)
      carry >>= WORD_SIZE
      carry += (w / 0x4000000) | 0
      // NOTE: lo is 27bit maximum
      carry += lo >>> WORD_SIZE
      this.words[i] = lo & 0x3ffffff
    }

    if (carry !== 0) {
      this.words[i] = carry
    }
  }

  /**
   * 加一个数
   *
   * @param num 该数
   * @example add():base
    ```js
    var bi = new jints.BigInteger(101);
    bi.add(2);
    console.log(bi.toString());
    // > 103

    var bi = new jints.BigInteger(7);
    bi.add(3);
    console.log(bi.toString());
    // > 10
    ```
   * @example add():coverage
    ```js
    var bi = new jints.BigInteger(0x4000000 - 1);
    bi.add(0x4000000 - 2);
    console.log(bi.toString(16));
    // > 7fffffd
    ```
   */
  add(num: number) {
    this.words[0] += num

    // Carry
    for (let i = 0; i < this.words.length && this.words[i] >= 0x4000000; i++) {
      this.words[i] -= 0x4000000
      if (i === this.words.length - 1) {
        this.words[i + 1] = 0
      }
      this.words[i + 1]++
    }
  }

  /**
   * 取模
   *
   * @param num 该数
   * @example mod():base
    ```js
    var bi = new jints.BigInteger(101);
    console.log(bi.mod(2));
    // > 1

    var bi = new jints.BigInteger(7);
    console.log(bi.mod(3));
    // > 1
    ```
   */
  mod(num: number): number {
    let p = (1 << WORD_SIZE) % num

    let result = 0
    for (let i = this.words.length - 1; i >= 0; i--) {
      result = (p * result + (this.words[i] | 0)) % num
    }
    return result
  }

  /**
   * 为零判断
   *
   * @example mod():base
    ```js
    var bi = new jints.BigInteger(0);
    console.log(bi.isZero());
    // > true

    var bi = new jints.BigInteger(1);
    console.log(bi.isZero());
    // > false
    ```
   */
  isZero(): boolean {
    return this.words.length === 1 && this.words[0] === 0
  }

  /**
   * 克隆对象
   *
   * @example clone():base
    ```js
    var bi = new jints.BigInteger('1234567890000000000000000');
    console.log(bi.clone().toString());
    // > 1234567890000000000000000
    ```
   */
  clone(): BigInteger {
    let result = new BigInteger()
    result.words = this.words.slice()
    result.negative = this.negative
    return result
  }

  /**
   * 转换为字符串
   *
   * @param radix 进制基数
   * @example toString():base
    ```js
    var bi = new jints.BigInteger('1234567890000000000000000');
    console.log(bi.toString());
    // > 1234567890000000000000000

    console.log(bi.toString(16));
    // > 1056e0f3635fbb7d50000

    console.log(bi.toString(36));
    // > 5l1ec1qoa123tvk0
    ```
   */
  toString(radix: number = 10): string {
    if (this.isZero()) {
      return '0';
    }
    let groupSize = Math.floor(WORD_SIZE * Math.LN2 / Math.log(radix))
    let groupBase = Math.pow(radix, groupSize)

    let result = ''
    let c = this.clone()
    c.negative = 0
    while (!c.isZero()) {
      let r = c.mod(groupBase).toString(radix)
      c.div(groupBase)

      if (!c.isZero()) {
        result = new Array(groupSize - r.length + 1).join('0') + r + result
      } else {
        result = r + result
      }
    }
    if (this.negative === 1) {
      result = '-' + result
    }
    return result
  }

  get length(): number {
    return this.words.length
  }

  /**
   * 两数比较
   *
   * @param bi 另一个数
   * @return 如果相同返回 0, 大于: 1, 小于: -1
   * @example compare():base
    ```js
    var a = new jints.BigInteger('0xfffffff');
    var b = new jints.BigInteger('0xfffffff');
    console.log(a.compare(b));
    // > 0

    b.add(1);
    console.log(a.compare(b));
    // > -1

    a.add(2);
    console.log(a.compare(b));
    // > 1

    var a = new jints.BigInteger(2);
    var b = new jints.BigInteger(1);
    console.log(a.compare(b));
    // > 1

    var a = new jints.BigInteger(-2);
    var b = new jints.BigInteger(-1);
    console.log(a.compare(b));
    // > -1
    ```
   * @example compare():signed
    ```js
    var a = new jints.BigInteger('0xfffffff');
    var b = new jints.BigInteger('0xfffffff');

    b.negative = 1;
    console.log(a.compare(b));
    // > 1

    a.negative = 1;
    console.log(a.compare(b));
    // > 0

    b.negative = 0;
    console.log(a.compare(b));
    // > -1
    ```
   * @example compare():length of words
    ```js
    var a = new jints.BigInteger('0xfffffff');
    var b = new jints.BigInteger('0xff');

    console.log(a.compare(b));
    // > 1

    console.log(b.compare(a));
    // > -1
    ```
   */
  compare(bi: BigInteger): number {
    if (this.negative !== 0 && bi.negative === 0) { return -1 }
    if (this.negative === 0 && bi.negative !== 0) { return 1 }

    let signed = this.negative !== 0 ? -1 : 1
    if (this.length > bi.length) { return 1 * signed }
    if (this.length < bi.length) { return -1 * signed }
    for (let i = this.length - 1; i >= 0; i--) {
      let a = this.words[i] | 0
      let b = bi.words[i] | 0
      if (a === b) continue
      if (a < b) {
        return -1 * signed
      }
      return 1 * signed
    }
    return 0
  }

  /**
   * 取有多长的 bit
   *
   * @example bitLength():zero
    ```js
    var bi = new jints.BigInteger();
    console.log(bi.bitLength());
    // > 0
    ```
   */
  bitLength(): number {
    function clz32(x: number): number {
      // Let n be ToUint32(x).
      // Let p be the number of leading zero bits in
      // the 32-bit binary representation of n.
      // Return p.
      if (x == null || x === 0) {
        return 32
      }
      return 31 - Math.floor(Math.log(x >>> 0) * Math.LOG2E)
    }

    let w = this.words[this.length - 1]
    let hi = 32 - clz32(w)
    return (this.length - 1) * WORD_SIZE + hi
  }

  byteLength(): number {
    return Math.ceil(this.bitLength() / 8)
  }

  /**
   * 与运算
   *
   * @param num 该数
   * @return 返回与的结果
   * @example and():base
    ```js
    var a = new jints.BigInteger('0x3114');
    console.log(a.and(0xff).toString(16));
    // > 14
    ```
   */
  and(num: number): number {
    return this.words[0] & num
  }

  /**
   * 右移 bit 位
   *
   * @param bits 右移个数
   * @example shr():base
    ```js
    var bi = new jints.BigInteger('0b10010001000000011000000000000');
    var c = bi.clone();
    c.shr(10);
    console.log(c.toString(2));
    // > 1001000100000001100

    var c = bi.clone();
    c.shr(28);
    console.log(c.toString(2));
    // > 1
    ```
   * @example shr():zero
    ```js
    var bi = new jints.BigInteger();
    bi.shr(0);
    console.log(bi.toString());
    // > 0

    bi.shr(26);
    console.log(bi.toString());
    // > 0

    var bi = new jints.BigInteger(1);
    bi.shr(1);
    console.log(bi.toString());
    // > 0
    ```
   */
  shr(bits: number) {
    let h = 0
    let r = bits % WORD_SIZE
    let s = Math.min((bits - r) / WORD_SIZE, this.length)
    let mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r)

    h -= s
    h = Math.max(0, h)

    if (s === 0) {
      // No-op, we should not move anything at all
    } else if (this.length > s) {
      for (let i = 0; i < this.length - s; i++) {
        this.words[i] = this.words[i + s]
      }
      this.words.length -= s
    } else {
      this.words = [0]
    }

    let carry = 0
    for (let i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
      let word = this.words[i] | 0
      this.words[i] = (carry << (WORD_SIZE - r)) | (word >>> r)
      carry = word & mask
    }
    this.strip()
  }

  /**
   * 转为字节数值
   *
   * @param endian 字节序
   * @param length 字节长度
   * @example toArray():base
    ```js
    var bi = new jints.BigInteger('0x1234567890ab');
    console.log(JSON.stringify(bi.toArray()));
    // > [171,144,120,86,52,18]

    console.log(JSON.stringify(bi.toArray('be')));
    // > [18,52,86,120,144,171]
    ```
   * @example toArray():length
    ```js
    var bi = new jints.BigInteger('0x1234567890ab');
    console.log(JSON.stringify(bi.toArray('be', 8)));
    // > [0,0,18,52,86,120,144,171]

    console.log(JSON.stringify(bi.toArray('le', 8)));
    // > [171,144,120,86,52,18,0,0]
    ```
   */
  toArray(endian: EndianType = 'le', length: number = 0): number[] {
    let byteLength = this.byteLength()
    let reqLength = length || Math.max(1, byteLength)

    let result = new Array(reqLength)
    let q = this.clone()
    let i
    if (endian !== 'le') {
      // Assume big-endian
      for (i = 0; i < reqLength - byteLength; i++) {
        result[i] = 0
      }

      for (i = 0; !q.isZero(); i++) {
        let b = q.and(0xff)
        q.shr(8)

        result[reqLength - i - 1] = b
      }
    } else {
      for (i = 0; !q.isZero(); i++) {
        let b = q.and(0xff)
        q.shr(8)

        result[i] = b
      }

      for (; i < reqLength; i++) {
        result[i] = 0
      }
    }

    return result
  }

  /**
   * 从数值中转换
   *
   * @param arr 数组 Uint8Array
   * @param endian 字节序
   * @example fromArray():base
    ```js
    var bi = new jints.BigInteger();
    bi.fromArray([1, 2, 3, 4, 5, 6]);
    console.log(bi.toString(16));
    // > 60504030201
    ```
   * @example fromArray():coverage
    ```js
    var bi = new jints.BigInteger();
    bi.fromArray([]);
    console.log(bi.toString());
    // > 0

    var bi = new jints.BigInteger();
    bi.fromArray([1, 2, 3, 4, 5, 6], 'be');
    console.log(bi.toString(16));
    // > 10203040506
    ```
   */
  fromArray(arr: number[] | Uint8Array, endian: EndianType = 'le') {
    // Perhaps a Uint8Array
    if (arr.length <= 0) {
      this.words = [0]
      return this
    }

    let length = Math.ceil(arr.length / 3)
    this.words = new Array(length)
    for (let i = 0; i < length; i++) {
      this.words[i] = 0
    }

    let off = 0
    if (endian === 'be') {
      for (let i = arr.length - 1, j = 0; i >= 0; i -= 3) {
        let w = arr[i] | (arr[i - 1] << 8) | (arr[i - 2] << 16)
        this.words[j] |= (w << off) & 0x3ffffff
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff
        off += 24
        if (off >= 26) {
          off -= 26
          j++
        }
      }
    } else {
      for (let i = 0, j = 0; i < arr.length; i += 3) {
        let w = arr[i] | (arr[i + 1] << 8) | (arr[i + 2] << 16)
        this.words[j] |= (w << off) & 0x3ffffff
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff
        off += 24
        if (off >= 26) {
          off -= 26
          j++
        }
      }
    }
    this.strip()
  }

  /**
   * 取绝对值
   *
   * @example abs():base
    ```js
    var bi = new jints.BigInteger(-1);
    bi.abs();
    console.log(bi.toString());
    // > 1
    ```
   */
  abs() {
    this.negative = 0
  }

  private expand(size) {
    while (this.length < size) {
      this.words[this.words.length++] = 0
    }
  }

  /**
   * 取补码
   *
   * @example twos():base
    ```js
    var bi = new jints.BigInteger('-0b1010');
    bi.twos(8);
    console.log(bi.toString(2));
    // > 11110110
    ```
   * @example twos():unsigned
    ```js
    var bi = new jints.BigInteger('0b1010');
    bi.twos(8);
    console.log(bi.toString(2));
    // > 1010
    ```
   */
  twos(bitSize: number) {
    if (this.negative !== 0) {
      this.abs()
      this.not(bitSize)
      this.add(1)
    }
  }

  /**
   * 取非值
   *
   * @example not():base
    ```js
    var bi = new jints.BigInteger('0b1010');
    bi.not(8);
    console.log(bi.toString(2));
    // > 11110101
    ```
   * @example not():coverage
    ```js
    var bi = new jints.BigInteger('0b1010');
    bi.not(26);
    console.log(bi.toString(2));
    // > 11111111111111111111110101

    var bi = new jints.BigInteger('0b1010');
    bi.not(28);
    console.log(bi.toString(2));
    // > 1111111111111111111111110101
    ```
   */
  not(bitSize: number) {
    let bytesNeeded = Math.ceil(bitSize / WORD_SIZE) | 0
    let bitsLeft = bitSize % WORD_SIZE

    // Extend the buffer with leading zeroes
    this.expand(bytesNeeded)

    if (bitsLeft > 0) {
      bytesNeeded--
    }

    // Handle complete words
    let i = 0
    for (; i < bytesNeeded; i++) {
      this.words[i] = ~this.words[i] & 0x3ffffff
    }

    // Handle the residue
    if (bitsLeft > 0) {
      this.words[i] = ~this.words[i] & (0x3ffffff >> (WORD_SIZE - bitsLeft))
    }

    // And remove leading zeroes
    this.strip()
  }
} /*</function>*/

export {
  BigInteger
}