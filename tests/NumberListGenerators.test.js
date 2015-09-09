
describe("NumberListGenerators", function() {
  it("should create sorted lists", function() {
    var nl = mo.NumberListGenerators.createSortedNumberList(20, 2);

    expect(nl.length).toBe(20);
    expect(nl[0]).toBe(2);

    nl = mo.NumberListGenerators.createSortedNumberList(10, -1, -1);
    expect(nl.length).toBe(10);
    expect(nl[0]).toBe(-1);
    expect(nl[9]).toBe(-10);

    nl = mo.NumberListGenerators.createSortedNumberList(10, 2, 2);
    expect(nl.length).toBe(10);
    expect(nl[0]).toBe(2);
    expect(nl[9]).toBe(20);
  });

  it("should create lists from intervals", function() {

    var interval = new mo.Interval(10, 20);
    var nl = mo.NumberList.createNumberListFromInterval(100, interval);
    var length = nl.length;
    expect(length).toBe(100);
    for(var i = 0; i < length; i++) {
      expect(nl[i]).toBeGreaterThan(10);
      expect(nl[i]).toBeLessThan(20);
    }
  });

  it("should create random lists from intervals", function() {
    var nl = mo.NumberListGenerators.createRandomNumberList(100);
    var length = nl.length;
    expect(length).toBe(100);
    for(var i = 0; i < length; i++) {
      expect(nl[i]).toBeGreaterThan(0);
      expect(nl[i]).toBeLessThan(1);
    }
  });
});
