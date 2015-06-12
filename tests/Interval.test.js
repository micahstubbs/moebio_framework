
describe("Interval", function() {
  it("should be creatable", function() {
    var inter = new Interval(0,1);
    expect(inter).toBeDefined();
  });

  it("should give range", function() {
    var inter = new Interval(0, 100);
    expect(inter.getAmplitude()).toBe(100);
    expect(inter.getSignedAmplitude()).toBe(-100);

  });

  it("should interpolate", function() {
    var inter = new Interval(0, 100);
    expect(inter.getInterpolatedValue(0)).toBe(0);
    // TODO: I don't understand why this should return -50.
    // I think it should return 50.
    expect(inter.getInterpolatedValue(0.5)).toBe(-50);
  });
  it("should inverse interpolate", function() {
    var inter = new Interval(0, 100);
    expect(inter.getInverseInterpolatedValue(0)).toBe(0);
    // TODO: I don't understand why this should return -0.5.
    expect(inter.getInverseInterpolatedValue(50)).toBe(-0.5);
  });
});
