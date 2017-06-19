import { BigInteger } from './BigInteger'

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
function sub(a: BigInteger | number | string, b: BigInteger | number | string): BigInteger {
  if (!(a instanceof BigInteger)) {
    a = new BigInteger(a)
  }
  if (!(b instanceof BigInteger)) {
    b = new BigInteger(b)
  }

  // a - (-b) = a + b
  if (b.negative !== 0) {
    b.negative = 0
    let r = add(a, b)
    b.negative = 1
    return r

    // -a - b = -(a + b)
  } else if (a.negative !== 0) {
    a.negative = 0
    let r = add(a, b)
    a.negative = 1
    r.negative = 1
    return r
  }

  // At a point both numbers are positive
  var cmp = a.compare(b)

  // Optimization - zeroify
  if (cmp === 0) {
    return new BigInteger()
  }

  // a > b
  let ac: BigInteger
  let bc: BigInteger
  if (cmp > 0) {
    ac = a.clone()
    bc = b.clone()
  } else {
    bc = a.clone()
    ac = b.clone()
  }

  let result = ac.clone()

  let carry = 0
  let i = 0
  let r: number
  for (i = 0; i < bc.length; i++) {
    r = (ac.words[i] | 0) - (bc.words[i] | 0) + carry
    carry = r >> 26
    result.words[i] = r & 0x3ffffff
  }
  for (; carry !== 0 && i < ac.length; i++) {
    r = (ac.words[i] | 0) + carry
    carry = r >> 26
    result.words[i] = r & 0x3ffffff
  }

  // Copy rest of the words
  if (carry === 0 && i < ac.length && cmp <= 0) {
    for (; i < ac.length; i++) {
      result.words[i] = ac.words[i]
    }
  }

  if (cmp < 0 && !result.isZero()) {
    result.negative = 1
  }
  return result
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
function add(a: BigInteger | number | string, b: BigInteger | number | string): BigInteger {
  if (!(a instanceof BigInteger)) {
    a = new BigInteger(a)
  }
  if (!(b instanceof BigInteger)) {
    b = new BigInteger(b)
  }

  // negative + positive
  if (a.negative !== 0 && b.negative === 0) {
    a.negative = 0
    let r = sub(a, b)
    a.negative = 1
    r.negative ^= 1
    return r

    // positive + negative
  } else if (a.negative === 0 && b.negative !== 0) {
    b.negative = 0
    let r = sub(a, b)
    b.negative = 1
    return r
  }

  // a.length > b.length
  let ac: BigInteger
  let bc: BigInteger
  if (a.length > b.length) {
    ac = a.clone()
    bc = b.clone()
  } else {
    bc = a.clone()
    ac = b.clone()
  }

  let carry = 0
  let i = 0
  let result = ac.clone()
  let r: number
  for (i = 0; i < bc.length; i++) {
    r = (ac.words[i] | 0) + (bc.words[i] | 0) + carry
    result.words[i] = r & 0x3ffffff
    carry = r >>> 26
  }
  for (; carry !== 0 && i < ac.length; i++) {
    r = (ac.words[i] | 0) + carry
    result.words[i] = r & 0x3ffffff
    carry = r >>> 26
  }

  if (carry !== 0) {
    result.words[result.length] = carry
    // Copy the rest of the words
  } else if (a.length <= b.length) {
    for (; i < ac.length; i++) {
      result.words[i] = ac.words[i]
    }
  }

  return result
}

let BigMath = {
  add: add,
  sub: sub,
} /*</function>*/

export {
  BigMath
}