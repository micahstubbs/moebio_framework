
/* globals mo */
describe("NumberListConversions", function() {
  it("should convert NumberList to Polygon", function() {
    var nl = new mo.NumberList(1,2,3,4);

    var poly = mo.NumberListConversions.toPolygon(nl);
    expect(poly.type).toBe("Polygon");
  });

  it("should convert NumberList to StringList", function() {
    var nl = new mo.NumberList(1,2,3,4);

    var poly = mo.NumberListConversions.toStringList(nl);
    expect(poly.type).toBe("StringList");
  });
});
