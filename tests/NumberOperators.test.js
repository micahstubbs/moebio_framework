
/* globals mo */
describe("NumberOperators", function() {
  it("should translate binary", function() {
    var num = mo.NumberOperators.numberFromBinaryValues([0,0,0,1]);
    expect(num).toBe(1);
    num = mo.NumberOperators.numberFromBinaryValues([1,0,0]);
    expect(num).toBe(4);
    num = mo.NumberOperators.numberFromBinaryValues([0,1,0]);
    expect(num).toBe(2);
    num = mo.NumberOperators.numberFromBinaryValues([1,0,0,1]);
    expect(num).toBe(9);
  });

  it("should convert numbers to strings", function() {
    expect(mo.NumberOperators.numberToString(14)).toBe('14');
    expect(mo.NumberOperators.numberToString(14.01, 2)).toBe('14.01');
    expect(mo.NumberOperators.numberToString(14.01, 0)).toBe('14');
    expect(mo.NumberOperators.numberToString(-14.01, 0)).toBe('-14');
  });

});
