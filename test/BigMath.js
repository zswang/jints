
global.jints = require('../jints.js');
      

describe("src/ts/BigMath.ts", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  
  

  it("sub():base", function () {
    examplejs_printLines = [];
  examplejs_print(jints.BigMath.sub('1010', '101').toString());
  assert.equal(examplejs_printLines.join("\n"), "909"); examplejs_printLines = [];
  examplejs_print(jints.BigMath.sub('-1010', '-101').toString());
  assert.equal(examplejs_printLines.join("\n"), "-909"); examplejs_printLines = [];
  examplejs_print(jints.BigMath.sub('-101', '-1010').toString());
  assert.equal(examplejs_printLines.join("\n"), "909"); examplejs_printLines = [];
  examplejs_print(jints.BigMath.sub('1010', '-101').toString());
  assert.equal(examplejs_printLines.join("\n"), "1111"); examplejs_printLines = [];
  examplejs_print(jints.BigMath.sub('-1010', '101').toString());
  assert.equal(examplejs_printLines.join("\n"), "-1111"); examplejs_printLines = [];
  examplejs_print(jints.BigMath.sub('-101', '101').toString());
  assert.equal(examplejs_printLines.join("\n"), "-202"); examplejs_printLines = [];
  examplejs_print(jints.BigMath.sub('101', '101').toString());
  assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  examplejs_print(jints.BigMath.sub('0x3ffffffffffffff', '0x3ffff').toString(16));
  assert.equal(examplejs_printLines.join("\n"), "3fffffffffc0000"); examplejs_printLines = [];
  examplejs_print(jints.BigMath.sub('0x1234567890abcdef', '11259376').toString(16));
  assert.equal(examplejs_printLines.join("\n"), "123456788fffffff"); examplejs_printLines = [];
  examplejs_print(jints.BigMath.sub('0', '0x3fffffffc0000000400000000000000000000000400000000000000000').toString(16));
  assert.equal(examplejs_printLines.join("\n"), "-3fffffffc0000000400000000000000000000000400000000000000000"); examplejs_printLines = [];
  });
          
  it("add():base", function () {
    examplejs_printLines = [];
  examplejs_print(jints.BigMath.add('1010', '101').toString());
  assert.equal(examplejs_printLines.join("\n"), "1111"); examplejs_printLines = [];
  examplejs_print(jints.BigMath.add('1010', '-101').toString());
  assert.equal(examplejs_printLines.join("\n"), "909"); examplejs_printLines = [];
  examplejs_print(jints.BigMath.add('0xfffffffffffff', '101').toString());
  assert.equal(examplejs_printLines.join("\n"), "4503599627370596"); examplejs_printLines = [];
  examplejs_print(jints.BigMath.add('1', '6277101735386680763835789423207666416083908700390324961279').toString());
  assert.equal(examplejs_printLines.join("\n"), "6277101735386680763835789423207666416083908700390324961280"); examplejs_printLines = [];
  examplejs_print(jints.BigMath.add('6277101735386680763835789423207666416083908700390324961279', '1').toString());
  assert.equal(examplejs_printLines.join("\n"), "6277101735386680763835789423207666416083908700390324961280"); examplejs_printLines = [];
  });
          
});
         