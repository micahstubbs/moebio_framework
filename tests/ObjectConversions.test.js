
describe("ObjectConversions", function() {
  it('should stringify objects', function() {
    var obj = {name:"John"};
    var result = mo.ObjectConversions.objectToString(obj);
    expect(result).toBe("{\"name\":\"John\"}");
    console.log(mo.ObjectOperators.getReport(obj));

    obj.rec = obj;
    result = mo.ObjectConversions.objectToString(obj);
    expect(result).toBe('{"error":"cannot convert."}');

  });
});
