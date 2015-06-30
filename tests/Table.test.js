describe("Table", function() {
  it("should be creatable", function() {
    var t = new mo.Table();
    expect(t).toBeDefined();
    expect(t.type).toBe('Table');
    t = new mo.Table(1,2,3);
    expect(t[1]).toBeDefined();
    expect(t[1][0]).toBeDefined();
  });

  it("should create from array", function() {
    var t = new mo.Table.fromArray([[1,2],[3,4],[5,6]]);
    expect(t).toBeDefined();
    expect(t[0][0]).toBe(1);
    expect(t[2][1]).toBe(6);
  });

  it("should get row", function() {
    var t = new mo.Table.fromArray([[1,2],[3,4],[5,6]]);
    var row = t.getRow(1);
    expect(row[1]).toBe(4);
    expect(row.length).toBe(3);
  });

  it("should handle different types of lists", function() {
    var t = new mo.Table.fromArray([[1,2,3], ['a', 'b', 'c'], [4,5]]);
    expect(t[1].length).toBe(3);
    expect(t[0][0]).toBe(1);
    expect(t[1][0]).toBe('a');
  });

  it("should get column length", function() {
    var t = new mo.Table.fromArray([[1,2,3], ['a', 'b', 'c', 'd'], [4,5]]);
    var l = t.getListLength();
    expect(l).toBe(3);
    l = t.getListLength(1);
    expect(l).toBe(4);
    l = t.getListLength(2);
    expect(l).toBe(2);
  });

  it("should get column lengths", function() {
    var t = new mo.Table.fromArray([[1,2,3], ['a', 'b', 'c', 'd'], [4,5]]);
    var l = t.getLengths();
    expect(l[0]).toBe(3);
    expect(l[1]).toBe(4);
    expect(l[2]).toBe(2);
  });

});
