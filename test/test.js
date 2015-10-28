var assert = require('should');
var jints = require('../.');
var util = require('util');

// coverage
describe('coverage', function () {
  var data = [{
    name: 'add',
    params: ['123456', '654321', 1],
    value: undefined
  }, {
    name: 'mul',
    params: ['123456', '2', 1],
    value: undefined
  }, {
    name: 'power',
    params: ['123456', 2, 1],
    value: undefined
  }, {
    name: 'digit',
    params: ['0', 2, 7],
    value: '0'
  }, {
    name: 'digit',
    params: ['0', 1, 7],
    value: undefined
  }, {
    name: 'digit',
    params: ['aca', 18, 18],
    value: 'aca'
  }, {
    name: 'sub',
    params: ['33', '3'],
    value: '30'
  }, {
    name: 'sub',
    params: ['33', '3', 1],
    value: undefined
  }, {
    name: 'sub',
    params: ['3', '30'],
    value: undefined
  }, {
    name: 'div',
    params: ['33', '3'],
    value: ['11', '0']
  }, {
    name: 'div',
    params: ['33', '3', 1],
    value: undefined
  }, {
    name: 'div',
    params: ['33', '0'],
    value: undefined
  }, {
    name: 'div2',
    params: ['33', '3', 1],
    value: undefined
  }, {
    name: 'div2',
    params: ['33', '0'],
    value: undefined
  }, {
    name: 'div2',
    params: ['0', '3'],
    value: '0'
  }, {
    name: 'div2',
    params: ['100', '10'],
    value: '10'
  }];

  data.forEach(function (item) {
    var params = item.params.map(function (value) {
      return util.format('%j', value);
    });
    it(util.format('%s(%s) === %j', item.name, params.join(', '), item.value), function () {
      if (typeof item.value === 'object') {
        assert.equal(
          JSON.stringify(jints[item.name].apply(jints, item.params)),
          JSON.stringify(item.value)
        );
      } else {
        assert.equal(jints[item.name].apply(jints, item.params), item.value);
      }
    });
  });

});

describe('fixtures', function () {
  var data = [{
    name: 'fullZero',
    params: ['z', 5],
    value: '0000z'
  }, {
    name: 'fullZero',
    params: ['123456', 5],
    value: '123456'
  }, {
    name: 'add',
    params: ['123456', '654321'],
    value: '777777'
  }, {
    name: 'add',
    params: ['101', '11', 2],
    value: '1000'
  }, {
    name: 'add',
    params: ['ABC', '333D', 16],
    value: '3DF9'
  }, {
    name: 'mul',
    params: ['123', '3'],
    value: '369'
  }, {
    name: 'mul',
    params: ['ABC', '333D', 16],
    value: '22602CC'
  }, {
    name: 'mul',
    params: ['101010101001', '10', 2],
    value: '1010101010010'
  }, {
    name: 'power',
    params: ['12', 12],
    value: '8916100448256'
  }, {
    name: 'power',
    params: ['12', 12, 3],
    value: '122000101121222101'
  }, {
    name: 'digit',
    params: ['1024', 10, 2],
    value: '10000000000'
  }, {
    name: 'digit',
    params: ['10000000000', 2, 10],
    value: '1024'
  }, {
    name: 'sub',
    params: ['3DF9', '333D', 16],
    value: 'ABC'
  }, {
    name: 'sub',
    params: ['3DF9', 'ABC', 16],
    value: '333D'
  }, {
    name: 'div',
    params: ['3DF9', 'ABC', 16],
    value: ['5', '84D']
  }, {
    name: 'div2',
    params: ['1', '3'],
    value: '0.(3)'
  }, {
    name: 'div2',
    params: ['8', '29'],
    value: '0.(2758620689655172413793103448)'
  }, {
    name: 'div2',
    params: ['11010', '111', 2],
    value: '11.(101)'
  }];

  data.forEach(function (item) {
    var params = item.params.map(function (value) {
      return util.format('%j', value);
    });
    it(util.format('%s(%s) === %j', item.name, params.join(', '), item.value), function () {
      if (typeof item.value === 'object') {
        assert.equal(
          JSON.stringify(jints[item.name].apply(jints, item.params)),
          JSON.stringify(item.value)
        );
      } else {
        assert.equal(jints[item.name].apply(jints, item.params), item.value);
      }
    });
  });

  it('add(mul("ABC", "5", 16), "84D", 16) === "3DF9"', function () {
    assert.equal(jints.add(jints.mul("ABC", "5", 16), "84D", 16), "3DF9");
  });

});