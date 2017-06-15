# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

jints
--------
JavaScript Big Integer

## BinInteger

```js
var bi = new jints.BigInteger('0x1234567890abcdef');
console.log(bi.toString(16))
// > 1234567890abcdef
```

## Int64

<https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/Int64>

## UInt64

<https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/js-ctypes_reference/UInt64>

## License

MIT © [zswang](http://weibo.com/zswang)

[npm-url]: https://npmjs.org/package/jints
[npm-image]: https://badge.fury.io/js/jints.svg
[travis-url]: https://travis-ci.org/zswang/jints
[travis-image]: https://travis-ci.org/zswang/jints.svg?branch=master
[coverage-url]: https://coveralls.io/github/zswang/jints?branch=master
[coverage-image]: https://coveralls.io/repos/zswang/jints/badge.svg?branch=master&service=github
