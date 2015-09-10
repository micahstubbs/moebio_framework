describe("Rectangle", function() {
  it("should be creatable", function() {
    var r = new mo.Rectangle(1,1,5,10);
    expect(r.x).toBe(1);
    expect(r.width).toBe(5);
    expect(r.height).toBe(10);
  });
  it("should set right", function() {
    var r = new mo.Rectangle(1,1,5,10);
    r.setRight(2);
    expect(r.getRight()).toBe(2);
  });
  it("should get top-left", function(){
    var r = new mo.Rectangle(1,1,5,10);
    expect(r.getTopLeft().x).toBe(1);
    expect(r.getTopLeft().x).toBe(1);
  });
  it("should get intersection", function(){
    var r = new mo.Rectangle(1,1,5,10);
    var s = new mo.Rectangle(3,3,5,10);
    var i = r.getIntersection(s);

    expect(i.x).toBe(3);
    expect(i.y).toBe(3);
    expect(i.width).toBe(3);
    expect(i.height).toBe(8);
  });
});
