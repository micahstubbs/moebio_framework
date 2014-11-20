describe("ListOperators.segmentElements", function() {
    var myfunc = ListOperators.segmentElements;     
 
    it("should be defined", function() {
        expect(myfunc).toBeDefined();
    });

    it("should return expected segmentation", function() {
        var list = List.fromArray( [ "jan", "feb", "mar", "jan", "apr", "jan", "feb" ] );
        var result = myfunc( list, true, 1 );
        console.log( result.getNames() );
        expect( result.length ).toEqual( 4 );
    });
});
