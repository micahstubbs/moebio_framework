//          getSortedByProperty
// ======================================================
describe("list.getSortedByProperty", function()
{
  it("should be defined", function() {
    var list = new List();
    expect(list.getSortedByProperty).toBeDefined();
  });


  it("should return expected grouping well sorted", function() {
    var list = List.fromArray([
      { name:"daniel", age:36 },
      { name:"anna", age:37 },
      { name:"alex", age:34 },
    ]);
    var result = list.getSortedByProperty("age");
    expect(result[0].name).toEqual("alex");
    expect(result[2].name).toEqual("anna");
  });
});