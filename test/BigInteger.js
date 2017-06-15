
global.jints = require('../jints.js');
      

describe("src/ts/BigInteger.ts", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  
  

  it("parseText():base", function () {
    examplejs_printLines = [];
     examplejs_print(jints.BigInteger.parseText('123', 0, 3, 10));
     assert.equal(examplejs_printLines.join("\n"), "123"); examplejs_printLines = [];

     examplejs_print(jints.BigInteger.parseText('123', 1, 3, 10));
     assert.equal(examplejs_printLines.join("\n"), "23"); examplejs_printLines = [];

     examplejs_print(jints.BigInteger.parseText('123', 1, 3, 16));
     assert.equal(examplejs_printLines.join("\n"), "35"); examplejs_printLines = [];

     examplejs_print(jints.BigInteger.parseText('Aa', 0, 2, 16));
     assert.equal(examplejs_printLines.join("\n"), "170"); examplejs_printLines = [];
  });
          
  it("BigInteger():value is undefined", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger();
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
          
  it("BigInteger():value is string", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger('123');
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "123"); examplejs_printLines = [];

    var bi = new jints.BigInteger('');
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
          
  it("BigInteger():value is hex", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger('0xff');
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "255"); examplejs_printLines = [];
  });
          
  it("BigInteger():value is oct", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger('0o77');
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "63"); examplejs_printLines = [];
  });
          
  it("BigInteger():value is bin", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger('-0b1111');
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "-15"); examplejs_printLines = [];
  });
          
  it("BigInteger():value is number", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger(1000.12);
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "1000"); examplejs_printLines = [];

    var bi = new jints.BigInteger(-1000.12);
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "-1000"); examplejs_printLines = [];

    var bi = new jints.BigInteger(0x4000000);
    examplejs_print(bi.toString(16));
    assert.equal(examplejs_printLines.join("\n"), "4000000"); examplejs_printLines = [];

    var bi = new jints.BigInteger(0x10000000000000);
    examplejs_print(bi.toString(16));
    assert.equal(examplejs_printLines.join("\n"), "10000000000000"); examplejs_printLines = [];
  });
          
  it("parse():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger();
    bi.parse('0123456789abcdef', 16);
    examplejs_print(bi.toString(16));
    assert.equal(examplejs_printLines.join("\n"), "123456789abcdef"); examplejs_printLines = [];

    bi.parse('0123456789abcdef', 16, 3);
    examplejs_print(bi.toString(16));
    assert.equal(examplejs_printLines.join("\n"), "3456789abcdef"); examplejs_printLines = [];
  });
          
  it("parse():coverage", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger();
    bi.parse('zzzzzzzzzzzz', 36);
    examplejs_print(bi.toString(36));
    assert.equal(examplejs_printLines.join("\n"), "zzzzzzzzzzzz"); examplejs_printLines = [];

    bi.parse('2821122424961', 10);
    examplejs_print(bi.toString(10));
    assert.equal(examplejs_printLines.join("\n"), "2821122424961"); examplejs_printLines = [];
  });
          
  it("div():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger(101);
    bi.div(2);
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "50"); examplejs_printLines = [];

    var bi = new jints.BigInteger(101);
    bi.div(3);
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "33"); examplejs_printLines = [];
  });
          
  it("mul():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger(101);
    bi.mul(2);
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "202"); examplejs_printLines = [];

    var bi = new jints.BigInteger(7);
    bi.mul(3);
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "21"); examplejs_printLines = [];
  });
          
  it("add():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger(101);
    bi.add(2);
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "103"); examplejs_printLines = [];

    var bi = new jints.BigInteger(7);
    bi.add(3);
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "10"); examplejs_printLines = [];
  });
          
  it("add():coverage", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger(0x4000000 - 1);
    bi.add(0x4000000 - 2);
    examplejs_print(bi.toString(16));
    assert.equal(examplejs_printLines.join("\n"), "7fffffd"); examplejs_printLines = [];
  });
          
  it("mod():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger(101);
    examplejs_print(bi.mod(2));
    assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];

    var bi = new jints.BigInteger(7);
    examplejs_print(bi.mod(3));
    assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];
  });
          
  it("mod():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger(0);
    examplejs_print(bi.isZero());
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];

    var bi = new jints.BigInteger(1);
    examplejs_print(bi.isZero());
    assert.equal(examplejs_printLines.join("\n"), "false"); examplejs_printLines = [];
  });
          
  it("clone():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger('1234567890000000000000000');
    examplejs_print(bi.clone().toString());
    assert.equal(examplejs_printLines.join("\n"), "1234567890000000000000000"); examplejs_printLines = [];
  });
          
  it("toString():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger('1234567890000000000000000');
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "1234567890000000000000000"); examplejs_printLines = [];

    examplejs_print(bi.toString(16));
    assert.equal(examplejs_printLines.join("\n"), "1056e0f3635fbb7d50000"); examplejs_printLines = [];

    examplejs_print(bi.toString(36));
    assert.equal(examplejs_printLines.join("\n"), "5l1ec1qoa123tvk0"); examplejs_printLines = [];
  });
          
  it("compare():base", function () {
    examplejs_printLines = [];
    var a = new jints.BigInteger('0xfffffff');
    var b = new jints.BigInteger('0xfffffff');
    examplejs_print(a.compare(b));
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];

    b.add(1);
    examplejs_print(a.compare(b));
    assert.equal(examplejs_printLines.join("\n"), "-1"); examplejs_printLines = [];

    a.add(2);
    examplejs_print(a.compare(b));
    assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];

    var a = new jints.BigInteger(2);
    var b = new jints.BigInteger(1);
    examplejs_print(a.compare(b));
    assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];

    var a = new jints.BigInteger(-2);
    var b = new jints.BigInteger(-1);
    examplejs_print(a.compare(b));
    assert.equal(examplejs_printLines.join("\n"), "-1"); examplejs_printLines = [];
  });
          
  it("compare():signed", function () {
    examplejs_printLines = [];
    var a = new jints.BigInteger('0xfffffff');
    var b = new jints.BigInteger('0xfffffff');

    b.negative = 1;
    examplejs_print(a.compare(b));
    assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];

    a.negative = 1;
    examplejs_print(a.compare(b));
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];

    b.negative = 0;
    examplejs_print(a.compare(b));
    assert.equal(examplejs_printLines.join("\n"), "-1"); examplejs_printLines = [];
  });
          
  it("compare():length of words", function () {
    examplejs_printLines = [];
    var a = new jints.BigInteger('0xfffffff');
    var b = new jints.BigInteger('0xff');

    examplejs_print(a.compare(b));
    assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];

    examplejs_print(b.compare(a));
    assert.equal(examplejs_printLines.join("\n"), "-1"); examplejs_printLines = [];
  });
          
  it("bitLength():zero", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger();
    examplejs_print(bi.bitLength());
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
          
  it("and():base", function () {
    examplejs_printLines = [];
    var a = new jints.BigInteger('0x3114');
    examplejs_print(a.and(0xff).toString(16));
    assert.equal(examplejs_printLines.join("\n"), "14"); examplejs_printLines = [];
  });
          
  it("shr():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger('0b10010001000000011000000000000');
    var c = bi.clone();
    c.shr(10);
    examplejs_print(c.toString(2));
    assert.equal(examplejs_printLines.join("\n"), "1001000100000001100"); examplejs_printLines = [];

    var c = bi.clone();
    c.shr(28);
    examplejs_print(c.toString(2));
    assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];
  });
          
  it("shr():zero", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger();
    bi.shr(0);
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];

    bi.shr(26);
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];

    var bi = new jints.BigInteger(1);
    bi.shr(1);
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
          
  it("toArray():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger('0x1234567890ab');
    examplejs_print(JSON.stringify(bi.toArray()));
    assert.equal(examplejs_printLines.join("\n"), "[171,144,120,86,52,18]"); examplejs_printLines = [];

    examplejs_print(JSON.stringify(bi.toArray('be')));
    assert.equal(examplejs_printLines.join("\n"), "[18,52,86,120,144,171]"); examplejs_printLines = [];
  });
          
  it("toArray():length", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger('0x1234567890ab');
    examplejs_print(JSON.stringify(bi.toArray('be', 8)));
    assert.equal(examplejs_printLines.join("\n"), "[0,0,18,52,86,120,144,171]"); examplejs_printLines = [];

    examplejs_print(JSON.stringify(bi.toArray('le', 8)));
    assert.equal(examplejs_printLines.join("\n"), "[171,144,120,86,52,18,0,0]"); examplejs_printLines = [];
  });
          
  it("fromArray():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger();
    bi.fromArray([1, 2, 3, 4, 5, 6]);
    examplejs_print(bi.toString(16));
    assert.equal(examplejs_printLines.join("\n"), "60504030201"); examplejs_printLines = [];
  });
          
  it("fromArray():coverage", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger();
    bi.fromArray([]);
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];

    var bi = new jints.BigInteger();
    bi.fromArray([1, 2, 3, 4, 5, 6], 'be');
    examplejs_print(bi.toString(16));
    assert.equal(examplejs_printLines.join("\n"), "10203040506"); examplejs_printLines = [];
  });
          
  it("abs():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger(-1);
    bi.abs();
    examplejs_print(bi.toString());
    assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];
  });
          
  it("twos():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger('-0b1010');
    bi.twos(8);
    examplejs_print(bi.toString(2));
    assert.equal(examplejs_printLines.join("\n"), "11110110"); examplejs_printLines = [];
  });
          
  it("twos():unsigned", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger('0b1010');
    bi.twos(8);
    examplejs_print(bi.toString(2));
    assert.equal(examplejs_printLines.join("\n"), "1010"); examplejs_printLines = [];
  });
          
  it("not():base", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger('0b1010');
    bi.not(8);
    examplejs_print(bi.toString(2));
    assert.equal(examplejs_printLines.join("\n"), "11110101"); examplejs_printLines = [];
  });
          
  it("not():coverage", function () {
    examplejs_printLines = [];
    var bi = new jints.BigInteger('0b1010');
    bi.not(26);
    examplejs_print(bi.toString(2));
    assert.equal(examplejs_printLines.join("\n"), "11111111111111111111110101"); examplejs_printLines = [];

    var bi = new jints.BigInteger('0b1010');
    bi.not(28);
    examplejs_print(bi.toString(2));
    assert.equal(examplejs_printLines.join("\n"), "1111111111111111111111110101"); examplejs_printLines = [];
  });
          
});
         