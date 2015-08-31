
/* globals mo */
describe("NumberOperators", function() {
  it("should split", function() {
    var splitList = mo.StringOperators.split("a big dog. doesn't like me.", '.');
    expect(splitList.length).toBe(3); // one on the end
  });
});
