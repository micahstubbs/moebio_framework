describe("Point", function() {
  it("should be creatable", function() {
    var p = new mo.Point(4,5);
    expect(p.x).toBe(4);
  });
  it("should normalize", function() {
    var p = new mo.Point(0,3);
    expect(p.getNorm()).toBe(3);
  });
  it("should expand", function(){
    var p = new mo.Point(3,3);
    var e = p.expandFromPoint(new mo.Point(2,2),4);
    // not sure what this method is used for
    expect(e.x).toBe(6);
  });
  it("should interpolate", function(){
    var p = new mo.Point(0,0);
    var i = p.interpolate(new mo.Point(10,10), 0.5);
    expect(i.x).toBe(5);
    i = p.interpolate(new mo.Point(10,10), 1.0);
    expect(i.x).toBe(10);
  });
});
