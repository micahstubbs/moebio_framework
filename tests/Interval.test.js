
describe("Interval", function() {
  it("should be creatable", function() {
    var inter = new mo.Interval(0,1);
    expect(inter).toBeDefined();
  });

  it("should give range", function() {
    var inter = new mo.Interval(0, 100);
    expect(inter.getAmplitude()).toBe(100);
    expect(inter.getSignedAmplitude()).toBe(100);
  });

  it("should give min", function() {
    var inter = new mo.Interval(0, 100);
    expect(inter.getMin()).toBe(0);
    inter = new mo.Interval(100,-5);
    expect(inter.getMin()).toBe(-5);
    inter = new mo.Interval(-10,-5);
    expect(inter.getMin()).toBe(-10);
  });

  it("should give max", function() {
    var inter = new mo.Interval(0, 100);
    expect(inter.getMax()).toBe(100);
    inter = new mo.Interval(100,-5);
    expect(inter.getMax()).toBe(100);
    inter = new mo.Interval(-10,-5);
    expect(inter.getMax()).toBe(-5);
  });

  it("should interpolate", function() {
    var inter = new mo.Interval(0, 100);
    expect(inter.getInterpolatedValue(0)).toBe(0);
    expect(inter.getInterpolatedValue(0.5)).toBe(50);
  });

  it("should inverse interpolate", function() {
    var inter = new mo.Interval(0, 100);
    expect(inter.getInverseInterpolatedValue(0)).toBe(0);
    expect(inter.getInverseInterpolatedValue(50)).toBe(0.5);
  });

  it("should find containing values", function() {
    var inter = new mo.Interval(0, 100);

    expect(inter.contains(0)).toBe(true);
    expect(inter.contains(100)).toBe(true);
    expect(inter.contains(50)).toBe(true);

    expect(inter.contains(-1)).toBe(false);
    expect(inter.contains(101)).toBe(false);
  });


  it("should get sign", function() {
    var inter = new mo.Interval(0, 100);
    expect(inter.getSign()).toBe(1);
    inter = new mo.Interval(10,0);
    expect(inter.getSign()).toBe(-1);
    inter = new mo.Interval(10,10);
    expect(inter.getSign()).toBe(0);
  });

  xit("should find containing values in negative intervals", function() {
    //TODO: interval broken for negative intervals?
    var inter = new mo.Interval(-1, -99);
    expect(inter.contains(-1)).toBe(true);
    expect(inter.contains(-2)).toBe(true);
    expect(inter.contains(0)).toBe(false);
  });
});
