
/* globals mo */
describe("NumberListOperators", function() {

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

  it("should find k means", function(){
    var nl1 = new mo.NumberList(1,1,1,5,5,5);
    var kTable = mo.NumberListOperators.linearKMeans(nl1, 2);
    expect(kTable.length).toBe(2);
    expect(kTable[0].length).toBe(3);
    expect(kTable[0][2]).toBe(1);
  });

});
