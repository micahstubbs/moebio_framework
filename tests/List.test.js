//          getSortedByProperty
// ======================================================

/* global mo */
describe("list.getSortedByProperty", function()
{
  it("should be defined", function() {
    var list = new mo.List();
    expect(list.getSortedByProperty).toBeDefined();
    expect(list.type).toBe('List');
  });

  it("should improve the base list", function() {
    var list = new mo.List.fromArray([1,2,3]);
    var nlist = list.getImproved();
    expect(nlist.type).toBe('NumberList');
    list = new mo.List.fromArray(['a','b', 'c']);
    var slist = list.getImproved();
    expect(slist.type).toBe('StringList');
  });

  it("should get types in list", function() {
    var list = new mo.List.fromArray([1,2,3.4]);
    var lType = list.getTypeOfElements();
    expect(lType).toBe('number');

    // returns empty string if multiple types
    list = new mo.List.fromArray([1,'a',3.4]);
    lType = list.getTypeOfElements();
    expect(lType).toBe('');
  });

  it("should get type in list", function() {
    var list = new mo.List.fromArray([1,'a',3.4]);
    var lTypes = list.getTypes();
    expect(lTypes[0]).toBe('number');
    expect(lTypes[1]).toBe('string');
    expect(lTypes[2]).toBe('number');
  });


  it("should return expected grouping well sorted", function() {
    var list = mo.List.fromArray([
      { name:"daniel", age:36 },
      { name:"anna", age:37 },
      { name:"alex", age:34 },
    ]);
    var result = list.getSortedByProperty("age");
    expect(result[0].name).toEqual("alex");
    expect(result[2].name).toEqual("anna");
  });

  it("should reverse the list", function() {
    var list = new mo.List.fromArray([1,2,3]);
    var rev = list.getReversed();
    expect(rev[0]).toBe(3);
    expect(rev[1]).toBe(2);
    expect(rev[2]).toBe(1);
  });

  it("should remove duplicate values", function() {
    var list = new mo.List.fromArray([1,1,1,1,2,3]);
    var dedup = list.getWithoutRepetitions();
    expect(dedup.length).toBe(3);
    list = new mo.List.fromArray([1,1,1,1,2,1,1,1,11,3,1,1]);
    dedup = list.getWithoutRepetitions();
    expect(dedup.length).toBe(4);


  });

  it("should count an element", function() {
    var list = new mo.List.fromArray([1,1,1,1,2,1,1,1,11,3,1,1]);
    expect(list.countElement(1)).toBe(9);
    expect(list.countElement(2)).toBe(1);
    expect(list.countElement(12)).toBe(0);
    expect(list.countElement(-1)).toBe(0);
  });

  it("should count all occurances", function() {
    var list = new mo.List.fromArray([1,1,1,1,2,1,1,1,11,3,1,1]);
    var ocrs = list.countOccurrences();
    expect(ocrs.length).toBe(list.length);
    expect(ocrs[0]).toBe(9);
    expect(ocrs[1]).toBe(9);
    expect(ocrs[4]).toBe(1);
  });

  it("should pick out types", function() {
    var list = new mo.List.fromArray([1,1,2,'a',3,'b']);
    var nlist = list.getSubListByType('number');
    var slist = list.getSubListByType('string');
    var dlist = list.getSubListByType('undefined');
    expect(nlist.length).toBe(4);
    expect(slist.length).toBe(2);
    expect(dlist.length).toBe(0);
  });

  it("should find most repeated value", function() {
    var list = new mo.List.fromArray([1,1,1,1,2,1,1,1,11,3,1,1]);
    expect(list.getMostRepeatedElement()).toBe(1);
    list = new mo.List.fromArray([1,1,2,'a',3,'b','a','b','a']);
    expect(list.getMostRepeatedElement()).toBe('a');
  });

  it("should find repeated value counts", function() {
    var list = new mo.List.fromArray([1,1,1,1,2,1,1,1,11,3,1,1,11,'11']);
    var ocrs = list.getFrequenciesTable();
    
    // first most repeated element
    expect(ocrs[0][0]).toBe(1);
    expect(ocrs[1][0]).toBe(9);
    // second most repeated element
    expect(ocrs[0][1]).toBe(11);
    expect(ocrs[1][1]).toBe(3);
  });

  it("should remove element", function() {
    var list = new mo.List.fromArray([1,1,2,3]);
    var rmList = list.getWithoutElement(1);
    // Only removes first instance of a repeat element.
    // TODO: should it remove all instances?
    expect(rmList.length).toBe(3);
  });

  it("should filter by function", function() {
    var list = new mo.List.fromArray([1,1,2,3]);
    var fList = list.getFilteredByFunction(function(e) {
      return e < 2;
    });
    expect(fList.length).toBe(2);
    expect(fList[1]).toBe(1);
  });
});
