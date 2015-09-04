
/* globals mo */
describe("NumberTable", function() {
  it("should be creatable", function() {
    var nt = new mo.NumberTable(3);
    expect(nt.type).toBe('NumberTable');
    expect(nt.length).toBe(3);
    expect(nt[0].type).toBe('NumberList');
    // TODO: Default constructor and fromArray work differently
    //  see below test. Here the NumberList is nested twice.
    //  Should be made consistent.
    nt = new mo.NumberTable([1,2,3]);
    expect(nt[0][0].length).toBe(3);

    nt = new mo.NumberTable([1,2,3],[4,5,6]);
    expect(nt.type).toBe('NumberTable');
    // TODO: why is this list and not NumberList ???
    expect(nt[0].type).toBe('List');
    expect(nt[0][0].length).toBe(3);
    expect(nt[1][0].length).toBe(3);
  });

  it("should be creatable from array", function() {
    var nt = mo.NumberTable.fromArray([[1,2,3], [4,5,6]]);
    expect(nt[0].length).toBe(3);
    expect(nt[1].length).toBe(3);
    expect(nt[1][0]).toBe(4);
  });
});
