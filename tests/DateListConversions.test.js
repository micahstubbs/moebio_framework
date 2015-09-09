
/* globals mo */
describe("DateListConversions", function() {
  it('should convert to stringlist', function(){

    var dl = new mo.DateList(112233);

    var nl = mo.DateListConversions.toStringList(dl);
    expect(nl.type).toBe('StringList');
    expect(nl[0]).toBe('12-31-1969');
  });
});
