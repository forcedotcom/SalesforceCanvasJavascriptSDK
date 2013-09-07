var jasmine = require('jasmine-node');
describe("Canvas Framework", function(){
    var Sfdc = require('../../js/canvas.js').Sfdc;
    it("Should know that Sfdc.canvas is defined", function(){
	expect(Sfdc.canvas).toBeDefined();
    });
        describe("Tests for has own", function(){
	    var o = new Object();
            o.prop = 'exists'
            function changeO() {  
                o.newprop = o.prop;  
                delete o.prop;  
            }  
            
            it("Should know the difference between direct and inherited properties", function(){
		expect(Sfdc.canvas.hasOwn(o, 'prop')).toBeTruthy();
                expect(Sfdc.canvas.hasOwn(o, 'toString')).toBeFalsy();
            });
            it("Should know a property has been deleted", function(){
                changeO();
                expect(Sfdc.canvas.hasOwn(o, 'prop')).toBeFalsy();
            });
        });
        
        describe("Tests for isUndefined", function(){
            var a = {
               foo: 'foo'               
            };
            
            it("Should know that food is undefined", function(){
                expect(Sfdc.canvas.isUndefined(a.food)).toBeTruthy();
            });
            
            it("Should know that undefined variable is undefined", function(){
                var b;
                expect(Sfdc.canvas.isUndefined(b)).toBeTruthy();
            });
                        
            it("Should know that foo is defined", function(){
                expect(Sfdc.canvas.isUndefined(a.foo)).toBeFalsy();
            });
            it("Should know that boolean false is defined", function(){
                expect(Sfdc.canvas.isUndefined(false)).toBeFalsy();
            });
            it("Should know that boolean true is defined", function(){
                expect(Sfdc.canvas.isUndefined(true)).toBeFalsy();
            });
            
            it("Should know that set to null is defined", function(){
                var a = null;
                expect(Sfdc.canvas.isUndefined(a)).toBeFalsy();
            });
            
            it("Should know that empty string is defined", function(){
                var a = "";
                expect(Sfdc.canvas.isUndefined(a)).toBeFalsy();
            });
        });
        
        describe("Tests for isNil", function(){
            it("Should know that unassigned is Nil", function(){
                var a;
                expect(Sfdc.canvas.isNil(a)).toBeTruthy();
            });
            
            it("Should know that explictly set to undefined is Nil", function(){
                var f = undefined;
                expect(Sfdc.canvas.isNil(f)).toBeTruthy();
            });
            it("Should know that non existent property is Nil", function(){
                var o = new Object()
                expect(Sfdc.canvas.isNil(o.hello)).toBeTruthy();
            });
            it("Should know that set to null is Nil", function(){
                var a = null;
                expect(Sfdc.canvas.isNil(a)).toBeTruthy();
            });
            it("Should know that empty string is Nil", function(){
                var empty = "";
                expect(Sfdc.canvas.isNil(empty)).toBeTruthy();
            });
            it ("Should know that set properties are not Nil", function(){
                var hello = "Hello";
                expect(Sfdc.canvas.isNil(hello)).toBeFalsy();
            });
        });
        
        //paramerterize these
        describe("Test for isNumber", function(){
            it("Should know that 0 integer is a number", function(){
                expect(Sfdc.canvas.isNumber(0)).toBeTruthy();
            });
        
            it("Should know that 0 string is not a number", function(){
                expect(Sfdc.canvas.isNumber('0')).toBeFalsy();
            });
            
            it("Should know that negative integer is a number", function(){
                var negative = -1;
                expect(Sfdc.canvas.isNumber(negative)).toBeTruthy();
            });
                        
            it("Should know that positive integer is a number", function(){
                var negative = 10;
                expect(Sfdc.canvas.isNumber(negative)).toBeTruthy();
            });
            
            it("Should know that octal integer literal is a number", function(){
                expect(Sfdc.canvas.isNumber(0144)).toBeTruthy();
            });
            
            it("Should know that hexadecimal integer literal is a number", function(){
                expect(Sfdc.canvas.isNumber(0xFFF)).toBeTruthy();
            });
            it("Should know that Math Constant is a number", function(){    
                expect(Sfdc.canvas.isNumber(Math.PI)).toBeTruthy();
            });
            it("Should know that Negative floating point number is a number", function(){
                expect(Sfdc.canvas.isNumber(-2.6)).toBeTruthy();
            });
            
            it("Should know that positive floating point number is a number", function(){
                expect(Sfdc.canvas.isNumber(3.1415)).toBeTruthy();
            });
            
            it("Should know that exponential notation is a number", function(){
                expect(Sfdc.canvas.isNumber(6e7)).toBeTruthy();
            });
            
            it("Should know that empty string is not a number", function(){
                expect (Sfdc.canvas.isNumber("")).toBeFalsy();
            });
            it("Should know that alphanumeric string is not a number", function(){
                expect(Sfdc.canvas.isNumber("asd123")).toBeFalsy();
            });
            it("Should know that whitespace is not a number", function(){
                expect(Sfdc.canvas.isNumber("       ")).toBeFalsy();
            });
            
            it("Should know that boolean true is not a number", function(){
                expect(Sfdc.canvas.isNumber(true)).toBeFalsy();
            });
            
            it("Should know that boolean false is not a number", function(){
                expect(Sfdc.canvas.isNumber(false)).toBeFalsy();
            });
            
            it("Should know that undefined is not a number", function(){
                var a;
                expect(Sfdc.canvas.isNumber(a)).toBeFalsy();
            });
            it("Should know that function returning a number is a number", function(){
                var func = function(){
                    return 42;
                }
                expect(Sfdc.canvas.isNumber(func())).toBeTruthy();
            });

            
        });
        describe("isFunction tests", function(){
            
            it("Should know that anon function is a function", function(){
                expect(Sfdc.canvas.isFunction(function () {})).toBeTruthy();
            });
            it("Should know that object is not a function", function(){
                expect(Sfdc.canvas.isFunction({ x:15, y:20 })).toBeFalsy();
            });
            it("Should know that null is not a function", function(){
                expect(Sfdc.canvas.isFunction(null)).toBeFalsy();
            });
            it("Should know that named function is a function", function(){
                function stub() {
                }
                expect(Sfdc.canvas.isFunction(stub)).toBeTruthy();
            });
            it("Should know that string, 'function', is not a function", function(){
                expect(Sfdc.canvas.isFunction("function")).toBeFalsy();
            });
            
            //make sure that false values are not defined as functions
            it("Should know that no value is not a function", function(){
                expect(Sfdc.canvas.isFunction()).toBeFalsy();
            });
            it("Should know that null value is not a function", function(){
                expect(Sfdc.canvas.isFunction(null)).toBeFalsy();
            }); 
            it("Should know that undefined is not a function", function(){
                expect(Sfdc.canvas.isFunction(undefined)).toBeFalsy();
            });
            it("Should know that empty string is not a function", function(){
                expect(Sfdc.canvas.isFunction("")).toBeFalsy();
            });
            it("Should know that 0 is not a function", function(){
                expect (Sfdc.canvas.isFunction(0)).toBeFalsy();
            });
            
            it("Should know that Built-ins are functions", function(){
                expect(Sfdc.canvas.isFunction(String)).toBeTruthy();
                expect(Sfdc.canvas.isFunction(Array)).toBeTruthy();
                expect(Sfdc.canvas.isFunction(Object)).toBeTruthy();
                expect(Sfdc.canvas.isFunction(Function)).toBeTruthy();
            });
            it("Should know that an array containing the string value, 'function', is not a function", function(){
                var functionArray = ["function"];
                expect(Sfdc.canvas.isFunction(functionArray)).toBeFalsy();
            }); 
            it("Should know that object containing 'function' is not a function", function(){
                var functionObject = {"function":"test"};
                expect(Sfdc.canvas.isFunction(functionObject)).toBeFalsy();
            });
            

            it("Should know that overriding the toString to return function does not mean the object is a function", function(){
                var evilObject = {toString: function(){ return '[function]' } };
                expect(Sfdc.canvas.isFunction(evilObject)).toBeFalsy();
            });
            it("Should know that overriding the valueOf to return function does not mean the object is a function", function(){
                var evilObject = {valueOf: function(){ return "[function]" }, toString: null};
                expect(Sfdc.canvas.isFunction(evilObject)).toBeFalsy();
            });
            
            it("Should know that Sfdc.canvas.isFunction is a function", function(){
                expect(Sfdc.canvas.isFunction(Sfdc.canvas.isFunction)).toBeTruthy();
            });
                     
            
        });
        describe("isArray tests", function(){
            it("Should know that a regular array is an array", function(){
                var regArray = ['one', 'two'];
                Sfdc.canvas.isArray(regArray);
                expect(Sfdc.canvas.isArray(regArray)).toBeTruthy();
            });
            it("Should know that an empty array is an array", function(){
                expect(Sfdc.canvas.isArray([])).toBeTruthy();
            });
            it("Should know that an object is not an array", function(){
                var testobj = {'one':'two'};
                expect(Sfdc.canvas.isArray(testobj)).toBeFalsy();
            });
            it("Should know that a string is not an array", function(){
                expect(Sfdc.canvas.isArray('hello')).toBeFalsy();
            });
            it("Should know that a function that returns an array is an array", function(){
                var str = "The quick brown fox jumps over the lazy dog";
                expect(Sfdc.canvas.isArray(str.split(" "))).toBeTruthy();
            });
            it("Should know that null is not an array", function(){
                expect(Sfdc.canvas.isArray(null)).toBeFalsy();
            });
            it("Should know that undefined is not an array", function(){
                expect(Sfdc.canvas.isArray(undefined)).toBeFalsy();
            });
            it("Should know that the arguments object is not an array", function(){
                var testfunc = function(one, two){
                    return Sfdc.canvas.isArray(arguments);  
                }
                expect(testfunc(1,2)).toBeFalsy();
            });
        });
        
        describe("isArguments function tests", function(){
            it("Should know that the arguments object is arguments", function(){
                var testfunc = function(one, two){
                    return Sfdc.canvas.isArguments(arguments);  
                }
                expect(testfunc(1,2)).toBeTruthy();
            });
            
            //is this a valid test case?
            xit("Should know that the objects with a callee value are not arguments", function(){
                var myobj = {
                    one: 'one',
                    callee: 'not what you think it is'
                 }
                 expect(Sfdc.canvas.isArguments(myobj)).toBeFalsy();
            });
            
        });
        
        describe("isObject function tests", function(){
            it("Should know that simple object is an object", function(){
                var obj = {test: function(){ return "test" }, 1: "one"};
                expect(Sfdc.canvas.isObject(obj)).toBeTruthy();
            });
            it("Should know that built-ins are object", function(){
                expect(Sfdc.canvas.isObject(new Boolean(0))).toBeTruthy();
                expect(Sfdc.canvas.isObject(new String("hi"))).toBeTruthy();
                expect(Sfdc.canvas.isObject(new Date())).toBeTruthy();
                expect(Sfdc.canvas.isObject(new Array())).toBeTruthy();
                expect(Sfdc.canvas.isObject(/hi/i)).toBeTruthy();
            });
            it("Should know that null is not an object", function(){
                expect(Sfdc.canvas.isObject(null)).toBeFalsy();
            });
            it("Should know that undefined is not an object", function(){
                var a;
                expect(Sfdc.canvas.isObject(a)).toBeFalsy();
            });
            it("Should know that empty object is an object", function(){
                var a= {};
                expect(Sfdc.canvas.isObject(a)).toBeTruthy();
            })
            
            //is this valid?
            xit("Should know that string is an object", function(){    
                var a = "hi";
                expect(Sfdc.canvas.isObject(a)).toBeTruthy();
            });
        
            it("Should know that this is an object", function(){
                expect(Sfdc.canvas.isObject(this)).toBeTruthy();
            }); 
        });
          
        
        describe("Each tests", function(){
            it("Should add to each object", function(){
                var People = new Array();
                var pass = true
                function Person(name, age){
                    this.name = name;
                    this.age = age;
                }
                //populate test array
                for(var i = 0;i<11;i++){
                    People[i] = new Person("test", i);
                }
                function addBarToArrayElements(element, index, array) { 
                        element.foo = "bar" + index;  
                    } 
                //add foo to each object in the array
                Sfdc.canvas.each(People,addBarToArrayElements);
                
                //check each object for foo
                for(var i = 0;i < People.length;i++){
                    expect(People[i].foo).toEqual("bar" + i);                   
                }
      
            });
        });
        
        describe("toArray function tests", function(){
            it("Should return empty array when called with undefined object", function(){
                var a;
                expect(Sfdc.canvas.toArray(a)).toEqual([]);
            });
            it("Should return empty array when called without parameters", function(){
                expect(Sfdc.canvas.toArray()).toEqual([]);
            });

        });        

});

