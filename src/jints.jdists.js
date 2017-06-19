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

  /*<jdists encoding="regex" pattern="/BigInteger_\d+\./g" replacement="">*/
    /*<jdists encoding="fndep" import="./js/BigInteger.js" depend="BigInteger" />*/
    /*<jdists encoding="fndep" import="./js/UInt64.js" depend="UInt64" />*/
    /*<jdists encoding="fndep" import="./js/Int64.js" depend="Int64" />*/
    /*<jdists encoding="fndep" import="./js/BigMath.js" depend="BigMath" />*/
  /*</jdists>*/

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