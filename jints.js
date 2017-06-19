(function (exportName) {
  /*<jdists encoding="ejs" data="../package.json">*/
  /**
   * @file <%- name %>
   <% if (typeof repository != 'undefined') { %>
   * @url <%- repository.url %>
   <% } %>
   * <%- description %>
   * @author
       <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
   *   <%- item.name %> (<%- item.url %>)
       <% }); %>
   * @version <%- version %>
       <% var now = new Date() %>
   * @date <%- [
        now.getFullYear(),
        now.getMonth() + 101,
        now.getDate() + 100
      ].join('-').replace(/-1/g, '-') %>
  * @license <%- license %>
  */
    /*<function name="BigInteger">*/
var WORD_SIZE = 26;
/**
 * 大整数
 *
 * @see https://github.com/indutny/bn.js
 */
var BigInteger = (function () {
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
    function BigInteger(value) {
        if (value === void 0) { value = null; }
        this.negative = 0;
        if (typeof value === 'string') {
            var match = value.match(/^([+-]?)((?:0x|0b|0o)?)(\w+)/i);
            if (match) {
                var radix = {
                    "0b": 2,
                    "0o": 8,
                    "0x": 16,
                }[match[2].toLowerCase()] || 10;
                if (match[1] === '-') {
                    this.negative = 1;
                }
                this.parse(match[3], radix, 0);
            }
            else {
                this.words = [0];
            }
        }
        else {
            if (value < 0) {
                this.negative = 1;
                value = -value;
            }
            if (value < 0x4000000) {
                this.words = [value & 0x3ffffff];
            }
            else if (value < 0x10000000000000) {
                this.words = [
                    value & 0x3ffffff,
                    (value / 0x4000000) & 0x3ffffff
                ];
            }
            else {
                this.words = [
                    value & 0x3ffffff,
                    (value / 0x4000000) & 0x3ffffff,
                    1
                ];
            }
        }
    }
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
    BigInteger.parseText = function (text, start, end, radix) {
        var result = 0;
        var len = Math.min(text.length, end);
        for (var i = start; i < len; i++) {
            result *= radix;
            var c = text.charCodeAt(i) - 48;
            if (c >= 49) {
                result += c - 49 + 0xa;
            }
            else if (c >= 17) {
                result += c - 17 + 0xa;
            }
            else {
                result += c;
            }
        }
        return result;
    };
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
    BigInteger.prototype.parse = function (number, radix, start) {
        if (start === void 0) { start = 0; }
        // Initialize as zero
        this.words = [0];
        // Find length of limb in base
        var limbLen = 0;
        var limbPow = 1;
        for (; limbPow <= 0x3ffffff; limbPow *= radix) {
            limbLen++;
        }
        limbLen--;
        limbPow = (limbPow / radix) | 0;
        var total = number.length - start;
        var mod = total % limbLen;
        var end = Math.min(total, total - mod) + start;
        var word = 0;
        var i;
        for (i = start; i < end; i += limbLen) {
            word = BigInteger.parseText(number, i, i + limbLen, radix);
            this.mul(limbPow);
            if (this.words[0] + word < 0x4000000) {
                this.words[0] += word;
            }
            else {
                this.add(word);
            }
        }
        if (mod !== 0) {
            var pow = 1;
            word = BigInteger.parseText(number, i, number.length, radix);
            for (i = 0; i < mod; i++) {
                pow *= radix;
            }
            this.mul(pow);
            if (this.words[0] + word < 0x4000000) {
                this.words[0] += word;
            }
            else {
                this.add(word);
            }
        }
    };
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
    BigInteger.prototype.div = function (num) {
        var carry = 0;
        for (var i = this.words.length - 1; i >= 0; i--) {
            var w = (this.words[i] | 0) + carry * 0x4000000;
            this.words[i] = (w / num) | 0;
            carry = w % num;
        }
        this.strip();
    };
    BigInteger.prototype.strip = function () {
        while (this.words.length > 1 && this.words[this.words.length - 1] === 0) {
            this.words.length--;
        }
        this.normSign();
    };
    BigInteger.prototype.normSign = function () {
        if (this.words.length === 1 && this.words[0] === 0) {
            this.negative = 0;
        }
    };
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
    BigInteger.prototype.mul = function (num) {
        // Carry
        var carry = 0;
        var i = 0;
        for (; i < this.words.length; i++) {
            var w = (this.words[i] | 0) * num;
            var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
            carry >>= WORD_SIZE;
            carry += (w / 0x4000000) | 0;
            // NOTE: lo is 27bit maximum
            carry += lo >>> WORD_SIZE;
            this.words[i] = lo & 0x3ffffff;
        }
        if (carry !== 0) {
            this.words[i] = carry;
        }
    };
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
    BigInteger.prototype.add = function (num) {
        this.words[0] += num;
        // Carry
        for (var i = 0; i < this.words.length && this.words[i] >= 0x4000000; i++) {
            this.words[i] -= 0x4000000;
            if (i === this.words.length - 1) {
                this.words[i + 1] = 0;
            }
            this.words[i + 1]++;
        }
    };
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
    BigInteger.prototype.mod = function (num) {
        var p = (1 << WORD_SIZE) % num;
        var result = 0;
        for (var i = this.words.length - 1; i >= 0; i--) {
            result = (p * result + (this.words[i] | 0)) % num;
        }
        return result;
    };
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
    BigInteger.prototype.isZero = function () {
        return this.words.length === 1 && this.words[0] === 0;
    };
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
    BigInteger.prototype.clone = function () {
        var result = new BigInteger();
        result.words = this.words.slice();
        result.negative = this.negative;
        return result;
    };
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
    BigInteger.prototype.toString = function (radix) {
        if (radix === void 0) { radix = 10; }
        if (this.isZero()) {
            return '0';
        }
        var groupSize = Math.floor(WORD_SIZE * Math.LN2 / Math.log(radix));
        var groupBase = Math.pow(radix, groupSize);
        var result = '';
        var c = this.clone();
        c.negative = 0;
        while (!c.isZero()) {
            var r = c.mod(groupBase).toString(radix);
            c.div(groupBase);
            if (!c.isZero()) {
                result = new Array(groupSize - r.length + 1).join('0') + r + result;
            }
            else {
                result = r + result;
            }
        }
        if (this.negative === 1) {
            result = '-' + result;
        }
        return result;
    };
    Object.defineProperty(BigInteger.prototype, "length", {
        get: function () {
            return this.words.length;
        },
        enumerable: true,
        configurable: true
    });
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
    BigInteger.prototype.compare = function (bi) {
        if (this.negative !== 0 && bi.negative === 0) {
            return -1;
        }
        if (this.negative === 0 && bi.negative !== 0) {
            return 1;
        }
        var signed = this.negative !== 0 ? -1 : 1;
        if (this.length > bi.length) {
            return 1 * signed;
        }
        if (this.length < bi.length) {
            return -1 * signed;
        }
        for (var i = this.length - 1; i >= 0; i--) {
            var a = this.words[i] | 0;
            var b = bi.words[i] | 0;
            if (a === b)
                continue;
            if (a < b) {
                return -1 * signed;
            }
            return 1 * signed;
        }
        return 0;
    };
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
    BigInteger.prototype.bitLength = function () {
        function clz32(x) {
            // Let n be ToUint32(x).
            // Let p be the number of leading zero bits in
            // the 32-bit binary representation of n.
            // Return p.
            if (x == null || x === 0) {
                return 32;
            }
            return 31 - Math.floor(Math.log(x >>> 0) * Math.LOG2E);
        }
        var w = this.words[this.length - 1];
        var hi = 32 - clz32(w);
        return (this.length - 1) * WORD_SIZE + hi;
    };
    BigInteger.prototype.byteLength = function () {
        return Math.ceil(this.bitLength() / 8);
    };
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
    BigInteger.prototype.and = function (num) {
        return this.words[0] & num;
    };
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
    BigInteger.prototype.shr = function (bits) {
        var h = 0;
        var r = bits % WORD_SIZE;
        var s = Math.min((bits - r) / WORD_SIZE, this.length);
        var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
        h -= s;
        h = Math.max(0, h);
        if (s === 0) {
            // No-op, we should not move anything at all
        }
        else if (this.length > s) {
            for (var i = 0; i < this.length - s; i++) {
                this.words[i] = this.words[i + s];
            }
            this.words.length -= s;
        }
        else {
            this.words = [0];
        }
        var carry = 0;
        for (var i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
            var word = this.words[i] | 0;
            this.words[i] = (carry << (WORD_SIZE - r)) | (word >>> r);
            carry = word & mask;
        }
        this.strip();
    };
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
    BigInteger.prototype.toArray = function (endian, length) {
        if (endian === void 0) { endian = 'le'; }
        if (length === void 0) { length = 0; }
        var byteLength = this.byteLength();
        var reqLength = length || Math.max(1, byteLength);
        var result = new Array(reqLength);
        var q = this.clone();
        var i;
        if (endian !== 'le') {
            // Assume big-endian
            for (i = 0; i < reqLength - byteLength; i++) {
                result[i] = 0;
            }
            for (i = 0; !q.isZero(); i++) {
                var b = q.and(0xff);
                q.shr(8);
                result[reqLength - i - 1] = b;
            }
        }
        else {
            for (i = 0; !q.isZero(); i++) {
                var b = q.and(0xff);
                q.shr(8);
                result[i] = b;
            }
            for (; i < reqLength; i++) {
                result[i] = 0;
            }
        }
        return result;
    };
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
    BigInteger.prototype.fromArray = function (arr, endian) {
        if (endian === void 0) { endian = 'le'; }
        // Perhaps a Uint8Array
        if (arr.length <= 0) {
            this.words = [0];
            return this;
        }
        var length = Math.ceil(arr.length / 3);
        this.words = new Array(length);
        for (var i = 0; i < length; i++) {
            this.words[i] = 0;
        }
        var off = 0;
        if (endian === 'be') {
            for (var i = arr.length - 1, j = 0; i >= 0; i -= 3) {
                var w = arr[i] | (arr[i - 1] << 8) | (arr[i - 2] << 16);
                this.words[j] |= (w << off) & 0x3ffffff;
                this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
                off += 24;
                if (off >= 26) {
                    off -= 26;
                    j++;
                }
            }
        }
        else {
            for (var i = 0, j = 0; i < arr.length; i += 3) {
                var w = arr[i] | (arr[i + 1] << 8) | (arr[i + 2] << 16);
                this.words[j] |= (w << off) & 0x3ffffff;
                this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
                off += 24;
                if (off >= 26) {
                    off -= 26;
                    j++;
                }
            }
        }
        this.strip();
    };
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
    BigInteger.prototype.abs = function () {
        this.negative = 0;
    };
    BigInteger.prototype.expand = function (size) {
        while (this.length < size) {
            this.words[this.words.length++] = 0;
        }
    };
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
    BigInteger.prototype.twos = function (bitSize) {
        if (this.negative !== 0) {
            this.abs();
            this.not(bitSize);
            this.add(1);
        }
    };
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
    BigInteger.prototype.not = function (bitSize) {
        var bytesNeeded = Math.ceil(bitSize / WORD_SIZE) | 0;
        var bitsLeft = bitSize % WORD_SIZE;
        // Extend the buffer with leading zeroes
        this.expand(bytesNeeded);
        if (bitsLeft > 0) {
            bytesNeeded--;
        }
        // Handle complete words
        var i = 0;
        for (; i < bytesNeeded; i++) {
            this.words[i] = ~this.words[i] & 0x3ffffff;
        }
        // Handle the residue
        if (bitsLeft > 0) {
            this.words[i] = ~this.words[i] & (0x3ffffff >> (WORD_SIZE - bitsLeft));
        }
        // And remove leading zeroes
        this.strip();
    };
    return BigInteger;
}()); /*</function>*/
    /*<function name="UInt64" depend="BigInteger">*/
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
        this.value = new BigInteger(value);
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
    /*<function name="Int64" depend="BigInteger">*/
var Int64 = (function () {
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
    function Int64(value) {
        this.value = new BigInteger(value);
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
     * @example Int64.compare():base
      ```js
      var a = new jints.Int64('0x12345');
      var b = new jints.Int64('0x12345');
      console.log(jints.Int64.compare(a, b));
      // > 0
      ```
     */
    Int64.compare = function (a, b) {
        return a.value.compare(b.value);
    };
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
    Int64.hi = function (num) {
        return num.high;
    };
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
    Int64.lo = function (num) {
        return num.low;
    };
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
    Int64.join = function (high, low) {
        var result = new Int64(0);
        var arr8 = new Uint8Array(new Int32Array([low, high]).buffer);
        result.value.fromArray(arr8);
        if (high < 0) {
            result.value.negative = 1;
            result.value.twos(64);
            result.value.negative = 1;
        }
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
    Int64.prototype.toString = function (radix) {
        if (radix === void 0) { radix = 10; }
        return this.value.toString(radix);
    };
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
    Int64.prototype.toArray = function (endian) {
        if (endian === void 0) { endian = 'le'; }
        var c = this.value.clone();
        c.twos(64);
        return c.toArray(endian, 8);
    };
    return Int64;
}()); /*</function>*/
    /*<function name="BigMath">*/
/**
 * 大数相减
 *
 * @param a 减数
 * @param b 被减数
 * @return 返回余数
 * @example sub():base
  ```js
  console.log(jints.BigMath.sub('1010', '101').toString());
  // > 909
  console.log(jints.BigMath.sub('-1010', '-101').toString());
  // > -909
  console.log(jints.BigMath.sub('-101', '-1010').toString());
  // > 909
  console.log(jints.BigMath.sub('1010', '-101').toString());
  // > 1111
  console.log(jints.BigMath.sub('-1010', '101').toString());
  // > -1111
  console.log(jints.BigMath.sub('-101', '101').toString());
  // > -202
  console.log(jints.BigMath.sub('101', '101').toString());
  // > 0
  console.log(jints.BigMath.sub('0x3ffffffffffffff', '0x3ffff').toString(16));
  // > 3fffffffffc0000
  console.log(jints.BigMath.sub('0x1234567890abcdef', '11259376').toString(16));
  // > 123456788fffffff
  console.log(jints.BigMath.sub('0', '0x3fffffffc0000000400000000000000000000000400000000000000000').toString(16));
  // > -3fffffffc0000000400000000000000000000000400000000000000000
  ```
 */
function sub(a, b) {
    if (!(a instanceof BigInteger)) {
        a = new BigInteger(a);
    }
    if (!(b instanceof BigInteger)) {
        b = new BigInteger(b);
    }
    // a - (-b) = a + b
    if (b.negative !== 0) {
        b.negative = 0;
        var r_1 = add(a, b);
        b.negative = 1;
        return r_1;
        // -a - b = -(a + b)
    }
    else if (a.negative !== 0) {
        a.negative = 0;
        var r_2 = add(a, b);
        a.negative = 1;
        r_2.negative = 1;
        return r_2;
    }
    // At a point both numbers are positive
    var cmp = a.compare(b);
    // Optimization - zeroify
    if (cmp === 0) {
        return new BigInteger();
    }
    // a > b
    var ac;
    var bc;
    if (cmp > 0) {
        ac = a.clone();
        bc = b.clone();
    }
    else {
        bc = a.clone();
        ac = b.clone();
    }
    var result = ac.clone();
    var carry = 0;
    var i = 0;
    var r;
    for (i = 0; i < bc.length; i++) {
        r = (ac.words[i] | 0) - (bc.words[i] | 0) + carry;
        carry = r >> 26;
        result.words[i] = r & 0x3ffffff;
    }
    for (; carry !== 0 && i < ac.length; i++) {
        r = (ac.words[i] | 0) + carry;
        carry = r >> 26;
        result.words[i] = r & 0x3ffffff;
    }
    // Copy rest of the words
    if (carry === 0 && i < ac.length && cmp <= 0) {
        for (; i < ac.length; i++) {
            result.words[i] = ac.words[i];
        }
    }
    if (cmp < 0 && !result.isZero()) {
        result.negative = 1;
    }
    return result;
}
/**
 * 大数相减
 *
 * @param a 减数
 * @param b 被减数
 * @return 返回余数
 * @example add():base
  ```js
  console.log(jints.BigMath.add('1010', '101').toString());
  // > 1111
  console.log(jints.BigMath.add('1010', '-101').toString());
  // > 909
  console.log(jints.BigMath.add('0xfffffffffffff', '101').toString());
  // > 4503599627370596
  console.log(jints.BigMath.add('1', '6277101735386680763835789423207666416083908700390324961279').toString());
  // > 6277101735386680763835789423207666416083908700390324961280
  console.log(jints.BigMath.add('6277101735386680763835789423207666416083908700390324961279', '1').toString());
  // > 6277101735386680763835789423207666416083908700390324961280
  ```
 */
function add(a, b) {
    if (!(a instanceof BigInteger)) {
        a = new BigInteger(a);
    }
    if (!(b instanceof BigInteger)) {
        b = new BigInteger(b);
    }
    // negative + positive
    if (a.negative !== 0 && b.negative === 0) {
        a.negative = 0;
        var r_3 = sub(a, b);
        a.negative = 1;
        r_3.negative ^= 1;
        return r_3;
        // positive + negative
    }
    else if (a.negative === 0 && b.negative !== 0) {
        b.negative = 0;
        var r_4 = sub(a, b);
        b.negative = 1;
        return r_4;
    }
    // a.length > b.length
    var ac;
    var bc;
    if (a.length > b.length) {
        ac = a.clone();
        bc = b.clone();
    }
    else {
        bc = a.clone();
        ac = b.clone();
    }
    var carry = 0;
    var i = 0;
    var result = ac.clone();
    var r;
    for (i = 0; i < bc.length; i++) {
        r = (ac.words[i] | 0) + (bc.words[i] | 0) + carry;
        result.words[i] = r & 0x3ffffff;
        carry = r >>> 26;
    }
    for (; carry !== 0 && i < ac.length; i++) {
        r = (ac.words[i] | 0) + carry;
        result.words[i] = r & 0x3ffffff;
        carry = r >>> 26;
    }
    if (carry !== 0) {
        result.words[result.length] = carry;
        // Copy the rest of the words
    }
    else if (a.length <= b.length) {
        for (; i < ac.length; i++) {
            result.words[i] = ac.words[i];
        }
    }
    return result;
}
var BigMath = {
    add: add,
    sub: sub,
}; /*</function>*/
  var exports = {
      BigInteger: BigInteger,
      UInt64: UInt64,
      Int64: Int64,
      BigMath: BigMath,
  };
  /* istanbul ignore next */
  if (typeof define === 'function') {
    if (define.amd || define.cmd) {
      define(function() {
        return exports;
      });
    }
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  } else {
    window[exportName] = exports;
  }
})('jints');