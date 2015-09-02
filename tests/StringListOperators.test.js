/* globals mo */
describe("StringListOperators", function() {
  it('should replace substrings in strings', function(){
    var sl = new mo.StringList('a-1', 'b-1', '-1-c');

    var rl = mo.StringListOperators.replaceSubStringsInStrings(sl, '-1', '-2');
    expect(rl[0]).toBe('a-2');
    expect(rl[2]).toBe('-2-c');
  });
});
