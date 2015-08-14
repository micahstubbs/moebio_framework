
/* globals mo */
describe("NumberListOperators", function() {
  it("should check equality", function() {
    var nl1 = new mo.NumberList(1,2,3,4);
    expect(mo.NumberListOperators.isEquivalent(nl1, nl1)).toBe(true);
    var nl2 = new mo.NumberList(1,2,3,4);
    expect(mo.NumberListOperators.isEquivalent(nl1, nl2)).toBe(true);
    var nl3 = new mo.NumberList(1,2,3,4,5);
    expect(mo.NumberListOperators.isEquivalent(nl1, nl3)).toBe(false);
  });

  it("should add", function() {
    var nl1 = new mo.NumberList(1,2,3,4);

    var addNl = mo.NumberListOperators.add(nl1, 3);
    expect(addNl[0]).toBe(4);

    var addNl2 = mo.NumberListOperators.add(nl1, addNl);
    expect(addNl2[0]).toBe(5);
    expect(addNl2[1]).toBe(7);
  });

  it("should subtract", function() {
    var nl1 = new mo.NumberList(1,2,3,4);

    var subNl = mo.NumberListOperators.subtract(nl1, 3);
    expect(subNl[0]).toBe(-2);

    var subNl2 = mo.NumberListOperators.subtract(nl1, subNl);
    expect(subNl2[0]).toBe(3);
    expect(subNl2[1]).toBe(3);
  });

  it("should divide", function() {
    var nl1 = new mo.NumberList(2,4,6,8);
    var divNl = mo.NumberListOperators.divide(nl1, 2);
    expect(divNl[0]).toBe(1);
    var divN2 = mo.NumberListOperators.divide(nl1, divNl);
    expect(divN2[0]).toBe(2);
    var nl2 = new mo.NumberList(1,2,3,16);
    var divN3 = mo.NumberListOperators.divide(nl1, nl2);
    expect(divN3[0]).toBe(2);
    expect(divN3[2]).toBe(2);
    expect(divN3[3]).toBe(0.5);
  });

  it("should find dot product", function() {
    var nl1 = new mo.NumberList(1,2,3,4);
    var nl2 = new mo.NumberList(2,4,6,8);
    var dot = mo.NumberListOperators.dotProduct(nl1, nl2);

    expect(dot).toBe(60);
  });

  it("should find distance between numberlists", function() {
    var nl1 = new mo.NumberList(4,8,12,16);
    var nl2 = new mo.NumberList(2,4,6,8);
    var dist = mo.NumberListOperators.distance(nl1, nl2);

    // about 11
    expect(dist > 10 && dist <= 11).toBeTruthy();
  });

  it("should normalize to sum", function(){
    var nl1 = new mo.NumberList(2,4,4);
    var normNl = mo.NumberListOperators.normalizedToSum(nl1);
    expect(normNl[0]).toBe(1/5);
    expect(normNl[1]).toBe(2/5);
    expect(normNl[2]).toBe(2/5);
  });

  it("should normalize", function(){
    var nl1 = new mo.NumberList(1,4,10);
    var normNl = mo.NumberListOperators.normalized(nl1);
    expect(normNl[0]).toBe(0);
    expect(normNl[1]).toBe(1/3);
    expect(normNl[2]).toBe(1);
  });

  it("should normalize to max", function(){
    var nl1 = new mo.NumberList(0,5,10);
    var normNl = mo.NumberListOperators.normalizedToMax(nl1);
    expect(normNl[0]).toBe(0);
    expect(normNl[1]).toBe(1/2);
    expect(normNl[2]).toBe(1);
  });

  it("should sort list", function() {
    var nl = mo.NumberList.fromArray([20, 10, 40, 50]);
    var sorted = mo.NumberListOperators.sort(nl);

    expect(sorted[0]).toBe(10);
    // shouldn't change original lists values
    expect(nl[0]).toBe(20);

    sorted = nl.getSorted(false);
    expect(sorted[0]).toBe(50);
    // shouldn't change original lists values
    expect(nl[0]).toBe(20);
  });

  it("should factor values", function() {
    var nl = mo.NumberList.fromArray([1,3,2]);
    var factor = mo.NumberListOperators.factor(nl, 10);
    expect(factor[0]).toBe(10);
    expect(factor[1]).toBe(30);
  });

  it("should find k means", function(){
    var nl1 = new mo.NumberList(1,1,1,5,5,5);
    var kTable = mo.NumberListOperators.linearKMeans(nl1, 2);
    expect(kTable.length).toBe(2);
    expect(kTable[0].length).toBe(3);
    expect(kTable[0][2]).toBe(1);
  });

});
