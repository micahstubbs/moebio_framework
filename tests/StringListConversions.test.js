
/* globals mo */
describe("StringListConversions", function() {
  it('should convert to numberlist', function(){
    var sl = new mo.StringList('1', '-1', '2');

    var nl = mo.StringListConversions.toNumberList(sl);
    expect(nl.type).toBe('NumberList');
    expect(nl[0]).toBe(1);
    expect(nl[2]).toBe(2);
  });

  it('should convert to datelist', function(){
    var sl = new mo.StringList('11-15-1999', '01-02-2001', '08-01-1972');
    var nl = mo.StringListConversions.toDateList(sl);
    expect(nl.type).toBe('DateList');
  });
});
