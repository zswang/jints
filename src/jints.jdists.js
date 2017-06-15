(function (exportName) {
  /*<jdists encoding="regex" pattern="/BigInteger_\d+\./g" replacement="">*/
    /*<jdists encoding="fndep" import="./js/BigInteger.js" depend="BigInteger" />*/
    /*<jdists encoding="fndep" import="./js/UInt64.js" depend="UInt64" />*/
    /*<jdists encoding="fndep" import="./js/Int64.js" depend="Int64" />*/
  /*</jdists>*/

  var exports = {
      BigInteger: BigInteger,
      UInt64: UInt64,
      Int64: Int64,
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