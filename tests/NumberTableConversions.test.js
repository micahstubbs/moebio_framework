

/* globals mo */
describe("NumberTableConversions", function() {
  it("should convert NumberTable to Polygon", function() {
    var nl = mo.NumberTable.fromArray([1,2,3,4]);

    var poly = mo.NumberTableConversions.numberTableToPolygon(nl);
    expect(poly.type).toBe("Polygon");

    //TODO: conversion doesn't work with default constructor 
    nl = new mo.NumberTable([1,2,3,4]);
    expect(nl.type).toBe("NumberTable");
    poly = mo.NumberTableConversions.numberTableToPolygon(nl);
    // DOESNT WORK
    // expect(poly.type).toBe("Polygon");
  });
});
