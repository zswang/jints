(function (exportName) {
  /**
   * @file jints
   *
   * Big Integer
   * @author
   *   zswang (http://weibo.com/zswang)
   * @version 0.0.4
   * @date 2015-11-03
   */
  /**
   * 进制字符串
   */
  var scaleChars = '0123456789abcdefghijklmnopqrstuvwxyz';
  var exports = {};
  /**
   * 向前补零 '1',5 -> '00001'
   *
   * @param {string} n 整数字符串
   * @param {number} len 长度
   * @return {string} 返回补零后的字符串
   */
  function fullZero(n, len) {
    return new Array(len - n.length + 1).join('0') + n;
  }
  exports.fullZero = fullZero;
  /**
   * 清理整数前面无效的零 '000000001' -> '1'
   *
   * @param {string} n 整数字符串
   * @return {string} 返回格式化后的整数字符串
   */
  function format(n) {
    return String(n).replace(/^0+(.+)$/, '$1').toLowerCase();
  }
  /**
   * 比较两个整数的大小 '1','0' -> +1
   *
   * @param {string} a
   * @param {string} b
   * @return {number} a > b 返回 +1, a === b 返回 0, a < b 返回 -1
   */
  function compare(a, b) {
    var i = Math.max(a.length, b.length);
    a = fullZero(a, i);
    b = fullZero(b, i);
    for (i = 0; i < a.length; i++) {
      var ta = scaleChars.indexOf(a.charAt(i));
      var tb = scaleChars.indexOf(b.charAt(i));
      if (ta < tb) {
        return -1;
      }
      if (ta > tb) {
        return +1;
      }
    }
    return 0;
  }
  //console.log(compare('01', '1'));
  //console.log(compare('0a1', 'ab1'));
  /**
   * 无限整数加法
   *
   * @param {string} a 整数1
   * @param {string} b 整数2
   * @param {number=} scale 进制 2-36, 默认 10
   * @return {string} 返回两个数的和
   */
  function add(a, b, scale) {
    scale = scale || 10;
    if (scale < 2 || scale > 36) {
      return;
    }
    a = format(a);
    b = format(b);
    var i = Math.max(a.length, b.length);
    var t = 0;
    var result = [];
    a = fullZero(a, i);
    b = fullZero(b, i);
    while (i--) {
      t += scaleChars.indexOf(a.charAt(i));
      t += scaleChars.indexOf(b.charAt(i));
      result.unshift(scaleChars.charAt(t % scale));
      t = parseInt(t / scale);
    }
    if (t) {
      result.unshift(scaleChars.charAt(t % scale));
    }
    return format(result.join(''));
  }
  exports.add = add;
  //console.log(add('19', '1234', 10));
  /**
   * 无限位数乘法函数,单个数乘无限进制整数
   *
   * @param {string} n 整数
   * @param {number} b 单个数
   * @param {number} scale 进制 2-36
   * @return {string} 返回n和b的乘积
   */
  function byteMul(n, b, scale) {
    var result = [];
    var t = 0;
    var i = n.length;
    while (i--) {
      t = scaleChars.indexOf(n.charAt(i)) * b + t;
      result.unshift(scaleChars.charAt(t % scale));
      t = t / scale;
    }
    if (t) {
      result.unshift(scaleChars.charAt(t % scale));
    }
    return result.join('');
  }
  //console.log(byteMul('555', 12, 10));
  //console.log(byteMul('25', 8, 10));
  /**
   * 无限整数乘法
   *
   * @param {string} a 整数1
   * @param {string} b 整数2
   * @param {number=} scale 进制 2-36, 默认 10
   * @return {string} 返回两个数的乘积
   */
  function mul(a, b, scale) {
    scale = scale || 10;
    if (scale < 2 || scale > 36) {
      return;
    }
    a = format(a);
    b = format(b);
    var t = '';
    var result = '';
    var i = b.length;
    while (i--) {
      result = add(result, byteMul(a, scaleChars.indexOf(b.charAt(i)), scale) + t, scale);
      t += '0';
    }
    return result;
  }
  exports.mul = mul;
  //console.log(mul('555', '12', 10)); // 6660
  //console.log(mul('25', '8', 10)); // 200
  /**
   * 无限整数的次方
   *
   * @param {string} base 指数
   * @param {number} exponent 幂数
   * @param {number=} scale 进制 2-36, 默认 10
   * @return {string} 返回base的exponent次方
   */
  function power(base, exponent, scale) {
    scale = scale || 10;
    if (scale < 2 || scale > 36 || exponent < 0) {
      return;
    }
    base = format(base);
    var result = '1';
    var i = exponent;
    while (i--) {
      result = mul(result, base, scale);
    }
    return result;
  }
  exports.power = power;
  //console.log(power('2', 10, 10)); // 1024
  /**
   * 将一个字符转换为指定进制
   *
   * @param {string} c 单个字符
   * @param {number} from 来源进制 2-36
   * @param {number} to 目标进制 2-36
   * @return {string} 返回转换后的数字
   */
  function charDigit(c, from, to) {
    var result = '0';
    var t = '0';
    while (compare(t, c) < 0) {
      result = add(result, '1', to);
      t = add(t, '1', from);
    }
    return result;
  }
  //console.log(charDigit('7', 10, 2)); // 111
  /**
   * 无限整数进制间的转换
   *
   * @param {string} n 整数
   * @param {number} from 来源进制 2-36
   * @param {number} to 目标进制 2-36
   * @return {string} 返回转换后的数字
   */
  function digit(n, from, to) {
    if (from < 2 || from > 36 || to < 2 || to > 36) {
      return;
    }
    n = format(n);
    if (from === to) {
      return n;
    }
    if (n === '0') {
      return n;
    }
    var result = '';
    var base = '1';
    var t = '1';
    var m = scaleChars.charAt(from - 1);
    var l = n.length;
    while (compare(t, m) <= 0) {
      base = add(base, '1', to);
      t = add(t, '1', from);
    }
    for (var i = 0; i < l; i++) {
      result = add(result, mul(charDigit(n.charAt(l - i - 1), from, to), power(base, i, to), to), to);
    }
    return result;
  }
  exports.digit = digit;
  //console.log(digit('1024', 10, 2)); // 10000000000
  //console.log(digit('7', 10, 2)); // 111
  //console.log(digit('askdjfas91231as', 36, 7)); // 43425343430315560320062333616102
  //console.log(digit(digit('askdjfas91231as', 36, 7), 7, 36)); // askdjfas91231as
  /**
   * 无限整数减法
   *
   * @param {string} a 减数
   * @param {string} b 被减数
   * @param {number=} scale 进制 2-36, 默认 10
   * @return {string} 返回转换后的数字
   */
  function sub(a, b, scale) {
    scale = scale || 10;
    if (scale < 2 || scale > 36) {
      return;
    }
    a = format(a);
    b = format(b);
    var i = Math.max(a.length, b.length);
    var result = [];
    a = fullZero(a, i);
    b = fullZero(b, i);
    if (a < b) {
      return;
    }
    var t = 0;
    while (i-- > 0) {
      t = scaleChars.indexOf(a.charAt(i)) - t - scaleChars.indexOf(b.charAt(i));
      result.unshift(scaleChars.charAt((t + scale) % scale));
      t = t >= 0 ? 0 : 1;
    }
    result.unshift(scaleChars.charAt(t % scale));
    return format(result.join(''));
  }
  exports.sub = sub;
  //console.log(sub('32', '3', 10)); // 29
  //console.log(sub('1234', '234', 10)); // 1000
  //console.log(sub('23', '17', 10)); // 6
  //console.log(sub('101', '10', 2)); // 11
  /**
   * 无限整数除法
   *
   * @param {string} a 除数
   * @param {string} b 被除数
   * @param {number=} scale 进制 2-36, 默认 10
   * @return {Array} 返回[商数,余数]
   */
  function div(a, b, scale) {
    scale = scale || 10;
    if (scale < 2 || scale > 36) {
      return;
    }
    b = format(b);
    if (b === '0') {
      return;
    }
    a = format(a);
    var result = 0;
    while (compare(a, b) >= 0) {
      var t = b;
      var k = '1';
      while (compare(a, t + '0') >= 0) {
        t += '0';
        k += '0';
      }
      a = sub(a, t, scale);
      result = add(result, k, scale);
    }
    return [result, a];
  }
  exports.div = div;
  //console.log(div('32', '3', 10)); // ['10', '2']
  /**
   * 无限整数除法，如果是循环小数，则在循环部分加上括号
   *
   * @param {string} a 除数
   * @param {string} b 被除数
   * @param {number=} scale 进制 2-36, 默认 10
   * @return {Array} 返回[商数,余数]
   */
  function div2(a, b, scale) {
    scale = scale || 10;
    if (scale < 2 || scale > 36) {
      return;
    }
    b = format(b);
    if (b === '0') {
      return;
    }
    a = format(a);
    var num = {};
    var i = 0;
    a = div(a, b, scale);
    var result = '';
    var x = a[0];
    a = a[1];
    while (a !== '0' && !(a in num)) {
      num[a] = i++;
      a = div(a + '0', b, scale);
      result += a[0];
      a = a[1];
    }
    if (a !== '0') {
      i = num[a];
      return x + '.' + result.substring(0, i) + '(' + result.substring(i) + ')';
    }
    return x;
  }
  exports.div2 = div2;
  //console.log(div2(1, 3)); // 0.(3)
  //console.log(div2(1, 4)); // 0.25
  //console.log(div2(8, 29)); // 0.(2758620689655172413793103448)
  //console.log(div2(58, 7)); // 8.(285714)
  //console.log(div2('11010', '111', 2)); // 11.(101)
  if (typeof define === 'function') {
    if (define.amd || define.cmd) {
      define(function () {
        return exports;
      });
    }
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  } else {
    window[exportName] = exports;
  }
})('jints');