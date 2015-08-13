/* globals mo */
describe("DateList", function() {
  it("should be creatable", function() {
    var dl = new mo.DateList();
    expect(dl).toBeDefined();
    expect(dl.length).toBe(0);
  });

  it("should be creatable from array", function() {
    var dl = mo.DateList.fromArray([11121], true);
    expect(dl.length).toBe(1);
    expect(dl[0] instanceof Date).toBe(true);
  });

});
