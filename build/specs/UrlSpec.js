var jasmine = require('jasmine-node');
describe("Canvas Framework", function(){
    var Sfdc = require('../../js/canvas.js').Sfdc;
    describe("Url Tests", function(){
        describe("Param Function Tests", function(){
            var params;
            it("Should parameterize one key-value pair", function(){
                params = Sfdc.canvas.param({abc : "xyz"});
                expect(params).toEqual("abc=xyz");
            });
            it("Should parameterize multiple key-value pairs", function () {
                params = Sfdc.canvas.param({abc : "xyz", def : "123"});
                expect(params).toEqual("abc=xyz&def=123");
            });
            it("Should parameterize an array", function(){
                params = Sfdc.canvas.param(['abc','xyz']);
                expect(params).toEqual("0=abc&1=xyz");
                
            });
            
            it("Should handle an array as a value", function(){
                params = Sfdc.canvas.param({abc: ['def','xyz']});
                expect(params).toEqual("abc=def&abc=xyz");
            })
            
            it("Should handle a null value", function(){
                params = Sfdc.canvas.param({abc: null});
                expect(params).toEqual("");
            });
            
            it("Should not die with an empty param list", function(){
                params = Sfdc.canvas.param({});
                expect(params).toEqual("");
            });
            it("Should not die with a null param list", function(){
                params = Sfdc.canvas.param(null);
                expect(params).toEqual("");
            });
            
            it("Should properly encode the key when indicated", function(){
                params = Sfdc.canvas.param({",/?:@&=+$#" : "xyz"},true);
                expect(params).toEqual("%2C%2F%3F%3A%40%26%3D%2B%24%23=xyz");
            });
            it("Should properly encode the value when indicated", function(){
                params = Sfdc.canvas.param({abc : ",/?:@&=+$#"},true);
                expect(params).toEqual("abc=%2C%2F%3F%3A%40%26%3D%2B%24%23");
            });
            it("Should not encode the key when the encode param is set to false", function(){
                params = Sfdc.canvas.param({",/?:@&=+$#" : "xyz"},false);
                expect(params).toEqual(",/?:@&=+$#=xyz");
            });
            it("Should not encode the value when the encode param is set to false", function(){
                params = Sfdc.canvas.param({abc : ",/?:@&=+$#"},false);
                expect(params).toEqual("abc=,/?:@&=+$#");
            });
            it("Should return empty string when function is passed in", function(){
               params =  Sfdc.canvas.param(function(){console.log;});
               expect(params).toEqual("");
            });
            
            it("Should be able to mix arrays and values", function(){
               params = Sfdc.canvas.param({abc : 'xyz', def: ['ghi','jkl']});
               expect(params).toEqual("abc=xyz&def=ghi&def=jkl");
            });

        });
        
        describe("Strip Function Tests", function(){
            var testUrl, stripped, expected;
            
            it("Should return the url unchanged when it does not have params", function(){
                testUrl = "http://foo.bar.com:8080";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(testUrl);
            });
            
            it("Should return the url unchanged - localhost without port", function(){
                testUrl = "http://localhost";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(testUrl);
            });

            it("Should return the url unchanged - localhost with port", function() {
                testUrl = "http://localhost:8080";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(testUrl);
            });

            it("Should return the url unchanged - actural sfdc url with https", function (){             
                testUrl = "https://na1.salesforce.com";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(testUrl);
            });

            it("Should return the url unchanged - actural sfdc url with port", function (){  
                testUrl = "https://na1.salesforce.com:8080";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(testUrl);
            });

            it("Should strip off the path", function(){
                testUrl = "http://localhost/foo";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expected = "http://localhost";
                expect(stripped).toEqual(expected);
            });
            
            it("Should be able to strip an ip address", function(){
                testUrl = "https://10.3.4.50/foo/bar/";
                expected = "https://10.3.4.50";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(expected);
            });
            
            it("Should strip off mulitple paths", function(){
                testUrl = "http://localhost:8080/foo/bar";
                expected = "http://localhost:8080";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(expected);
            });

            it("Should strip off path and param", function(){
                testUrl = "https://na1.salesforce.com/apex?id=0x23586902";
                expected = "https://na1.salesforce.com";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(expected);
            })
           
            it("Should strip off param", function(){
                testUrl = "https://na1.salesforce.com:8080?foo=bar";
                expected = "https://na1.salesforce.com:8080";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(expected);
            });
            
            it("Should strip off multiple params", function(){
                testUrl = "https://na1.salesforce.com:8080/foo?foo=bar&baz=spaz";
                expected = "https://na1.salesforce.com:8080";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(expected);
            })
            
            it("Should strip off 2 paths and url hash", function(){
                testUrl = "http://localhost:8080/foo/bar#http://parent.com";
                expected = "http://localhost:8080";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(expected);
            })
            
            it("Should strip off path, params and hash", function(){
                testUrl = "https://na2.salesforce.com/apex?id=0x23586902#abcdefg";
                expected = "https://na2.salesforce.com";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(expected);
            });
                
            it("Should strip params and hash", function(){
                testUrl = "https://na1.salesforce.com:8080?foo=bar#somehash";
                expected = "https://na1.salesforce.com:8080";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(expected);
            })
            
            it("Should strip just the hash", function(){
                testUrl = "https://na3.salesforce.com#somehash";
                expected = "https://na3.salesforce.com";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(expected);
            });
            
            it("Should strip off jsp", function(){
                testUrl = "https://na3.salesforce.com/my.jsp";
                expected = "https://na3.salesforce.com";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(expected);
            });
            
            it("Should handle null gracefully", function(){
                testUrl = null;
                expected = null;
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(expected);
            });
            
            it("Should handle empty string gracefully", function(){
                testUrl = "";
                expected = null;
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(expected);
            });
            
            it("Should handle non urls gracefully", function(){
                testUrl = "just a string#1";
                expected = "just a string#1";
                stripped = Sfdc.canvas.stripUrl(testUrl);
                expect(stripped).toEqual(expected);
            })

        });   
        
        describe ("Query Function Tests", function(){
            var testUrl, newUrl, expected;

            it("Should appendNoParamsHash", function() {
                testUrl = "https://localhost.com/foo/bar#foo";
                expected = "https://localhost.com/foo/bar#bar";
                newUrl = Sfdc.canvas.query(testUrl, "#bar");
                expect(newUrl).toEqual(expected);
            });

            it("Should appendOnaParamHash", function() {
                testUrl = "https://localhost.com/foo/bar?one=two#foo";
                expected = "https://localhost.com/foo/bar?one=two#bar";
                newUrl = Sfdc.canvas.query(testUrl, "#bar");
                expect(newUrl).toEqual(expected);
            });

            it("Should  appendTwoParamHash", function() {
                testUrl = "https://localhost.com/foo/bar?one=two&three=four#foo";
                expected = "https://localhost.com/foo/bar?one=two&three=four#bar";
                newUrl = Sfdc.canvas.query(testUrl, "#bar");
                expect(newUrl).toEqual(expected);
            });

            it("Should appendFirstParam", function() {
                testUrl = "https://localhost.com/foo/bar#foo";
                expected = "https://localhost.com/foo/bar?abc=def#bar";
                newUrl = Sfdc.canvas.query(testUrl, "abc=def#bar");
                expect(newUrl).toEqual(expected);
            });

            it("Should  appendSecondParam", function() {
                testUrl = "https://localhost.com/foo/bar?one=two#foo";
                expected = "https://localhost.com/foo/bar?one=two&abc=def#bar";
                newUrl = Sfdc.canvas.query(testUrl, "abc=def#bar");
                expect(newUrl).toEqual(expected);
            });

            it("Should appendThirdParam", function() {
                testUrl = "https://localhost.com/foo/bar?one=two&three=four#foo";
                expected = "https://localhost.com/foo/bar?one=two&three=four&xyz=123#bar";
                newUrl = Sfdc.canvas.query(testUrl, "xyz=123#bar");
                expect(newUrl).toEqual(expected);
            });

            it("Should appendEmptyString", function() {
                testUrl = "https://localhost.com/foo/bar#foo";
                expected = "https://localhost.com/foo/bar#foo";
                newUrl = Sfdc.canvas.query(testUrl, "");
                expect(newUrl).toEqual(expected);
            });

            it("Should  appendNull", function() {
                testUrl = "https://localhost.com/foo/bar#foo";
                expected = "https://localhost.com/foo/bar#foo";
                newUrl = Sfdc.canvas.query(testUrl, null);
                expect(newUrl).toEqual(expected);
            });


            it("Should  appendNoStartHash", function() {
                testUrl = "https://localhost.com/foo/bar?one=two";
                expected = "https://localhost.com/foo/bar?one=two#bar";
                newUrl = Sfdc.canvas.query(testUrl, "#bar");
                expect(newUrl).toEqual(expected);
            });

            it("Should appendTwoParamsEmptyString", function() {
                testUrl = "https://localhost.com/foo/bar?one=two&three=four#foo";
                expected = "https://localhost.com/foo/bar?one=two&three=four#foo";
                newUrl = Sfdc.canvas.query(testUrl, "");
                expect(newUrl).toEqual(expected);
            });

            it("Should appendOnaParamNoStartHash", function() {
                testUrl = "https://localhost.com/foo/bar?one=two";
                expected = "https://localhost.com/foo/bar?one=two&abc=def#bar";
                newUrl = Sfdc.canvas.query(testUrl, "abc=def#bar");
                expect(newUrl).toEqual(expected);
            });

            it("Should appendTwoParamsNoStartHash", function() {
                testUrl = "https://localhost.com/foo/bar?one=two&three=four";
                expected = "https://localhost.com/foo/bar?one=two&three=four&xyz=123#bar";
                newUrl = Sfdc.canvas.query(testUrl, "xyz=123#bar");
                expect(newUrl).toEqual(expected);
            });

            it("Should appendEmptyStringNoHash", function() {
                testUrl = "https://localhost.com/foo/bar";
                expected = "https://localhost.com/foo/bar";
                newUrl = Sfdc.canvas.query(testUrl, "");
                expect(newUrl).toEqual(expected);
            });
        }) ;

        
    });
});
