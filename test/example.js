var assert = require('should');
var jints = require('../.');
var util = require('util');
var printValue;
function print(value) {
  if (typeof printValue !== 'undefined') {
    throw new Error('Test case does not match.');
  }
  printValue = value;
}
describe("./src/jints.js", function () {
  printValue = undefined;
  it("fullZero():base", function () {
    print(jints.fullZero('af', 5));
    assert.equal(printValue, "000af"); printValue = undefined;
    print(jints.fullZero('AF', 5));
    assert.equal(printValue, "000AF"); printValue = undefined;
    print(jints.fullZero('abcdef', 5));
    assert.equal(printValue, "abcdef"); printValue = undefined;
  });
  it("format():base", function () {
    print(jints.format('000af'));
    assert.equal(printValue, "af"); printValue = undefined;
    print(jints.format('abcdef'));
    assert.equal(printValue, "abcdef"); printValue = undefined;
  });
  it("format():LowerCase", function () {
    print(jints.format('000AF'));
    assert.equal(printValue, "af"); printValue = undefined;
  });
  it("format():base", function () {
    print(jints.compare('af', '00af'));
    assert.equal(printValue, "0"); printValue = undefined;
    print(jints.compare('af', 'ae'));
    assert.equal(printValue, "1"); printValue = undefined;
    print(jints.compare('ae', 'af'));
    assert.equal(printValue, "-1"); printValue = undefined;
  });
});
