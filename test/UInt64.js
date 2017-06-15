
global.jints = require('../jints.js');
      

describe("src/ts/UInt64.ts", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  
  

  it("UInt64():base", function () {
    examplejs_printLines = [];
    var uint64 = new jints.UInt64('0x12345');
    examplejs_print(uint64.toString());
    assert.equal(examplejs_printLines.join("\n"), "74565"); examplejs_printLines = [];
    examplejs_print(uint64.low);
    assert.equal(examplejs_printLines.join("\n"), "74565"); examplejs_printLines = [];
    examplejs_print(uint64.high);
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
          
  it("UInt64():-1", function () {
    examplejs_printLines = [];
    var uint64 = new jints.UInt64(-1);
    examplejs_print(uint64.toString(16));
    assert.equal(examplejs_printLines.join("\n"), "ffffffffffffffff"); examplejs_printLines = [];
  });
          
  it("UInt64.compare():base", function () {
    examplejs_printLines = [];
    var a = new jints.UInt64('0x12345');
    var b = new jints.UInt64('0x12345');
    examplejs_print(jints.UInt64.compare(a, b));
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
          
  it("UInt64.hi():base", function () {
    examplejs_printLines = [];
    var a = new jints.UInt64('0x12345');
    examplejs_print(jints.UInt64.hi(a));
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
          
  it("UInt64.lo():base", function () {
    examplejs_printLines = [];
    var a = new jints.UInt64('0x12345');
    examplejs_print(jints.UInt64.lo(a));
    assert.equal(examplejs_printLines.join("\n"), "74565"); examplejs_printLines = [];
  });
          
  it("UInt64.join():base", function () {
    examplejs_printLines = [];
    var a = new jints.UInt64.join(1234, 5678);
    examplejs_print(a.low);
    assert.equal(examplejs_printLines.join("\n"), "5678"); examplejs_printLines = [];
    examplejs_print(a.high);
    assert.equal(examplejs_printLines.join("\n"), "1234"); examplejs_printLines = [];
    examplejs_print(a.toString());
    assert.equal(examplejs_printLines.join("\n"), "5299989648942"); examplejs_printLines = [];
  });
          
  it("toString():base", function () {
    examplejs_printLines = [];
    var a = new jints.UInt64.join(1234, 5678);
    examplejs_print(a.toString(16));
    assert.equal(examplejs_printLines.join("\n"), "4d20000162e"); examplejs_printLines = [];
  });
          
  it("toArray():base", function () {
    examplejs_printLines = [];
    var a = new jints.UInt64.join(1234, 5678);
    examplejs_print(JSON.stringify(a.toArray()));
    assert.equal(examplejs_printLines.join("\n"), "[46,22,0,0,210,4,0,0]"); examplejs_printLines = [];

    examplejs_print(JSON.stringify(a.toArray('be')));
    assert.equal(examplejs_printLines.join("\n"), "[0,0,4,210,0,0,22,46]"); examplejs_printLines = [];
  });
          
});
         