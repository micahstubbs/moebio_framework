// /**
// * Universal Numeric Operators
// * @constructor
// */
// function UniversalNumericOperators(){};
// /** 
// * receives n arguments and performs addition
// */
// 
// UniversalNumericOperators.addition=function(){
// //c.log("addition__________________________________");
// var objectType;
// var result;
// var i;
// if(arguments.length<2){
// return result;
// }
// if(arguments.length==2){
// //c.log("addition: ", typeOf(arguments[0]), typeOf(arguments[1]));
// if(arguments[0].isOfType("Array") && arguments[1].isOfType("Array")){
// return UniversalNumericOperators.applyBinaryOperatorOnLists(arguments[0], arguments[1], UniversalNumericOperators.addition);
// }else if(arguments[0].isOfType("Array")){
// //c.log("Array and non-Array!: ", typeOf(arguments[0]), typeOf(arguments[1]));
// return UniversalNumericOperators.applyBinaryOperatorOnListWithObject(arguments[0], arguments[1], UniversalNumericOperators.addition);
// }else if(arguments[1].isOfType("Array")){
// return UniversalNumericOperators.applyBinaryOperatorOnObjectWithList(arguments[0], arguments[1], UniversalNumericOperators.addition);
// }
// var args=new List(arguments[0], arguments[1]);
// var argsName=new List(typeOf(arguments[0]), typeOf(arguments[1]));
// var indexes=argsName.sortIndexed(); //Very intelligent (Mig), though I'm not completely sure is efficient
// 
// args=args.sortOnIndexes(indexes);
// argsName=argsName.sortOnIndexes(indexes);
// objectType=argsName.join("_");
// //
// switch(objectType){
// case 'boolean_boolean':
// if( ( args[0] || args[1] ) && !( args[0] && args[1] ) ) {
// return true;
// }
// return false;
// case 'Point_Point':
// return new Point(args[0].x + args[1].x, args[0].y + args[1].y);
// case 'Point3D_Point3D':
// return new Point3D(args[0].x + args[1].x, args[0].y + args[1].y, args[0].z + args[1].z);
// case 'Point_number':
// return new Point(args[0].x + args[1], args[0].y + args[1]);
// case 'Point3D_number':
// return new Point3D(args[0].x + args[1], args[0].y + args[1], args[0].z + args[1]);
// case 'Interval_number':
// return new Interval(args[0].min + args[1], args[0].max + args[1]);
// case 'Interval_Point':
// return new Point(args[0].min + args[1].x, args[0].max + args[1].y);
// case 'Interval_Interval':
// return new Point(args[0].min + args[1].min, args[0].max + args[1].max);
// case 'Point_Rectangle':
// return new Rectangle(args[0].x + args[1].x, args[0].y + args[1].y, args[1].width, args[1].height);
// case 'Interval_Rectangle':
// return new Rectangle(args[0].min + args[1].x, args[0].max + args[1].y, args[1].width, args[1].height);
// case 'Rectangle_Rectangle':
// return new Rectangle(args[0].x + args[1].x, args[0].y + args[1].y, args[0].width+args[1].width, args[0].height+args[1].height);
// case 'Date_number':
// return new Date(args[0].getTime()+(args[1]*60000));
// case 'Date_Date':
// return new Date(Number(args[0].getTime()+args[1].getTime()));
// case 'Date_DateInterval':
// return new DateInterval(UniversalNumericOperators.addition(args[0], args[1].date0), UniversalNumericOperators.addition(args[0], args[1].date1));
// case 'DateInterval_number':
// return new DateInterval(UniversalNumericOperators.addition(args[0].date0, args[1]), UniversalNumericOperators.addition(args[0].date1, args[1]));
// case 'DateInterval_Interval':
// return new DateInterval(UniversalNumericOperators.addition(args[0].date0, args[1].min), UniversalNumericOperators.addition(args[0].date1, args[1].max));
// case 'DateInterval_DateInterval':
// return new DateInterval(UniversalNumericOperators.addition(args[0].date0, args[1].date0), UniversalNumericOperators.addition(args[0].date1, args[1].date1));
// //perform normal addition:
// case 'number_number':
// return args[0]+args[1];
// case 'boolean_number':
// case 'Date_string':
// case 'number_string':
// case 'string_string':
// return args[0]+args[1]; //correct?
// break;
// default:
// trace("[!] addition didn't manage to resolve:", objectType);
// trace("[!] addition didn't manage to resolve:", objectType, "==", arguments[0]+arguments[1]);
// return null;
// 
// }
// return arguments[0]+arguments[1];
// 		
// 		
// }	
// 		
// result=arguments[0];
// for(i=1; i<arguments.length; i++){
// result=UniversalNumericOperators.addition(result, arguments[i]);
// }
// return result;
// }
// UniversalNumericOperators.applyBinaryOperatorOnLists=function(list0, list1, operator){
// var n=Math.min(list0.length, list1.length);
// var i;
// var resultList=new List();
// for(i=0; i<n; i++){
// resultList.push(UniversalNumericOperators.applyBinaryOperator(list0[i], list1[i], operator));
// }
// return resultList.getImproved();
// }
// UniversalNumericOperators.applyBinaryOperatorOnListWithObject=function(list, object, operator){
// var i;
// var resultList=new List();
// for(i=0; i<list.length; i++){
// resultList.push(UniversalNumericOperators.applyBinaryOperator(list[i], object, operator));
// }
// return resultList.getImproved();
// }
// UniversalNumericOperators.applyBinaryOperatorOnObjectWithList=function(object, list, operator){
// var i;
// var resultList=new List();
// for(i=0; i<list.length; i++){
// resultList.push(UniversalNumericOperators.applyBinaryOperator(object, list[i], operator));
// }
// return resultList.getImproved();
// }
// UniversalNumericOperators.applyBinaryOperator=function(object0, object1, operator){
// return operator(object0, object1);
// }
// UniversalNumericOperators.multiplication=function(){
// var objectType;
// var result;
// var i;
// if(arguments.length<2){
// //trace("one single argument! at mul");
// objectType=typeOf(arguments[0]);
// //trace(objectType);
// return result;
// }
// if(arguments.length==2){
// //trace("mul args:", arguments);
// if(arguments[0].isOfType("Array") && arguments[1].isOfType("Array")){
// return UniversalNumericOperators.applyBinaryOperatorOnLists(arguments[0], arguments[1], UniversalNumericOperators.multiplication);
// }else if(arguments[0].isOfType("Array")){
// return UniversalNumericOperators.applyBinaryOperatorOnListWithObject(arguments[0], arguments[1], UniversalNumericOperators.multiplication);
// }else if(arguments[1].isOfType("Array")){
// return UniversalNumericOperators.applyBinaryOperatorOnObjectWithList(arguments[0], arguments[1], UniversalNumericOperators.multiplication);
// }
// var args=new List(arguments[0], arguments[1]);
// var argsName=new List(typeOf(arguments[0]), typeOf(arguments[1]));
// var indexes=argsName.sortIndexed();
// args=args.sortOnIndexes(indexes);
// argsName=argsName.sortOnIndexes(indexes);
// objectType=argsName.join("_");
// //
// switch(objectType){
// case 'boolean_boolean':
// if( args[0] && args[1] ) {
// return true;
// }
// return false;
// case 'Point_Point':
// return args[0].cross(args[1]);
// case 'Point3D_Point3D':
// return args[0].cross(args[1]);
// case 'Point_number':
// return new Point(args[0].x * args[1], args[0].y * args[1]);
// case 'Point3D_number':
// return new Point3D(args[0].x * args[1], args[0].y * args[1], args[0].z * args[1]);
// case 'Interval_number':
// return new Interval(args[0].min * args[1], args[0].max * args[1]);
// case 'Interval_Point':
// return args[1].cross(new Point(args[0].min, args[0].max));
// case 'Interval_Interval':
// var p=new Point(args[0].min, args[0].max);
// return p.cross(new Point(args[1].min, args[1].max));
// 	
// case 'Date_number':
// return new Date(args[0].getTime()*(args[1]*60000));
// case 'DateInterval_number':
// return new DateInterval(UniversalNumericOperators.multiplication(args[0].date0, args[1]), UniversalNumericOperators.multiplication(args[0].date1, args[1]));
// case 'DateInterval_Interval':
// return new DateInterval(UniversalNumericOperators.multiplication(args[0].date0, args[1].min), UniversalNumericOperators.multiplication(args[0].date1, args[1].max));
// //perform normal multiplication:
// case 'boolean_number':
// case 'number_number':
// break;
// default:
// trace("[!] multiplication didn't manage to resolve:", objectType);
// trace("[!] multiplication didn't manage to resolve:", objectType, "==", arguments[0]*arguments[1]);
// return null;
// 
// }
// return arguments[0]*arguments[1];
// 		
// 		
// }	
// 		
// result=arguments[0];
// for(i=1; i<arguments.length; i++){
// result=UniversalNumericOperators.multiplication(result, arguments[i])
// }
// return result;
// }
// UniversalNumericOperators.division=function(){
// var objectType;
// var result;
// var i;
// if(arguments.length<2){
// objectType=typeOf(arguments[0]);
// 		
// //trace(objectType);
// return result;
// }
// if(arguments.length==2){
// objectType=typeOf(arguments[0])+"_"+typeOf(arguments[1]);
// //trace(objectType);
// return arguments[0]/arguments[1];
// }	
// 		
// result=arguments[0];
// for(i=1; i<arguments.length; i++){
// result=UniversalNumericOperators.division(result, arguments[i])
// }
// return result;
// }
// 
// UniversalNumericOperators.getMin=function(object0, object1){
// var objectsType=typeOf(object0)+"_"+typeOf(object1);
// switch(objectsType){
// case 'number_number':
// return Math.min(object0, object1);
// case 'Date_Date':
// if(object0<object1) return object0;
// return object1;
// case 'Interval_undefined':
// case 'List_null':
// case 'NumberList_undefined':
// case 'DateInterval_undefined':
// //case 'DateList_undefined':
// //case 'NumberTable':
// return object0.getMin();
// case 'Point_':
// return Math.min(object0.x, object0.y);
// default:
// trace("[!] ERROR: UniversalNumericOperators.getMin", object0, object1);
// return null;
// }
// }
// 
// UniversalNumericOperators.getMax=function(object0, object1){
// var objectsType=typeOf(object0)+"_"+typeOf(object1);
// //console.log("UniversalNumericOperators.getMax | objecstType ----> ", objectsType);
// switch(objectsType){
// case 'number_number':
// return Math.max(object0, object1);
// case 'Date_Date':
// if(object0>object1) return object0;
// return object1;
// case 'Interval_undefined':
// case 'List_undefined':
// case 'NumberList_undefined':
// case 'DateInterval_undefined':
// //case 'DateList_undefined':
// //case 'NumberTable':
// return object0.getMax();
// case 'Point_':
// return Math.max(object0.x, object0.y);
// default:
// trace("[!] ERROR: UniversalNumericOperators.getMax", object0, object1);
// return null;	
// }
// }
// 
// UniversalNumericOperators.distance=function(object0, object1){
// var objectType;
// var result;
// var i;
// if(arguments.length<2){
// objectType=typeOf(arguments[0]);
// //trace(objectType);
// return result;
// }
// if(arguments.length==2){
// 		
// var args=new List(arguments[0], arguments[1]);
// var argsName=new List(typeOf(arguments[0]), typeOf(arguments[1]));
// var indexes=argsName.sortIndexed();
// args=args.sortOnIndexes(indexes);
// argsName=argsName.sortOnIndexes(indexes);
// objectType=argsName.join("_");
// //
// switch(objectType){
// case 'number_number':
// return Math.abs(Number(object0) -Number(object1));
// break;
// case 'NumberList_NumberList':
// return Math.abs(object0.getSum() - object1.getSum());
// break;
// default:
// trace("[!] distance didn't manage to resolve:", objectType);
// trace("[!] distance didn't manage to resolve:", objectType, "==", Math.abs(arguments[0]-arguments[1]));
// return null;
// 
// }
// return Math.abs(arguments[0]-arguments[1]);
// }	
// 		
// result=arguments[0];
// for(i=1; i<arguments.length; i++){
// result=UniversalNumericOperators.multiplication(result, arguments[i])
// }
// return result;
// 
// }
// UniversalNumericOperators.interpolation=function(object0, object1, value){
// //trace("interpolation:", object0, object1, value);
// var sum0 = UniversalNumericOperators.multiplication((1-value), object0);
// var sum1 = UniversalNumericOperators.multiplication(value, object1);
// //trace("res MUL:", sum0, sum1);
// if(sum0==null || sum1==null) return null;
// return UniversalNumericOperators.addition(sum0, sum1);
// }
// 
// UniversalNumericOperators.power=function(value, powerValue){
// var type = typeOf(value);
// 	
// if(type=='number'){
// return Math.pow(value, powerValue);
// }
// //c.log("UniversalNumericOperators.power ---> value, powerValue, type, value.isOfType('Array')", value, powerValue, type, value.isOfType('Array'));
// if(value.isOfType('Array')){
// var i;
// var list = instantiate(type);
// list.name = value.name;
// for(i=0;value[i]!=null;i++){
// list.push(this.power(value[i], powerValue));
// }
// return list;
// }
// return null;
// }
// 
// UniversalNumericOperators.randomNumber=function(interval){
// var result = Math.random();
// result = interval.getInterpolatedValue(result);
// return result;
// }