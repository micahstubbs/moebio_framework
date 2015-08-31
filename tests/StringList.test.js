
/* globals mo */
describe("StringList", function() {
  it("should be creatable", function() {
    var sl = mo.StringList('a','b','c');
    expect(sl.type).toBe("StringList");
    expect(sl.length).toBe(3);
  });
  
  it("should trim", function() {
    var sl = mo.StringList(' a ','b  ','   c', ' d e ');
    expect(sl[0].length).toBe(3);
    var trimSl = sl.trim();
    expect(trimSl[0].length).toBe(1);
    expect(trimSl[0]).toBe('a');
    expect(trimSl[3]).toBe('d e');
  });
});
