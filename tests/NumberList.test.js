
describe("NumberList", function() {
  it("should be creatable", function() {
    var nl = new NumberList();
    expect(nl).toBeDefined();
    expect(nl.length).toBe(0);

    nl = new NumberList(1,2,3);
    expect(nl.length).toBe(3);

    nl = new NumberList('1', '2', '3');
    expect(nl.length).toBe(3);
    expect(nl[1]).toBe(2);
  });

  it("should create from array", function() {
    var array = [1,2,3];
    var nl = NumberList.fromArray(array);
    expect(nl.length).toBe(3);

  });

  it("should calculate min and max", function() {
    // weird edge case where empty returns null
    nl = new NumberList();
    expect(nl.getMin()).toBe(null);
    expect(nl.getMax()).toBe(null);
    nl.push(1);
    expect(nl.getMin()).toBe(1);
    expect(nl.getMax()).toBe(1);
    nl.push(100);
    nl.push(-100);
    expect(nl.getMin()).toBe(-100);
    expect(nl.getMax()).toBe(100);


    var array = [0,-30,12,30,100,200,4,4,1];
    var nl = NumberList.fromArray(array);
    expect(nl.getMin()).toBe(-30);
    expect(nl.getMax()).toBe(200);
  });

  it("should calculate range", function() {
    var nl = NumberList.fromArray([30, 20, 0, 100, 80]);
    expect(nl.getAmplitude()).toBe(100);

    nl = NumberList.fromArray([30, -20, 0, 100, 80]);
    expect(nl.getAmplitude()).toBe(120);

    nl = NumberList.fromArray([1]);
    expect(nl.getAmplitude()).toBe(0);

    nl = NumberList.fromArray([]);
    expect(nl.getAmplitude()).toBe(0);
  });
});
