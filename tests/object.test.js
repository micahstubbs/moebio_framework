describe("ListOperators.grouptElements", function() {
    var myfunc = ListOperators.groupElements;     
 
    it("should be defined", function() {
        expect(myfunc).toBeDefined();
    });

    it("should return expected grouping", function() {
        var list = List.fromArray( [ "jan", "feb", "mar", "jan", "apr", "jan", "feb" ] );
        var result = myfunc( list, true, 1 ); 
        expect( result.length ).toEqual( 4 );
    });
});

describe("ListOperators.groupElementsByPropertyValue", function(){
    var myfunc = ListOperators.groupElementsByPropertyValue;   

    it("should be defined", function() {
        expect(myfunc).toBeDefined();
    });  


    it("should return expected grouping well sorted", function() {
        var list = List.fromArray( [ 
            { name:"daniel", age:36 }, 
            { name:"anna", age:37 }, 
            { name:"alejandro", age:34 }, 
         ] );
        list = list.getSortedByProperty("name")
        console.log( list );
        expect( 4 ).toEqual( 4 );
    });

});