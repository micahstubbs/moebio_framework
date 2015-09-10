describe("Engine3D", function() {
  it("should be creatable", function() {
    var e = new mo.Engine3D();
    expect(e).toBeDefined();
  });


  it("should sort list points by scale", function() {
    var e = new mo.Engine3D();
    
    var list = new mo.List(10,40,20);
    var poly = new mo.Polygon3D(100,400,200);
    var poly2 = new mo.Polygon3D(400,200,100);

    var res = e.sortListByPointsScale(list, poly);
    var res2 = e.sortListByPointsScale(list, poly2);

    // TODO why should these be the same. a better test would be 
    // highly useful.
    expect(res.isEquivalent(list)).toBe(true);
    expect(res2.isEquivalent(list)).toBe(true);
  });

  
});
