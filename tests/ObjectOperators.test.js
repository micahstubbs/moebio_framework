//                  isPropertyValue
// ======================================================
describe("ObjectOperators.isPropertyValue", function()
{
  it("should be defined", function() {
    expect(mo.ObjectOperators.isPropertyValue).toBeDefined();
  });

  var eSelectionMode = { NONE:0, SINGLE:1, MULTI:2};
  it("should return true for existing property values", function() {
    var result = mo.ObjectOperators.isPropertyValue(eSelectionMode,2);
    expect(result).toEqual(true);
  });

  it("should return false for non-existing property values", function() {
    var result = mo.ObjectOperators.isPropertyValue(eSelectionMode,3);
    expect(result).toEqual(false);
  });
});
