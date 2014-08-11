/**
* Copyright (c) 2014, salesforce.com, inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without modification, are permitted provided
* that the following conditions are met:
*
* Redistributions of source code must retain the above copyright notice, this list of conditions and the
* following disclaimer.
*
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
* the following disclaimer in the documentation and/or other materials provided with the distribution.
*
* Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
* promote products derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
* WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
* PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
* ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
* TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
* HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
* NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
*/
/*jslint bitwise:false */
(function (global) {

    "use strict";

    if (global.Sfdc && global.Sfdc.canvas && global.Sfdc.canvas.module) {
        return;
    }

    // Preserve any external modules created on canvas
    // (This is the case with controller.js)
    var extmodules = {};
    if (global.Sfdc && global.Sfdc.canvas) {
        for (var key in global.Sfdc.canvas) {
            if (global.Sfdc.canvas.hasOwnProperty(key)) {
                extmodules[key] = global.Sfdc.canvas[key];
            }
        }
    }

    // cached references
    //------------------

    var oproto = Object.prototype,
        aproto = Array.prototype,
        doc = global.document,
        keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        /**
        * @class Canvas
        * @exports $ as Sfdc.canvas
        */
        // $ functions
        // The Sfdc.canvas global object is made available in the global scope.  The reveal to the global scope is done later.
        $ = {

            // type utilities
            //---------------
            
            /**
            * @description Checks whether an object contains an uninherited property.
            * @param {Object} obj The object to check
            * @param {String} prop The property name to check for
            * @returns {Boolean} <code>true</code> if the property exists for the object and isn't inherited; otherwise <code>false</code>
            */
            hasOwn: function (obj, prop) {
                return oproto.hasOwnProperty.call(obj, prop);
            },
            
            /**
            * @description Checks whether an object is currently undefined.
            * @param {Object} value The object to check
            * @returns {Boolean} <code>true</code> if the object or value is of type undefined; otherwise <code>false</code>
            */
            isUndefined: function (value) {
                var undef;
                return value === undef;
            },
            
            /**
            * @description Checks whether an object is undefined, null, or an empty string.
            * @param {Object} value The object to check
            * @returns {Boolean} <code>true</code> if the object or value is of type undefined; otherwise <code>false</code>
            */
            isNil: function (value) {
                return $.isUndefined(value) || value === null || value === "";
            },
            
            /**
            * @description Checks whether a value is a number. This function doesn't resolve strings to numbers.
            * @param {Object} value Object to check
            * @returns {Boolean} <code>true</code> if the object or value is a number; otherwise <code>false</code>
            */
            isNumber: function (value) {
                return !!(value === 0 || (value && value.toExponential && value.toFixed));
            },

            /**
            * @description Checks whether an object is a function.
            * @param {Object} value The object to check
            * @returns {Boolean} <code>true</code> if the object or value is a function; otherwise <code>false</code>
            */
            isFunction: function (value) {
                return !!(value && value.constructor && value.call && value.apply);
            },
            
            /**
            * @description Checks whether an object is an array.
            * @param {Object} value The object to check
            * @function
            * @returns {Boolean} <code>true</code> if the object or value is of type array; otherwise <code>false</code>
            */
            isArray: Array.isArray || function (value) {
                return oproto.toString.call(value) === '[object Array]';
            },
            
            /**
            * @description Checks whether an object is the argument set for a function.
            * @param {Object} value The object to check
            * @returns {Boolean} <code>true</code> if the object or value is the argument set for a function; otherwise <code>false</code>
            */
            isArguments: function (value) {
                return !!(value && $.hasOwn(value, 'callee'));
            },
            
            /**
            * @description Checks whether a value is of type object and isn't null.
            * @param {Object} value The object to check
            * @returns {Boolean} <code>true</code> if the object or value is of type object; otherwise <code>false</code>
            */
            isObject: function (value) {
                return value !== null && typeof value === 'object';
            },

            /**
             * @description Checks whether a value is of type string and isn't null.
             * @param {Object} value The string to check
             * @returns {Boolean} <code>true</code> if the string or value is of type string; otherwise <code>false</code>
             */
            isString: function(value) {
                return value !== null && typeof value == "string";
            },

            /**
             * @description Checks whether the value appears to be JSON.
             * @param {String} value The JSON string to check
             * @returns {Boolean} <code>true</code> if the string starts and stops with {} , otherwise <code>false</code>
             */
            appearsJson: function (value) {
                return (/^\{.*\}$/).test(value);
            },

            // common functions
            //-----------------
            
            /**
            * @description An empty or blank function.  
            */
            nop: function () {
                /* no-op */
            },
            
            /**
            * @description Runs the specified function.
            * @param {Function} fn The function to run
            */
            invoker: function (fn) {
                if ($.isFunction(fn)) {
                    fn();
                }
            },
            
            /**
            * @description Returns the argument.
            * @param {Object} obj The object to return, untouched.
            * @returns {Object} The argument used for this function call
            */
            identity: function (obj) {
                return obj;
            },

            // @todo consider additional tests for: null, boolean, string, nan, element, regexp... as needed
            /**
            * @description Calls a defined function for each element in an object.
            * @param {Object} obj The object to loop through.  
                The object can be an array, an array like object, or a map of properties.
            * @param {Function} it The callback function to run for each element
            * @param {Object} [ctx] The context object to be used for the callback function.
                Defaults to the original object if not provided.
            */
            each: function (obj, it, ctx) {
                if ($.isNil(obj)) {
                    return;
                }
                var nativ = aproto.forEach, i = 0, l, key;
                l = obj.length;
                ctx = ctx || obj;
                // @todo: looks like native method will not break on return false; maybe throw breaker {}
                if (nativ && nativ === obj.forEach) {
                    obj.forEach(it, ctx);
                }
                else if ($.isNumber(l)) { // obj is an array-like object
                    while (i < l) {
                        if (it.call(ctx, obj[i], i, obj) === false) {
                            return;
                        }
                        i += 1;
                    }
                }
                else {
                    for (key in obj) {
                        if ($.hasOwn(obj, key) && it.call(ctx, obj[key], key, obj) === false) {
                            return;
                        }
                    }
                }
            },
            
            /**
             * @description Convenience method to prepend a method with a fully qualified url, if the
             * method does not begin with http protocol.
             * @param {String} orig The original url to check
             * @param {String} newUrl The new url to use if it does not begin with http(s) protocol.
             * @returns {String} orig if the url begins with http, or newUrl if it does not.
             */
            startsWithHttp: function(orig, newUrl) {
                return  !$.isString(orig) ? orig : (orig.substring(0, 4) === "http") ? orig : newUrl;
            },

            
            /**
            * @description Creates a new array with the results of calling the
                function on each element in the object.
            * @param {Object} obj The object to use
            * @param {Function} it The callback function to run for each element
            * @param {Object} [ctx] The context object to be used for the callback function.
                Defaults to the original object if not provided.
            * @returns {Array} The array that is created by calling the function on each
                element in the object.
            */
            map: function (obj, it, ctx) {
                var results = [], nativ = aproto.map;
                if ($.isNil(obj)) {
                    return results;
                }
                if (nativ && obj.map === nativ) {
                    return obj.map(it, ctx);
                }
                ctx = ctx || obj;
                $.each(obj, function (value, i, list) {
                    results.push(it.call(ctx, value, i, list));
                });
                return results;
            },
            
            /** 
            * @description Creates an array containing all the elements of the given object.
            * @param {Object} obj The source object used to create the array
            * @returns {Array} An array containing all the elements in the object.
            */
            values: function (obj) {
                return $.map(obj, $.identity);
            },
            
            /**
            * @description Creates a new array containing the selected elements of the given array.
            * @param {Array} array The array to subset
            * @param {Integer} [begin=0] The index that specifies where to start the selection
            * @param {Integer} [end = array.length] The index that specifies where to end the selection
            * @returns {Array} A new array that contains the selected elements.
            */
            slice: function (array, begin, end) {
                /* FF doesn't like undefined args for slice so ensure we call with args */
                return aproto.slice.call(array, $.isUndefined(begin) ? 0 : begin, $.isUndefined(end) ? array.length : end);
            },

            /**
            * @description Creates an array from an object.
            * @param {Object} iterable The source object used to create the array.
            * @returns {Array} The new array created from the object.
            */
            toArray: function (iterable) {
                if (!iterable) {
                    return [];
                }
                if (iterable.toArray) {
                    return iterable.toArray;
                }
                if ($.isArray(iterable)) {
                    return iterable;
                }
                if ($.isArguments(iterable)) {
                    return $.slice(iterable);
                }
                return $.values(iterable);
            },
            
            /**
            * @description Calculates the number of elements in an object.
            * @param {Object} obj The object to size
            * @returns {Integer} The number of elements in the object.
            */
            size: function (obj) {
                return $.toArray(obj).length;
            },
            
            /**
            * @description Returns the location of an element in an array.
            * @param {Array} array The array to check
            * @param {Object} item The item to search for within the array
            * @returns {Integer} The index of the element within the array.  
                Returns -1 if the element isn't found.
            */            
            indexOf: function (array, item) {
                var nativ = aproto.indexOf, i, l;
                if (!array) {
                    return -1;
                }
                if (nativ && array.indexOf === nativ) {
                    return array.indexOf(item);
                }
                for (i = 0, l = array.length; i < l; i += 1) {
                    if (array[i] === item) {
                        return i;
                    }
                }
                return -1;
            },
            
            /**
             * @description Returns true if the object is null, or the object has no 
             * enumerable properties/attributes.
             * @param {Object} obj The object to check
             * @returns {Boolean} <code>true</code> if the object or value is null, or is an object with
             * no enumerable properties/attributes.
             */            
            isEmpty: function(obj){
                if (obj === null){
                    return true;
                }
                if ($.isArray(obj) || $.isString(obj)){
                	return obj.length === 0;
                }
                for (var key in obj){
                    if ($.hasOwn(obj, key)){
                        return false;
                    }
                } 
                return true;
            },
            
            /**
            * @description Removes an element from an array.
            * @param {Array} array The array to modify
            * @param {Object} item The element to remove from the array
            */
            remove: function (array, item) {
                var i = $.indexOf(array, item);
                if (i >= 0) {
                    array.splice(i, 1);
                }
            },

            /**
             * @description Serializes an object into a string that can be used as a URL query string.
             * @param {Object|Array} a The array or object to serialize
             * @param {Boolean} [encode=false] Indicates that the string should be encoded
             * @returns {String} A string representing the object as a URL query string.
             */
            param: function (a, encode) {
                var s = [];

                encode = encode || false;

                function add( key, value ) {

                    if ($.isNil(value)) {return;}
                    value = $.isFunction(value) ? value() : value;
                    if ($.isArray(value)) {
                        $.each( value, function(v, n) {
                            add( key, v );
                        });
                    }
                    else {
                        if (encode) {
                            s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
                        }
                        else {
                            s[ s.length ] = key + "=" + value;
                        }
                    }
                }

                if ( $.isArray(a)) {
                    $.each( a, function(v, n) {
                        add( n, v );
                    });
                } else {
                    for ( var p in a ) {
                        if ($.hasOwn(a, p)) {
                            add( p, a[p]);
                        }
                    }
                }
                return s.join("&").replace(/%20/g, "+");
            },

            /**
             * @description Converts a query string into an object.
             * @param {String} q param1=value1&amp;param1=value2&amp;param2=value2
             * @return {Object} {param1 : ['value1', 'value2'], param2 : 'value2'}
             */
            objectify : function (q) {
                var arr, obj = {}, i, p, n, v, e;
                if ($.isNil(q)) {return obj;}
                if (q.substring(0, 1) == '?') {
                    q = q.substring(1);
                }
                arr = q.split('&');
                for (i = 0; i < arr.length; i += 1) {
                    p = arr[i].split('=');
                    n = p[0];
                    v = p[1];
                    e = obj[n];
                    if (!$.isNil(e)) {
                        if ($.isArray(e)) {
                            e[e.length] = v;
                        }
                        else {
                            obj[n] = [];
                            obj[n][0] = e;
                            obj[n][1] = v;
                        }
                    }
                    else {
                        obj[n] = v;
                    }
                }
                return obj;
            },

            /**
             * @description Strips out the URL to {scheme}://{host}:{port}.  Removes any path and query string information.
             * @param {String} url The URL to be modified
             * @returns {String} The {scheme}://{host}:{port} portion of the URL.
             */
            stripUrl : function(url) {
                return ($.isNil(url)) ? null : url.replace( /([^:]+:\/\/[^\/\?#]+).*/, '$1');
            },

            /**
             * @description Appends the query string to the end of the URL and removes any hash tag.
             * @param {String} url The URL to be appended to
             * @returns The URL with the query string appended.
             */
            query : function(url, q) {
                if ($.isNil(q)) {
                    return url;
                }
                // Strip any old hash tags
                url = url.replace(/#.*$/, '');
                url += (/^\#/.test(q)) ? q  : (/\?/.test( url ) ? "&" : "?") + q;
                return url;
            },


            // strings
            //--------
            /**
            * @description Adds the contents of two or more objects to
                a destination object.
            * @param {Object} dest The destination object to modify
            * @param {Object} mixin1-n An unlimited number of objects to add to the destination object
            * @returns {Object} The modified destination object
            */
            extend: function (dest /*, mixin1, mixin2, ... */) {
                $.each($.slice(arguments, 1), function (mixin, i) {
                    $.each(mixin, function (value, key) {
                        dest[key] = value;
                    });
                });
                return dest;
            },

            /**
             * @description Determines if a string ends with a particular suffix.
             * @param {String} str The string to check
             * @param {String} suffix The suffix to check for
             * @returns {boolean} <code>true</code>, if the string ends with suffix; otherwise, <code>false</code>.
             */
            endsWith: function (str, suffix) {
                return str.indexOf(suffix, str.length - suffix.length) !== -1;
            },

            capitalize: function(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            },

            uncapitalize: function(str) {
                return str.charAt(0).toLowerCase() + str.slice(1);
            },

            /**
             * @description decode a base 64 string.
             * @param {String} str - base64 encoded string
             * @return decoded string
             */
            decode : function(str) {
                var output = [], chr1, chr2, chr3 = "", enc1, enc2, enc3, enc4 = "", i = 0;
                str = str.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(str.charAt(i++));
                    enc2 = keyStr.indexOf(str.charAt(i++));
                    enc3 = keyStr.indexOf(str.charAt(i++));
                    enc4 = keyStr.indexOf(str.charAt(i++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    output.push(String.fromCharCode(chr1));
                    if (enc3 !== 64) {
                        output.push(String.fromCharCode(chr2));
                    }
                    if (enc4 !== 64) {
                        output.push(String.fromCharCode(chr3));
                    }
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < str.length);
                return $.escapeToUTF8(output.join(''));
            },
            
    		escapeToUTF8: function(str) {
    			var outStr = "";
    			var i = 0;

    			while (i < str.length) {

    				var c = str.charCodeAt(i++);
    				var c1;

    				if (c < 128) {
    					outStr += String.fromCharCode(c);
    				} else if (c > 191 && c < 224) {
    					c1 = str.charCodeAt(i++);
    					outStr += String.fromCharCode((c & 31) << 6 | c1 & 63);
    				} else {
    					c1 = str.charCodeAt(i++);
    					var c2 = str.charCodeAt(i++);
    					outStr += String.fromCharCode(
    							(c & 15) << 12 | (c1 & 63) << 6 | c2 & 63);
    				}
    			}
    			return outStr;
    		},


            // Events
            //--------
            /**
             * @description Validates the event name.
             * @param {String} name Name of the event; can include the namespace (namespace.name).
             * @param {String} res Reserved namespace name to allow against default
             * @returns {int} error code, 0 if valid
             */
             validEventName : function(name, res) {
                var ns, parts = name.split(/\./),
                    regex = /^[$A-Z_][0-9A-Z_$]*$/i,
                    reserved = {
                        'sfdc':true, 'canvas':true,
                        'force':true, 'salesforce':true, 'chatter':true
                    };
                $.each($.isArray(res) ? res : [res], function (v) {
                    reserved[v] = false;
                });
                if (parts.length > 2) {
                    return 1;
                }
                if (parts.length === 2) {
                    ns = parts[0].toLowerCase();
                    if (reserved[ns]) {
                        return 2;
                    }
                }
                if (!regex.test(parts[0]) || !regex.test(parts[1])) {
                    return 3;
                }
                return 0;
            },


            /**
            * @name Sfdc.canvas.prototypeOf
            * @function
            * @description Returns the prototype of the specified object.
            * @param {Object} obj The object for which to find the prototype
            * @returns {Object} The object that is the prototype of the given object.
            */
            prototypeOf: function (obj) {
                var nativ = Object.getPrototypeOf,
                    proto = '__proto__';
                if ($.isFunction(nativ)) {
                    return nativ.call(Object, obj);
                }
                else {
                    if (typeof {}[proto] === 'object') {
                        return obj[proto];
                    }
                    else {
                        return obj.constructor.prototype;
                    }
                }
            },

            /**
            * @description Adds a module to the global.Sfdc.canvas object.
            * @param {String} ns The namespace for the new module
            * @decl {Object} The module to add.
            * @returns {Object} The global.Sfdc.canvas object with a new module added.
            */
            module: function(ns, decl) {
                var parts = ns.split('.'), parent = global.Sfdc.canvas, i, length;

                // strip redundant leading global
                if (parts[1] === 'canvas') {
                    parts = parts.slice(2);
                }

                length = parts.length;
                for (i = 0; i < length; i += 1) {
                    // create a property if it doesn't exist
                    if ($.isUndefined(parent[parts[i]])) {
                        parent[parts[i]] = {};
                    }
                    parent = parent[parts[i]];
                }

                if ($.isFunction(decl)) {
                    decl = decl();
                }
                return $.extend(parent, decl);
            },

            // dom
            //----            
            // Returns window.document element when invoked from a browser otherwise mocked document for
            // testing. (Do not add JSDoc tags for this one)
            document: function() {
                return doc;
            },
            /**
            * @description Returns the DOM element with the given ID in the current document. 
            * @param {String} id The ID of the DOM element
            * @returns {DOMElement} The DOM element with the given ID.  Returns null if the element doesn't exist.
            */
            byId: function (id) {
                return doc.getElementById(id);
            },
            /**
            * @description Returns a set of DOM elements with the given class names in the current document.
            * @param {String} class The class names to find in the DOM; multiple
                classnames can be passed, separated by whitespace
            * @returns {Array} Set of DOM elements that all have the given class name
            */
            byClass: function (clazz) {
                return doc.getElementsByClassName(clazz);
            },
            /**
            * @description Returns the value for the given attribute name on the given DOM element.
            * @param {DOMElement} el The element on which to check the attribute.
            * @param {String} name The name of the attribute for which to find a value.
            * @returns {String} The given attribute's value.
            */
            attr : function(el, name) {
                var a = el.attributes, i;
                for (i = 0; i < a.length; i += 1) {
                    if (name === a[i].name) {
                        return a[i].value;
                    }
                }
            },

            /**
             * @description Registers a callback to be called after the DOM is ready.
             * @param {Function} cb The callback function to be called
             */
            onReady : function(cb) {
                if ($.isFunction(cb)) {
                    readyHandlers.push(cb);
                }
            },

            console : (function() {

                var enabled = false;

                // Prevent errors in browsers without console.log
                if (window && !window.console) {window.console = {};}
                if (window && !window.console.log) {window.console.log = function(){};}
                if (window && !window.console.error) {window.console.error = function(){};}

                function isSessionStorage() {
                    try {
                        return 'sessionStorage' in window && window.sessionStorage !== null;
                    } catch (e) {
                        return false;
                    }
                }

                /**
                * @description Writes a message to the console. You may pass as many arguments as you'd like.
                * The first argument to log may be a string containing printf-like string substitution patterns.
                * Note: this function will be ignored for versions of IE that don't support console.log
                *
                * @public
                * @name Sfdc.canvas.console#log
                * @function
                * @param {Object} arguments Objects(s) to pass to the logger
                * @example
                * // Log a simple string to the console if the logger is enbabled.
                * Sfdc.canvas.console.log("Hello world");
                *
                * @example
                * // Log a formatted string to the console if the logger is enbabled.
                * Sfdc.canvas.console.log("Hello %s", "world");
                *
                * @example
                * // Log an object to the console if the logger is enbabled.
                * Sfdc.canvas.console.log({hello : "Hello", world : "World"});
                *
                */
                function log() {}

                /**
                * @description Writes an error message to the console. You may pass as many arguments as you'd like.
                * The first argument to log may be a string containing printf-like string substitution patterns.
                * Note: this function will be ignored for versions of IE that don't support console.error
                *
                * @public
                * @name Sfdc.canvas.console#error
                * @function
                * @param {Object} arguments Objects(s) to pass to the logger

                 * @example
                * // Log a simple string to the console if the logger is enbabled.
                * Sfdc.canvas.console.error("Something wrong");
                *
                * @example
                * // Log a formatted string to the console if the logger is enbabled.
                * Sfdc.canvas.console.error("Bad Status %i", 404);
                *
                * @example
                * // Log an object to the console if the logger is enbabled.
                * Sfdc.canvas.console.error({text : "Not Found", status : 404});
                *
                */
                function error() {}

                function activate() {
                    if (Function.prototype.bind) {
                        log = Function.prototype.bind.call(console.log, console);
                        error = Function.prototype.bind.call(console.error, console);
                    }
                    else {
                        log = function() {
                            Function.prototype.apply.call(console.log, console, arguments);
                        };
                        error = function() {
                            Function.prototype.apply.call(console.error, console, arguments);
                        };
                    }
                }

                function deactivate() {
                    log = function() {};
                    error = function() {};
                }

                /**
                * @description Enable logging. subsequent calls to log() or error() will be displayed on the javascript console.
                * This command can be typed from the javascript console.
                *
                * @example
                * // Enable logging
                * Sfdc.canvas.console.enable();
                */
                function enable() {
                    enabled = true;
                    if (isSessionStorage()) {sessionStorage.setItem("canvas_console", "true");}
                    activate();
                }

                /**
                * @description Disable logging. Subsequent calls to log() or error() will be ignored. This command can be typed
                * from the javascript console.
                *
                * @example
                * // Disable logging
                * Sfdc.canvas.console.disable();
                */
                function disable() {
                    enabled = false;
                    if (isSessionStorage()) {sessionStorage.setItem("canvas_console", "false");}
                    deactivate();
                }

                // Survive page refresh, if enabled or disable previously honor it.
                // This is only called once when the page is loaded
                enabled = (isSessionStorage() && sessionStorage.getItem("canvas_console") === "true");
                if (enabled) {activate();} else {deactivate();}

                return {
                    enable : enable,
                    disable : disable,
                    log : log,
                    error : error
                };
            }())
        },

        readyHandlers = [],

        /**
         * @description
         * @param {Function} cb The function to run when ready.
         */
        canvas = function (cb) {
            if ($.isFunction(cb)) {
                readyHandlers.push(cb);
            }
        };

        /**
         * Provide a consistent/performant DOMContentLoaded across all browsers
         * Implementation was based off of the following tutorial
         * http://javascript.info/tutorial/onload-ondomcontentloaded?fromEmail=1
         */
        (function () {

            var called = false, isFrame, fn;

            function ready() {
                if (called) {return;}
                called = true;
                ready = $.nop;
                $.each(readyHandlers, $.invoker);
                readyHandlers = [];
            }

            function tryScroll(){
                if (called) {return;}
                try {
                    document.documentElement.doScroll("left");
                    ready();
                } catch(e) {
                    setTimeout(tryScroll, 30);
                }
            }

            if ( document.addEventListener ) { // native event
                document.addEventListener( "DOMContentLoaded", ready, false );
            } else if ( document.attachEvent ) {  // IE

                try {
                    isFrame = self !== top;
                } catch(e) {}

                // IE, the document is not inside a frame
                if ( document.documentElement.doScroll && !isFrame ) {
                    tryScroll();
                }

                // IE, the document is inside a frame
                document.attachEvent("onreadystatechange", function(){
                    if ( document.readyState === "complete" ) {
                        ready();
                    }
                });
            }

            // Old browsers
            if (window.addEventListener) {
                window.addEventListener('load', ready, false);
            } else if (window.attachEvent) {
                window.attachEvent('onload', ready);
            } else {
                fn = window.onload; // very old browser, copy old onload
                window.onload = function() { // replace by new onload and call the old one
                    if (fn) {fn();}
                    ready();
                };
            }
        }());

    $.each($, function (fn, name) {
        canvas[name] = fn;
    });

    // Add those external modules back in
    $.each(extmodules, function (fn, name) {
        canvas[name] = fn;
    });


    (function () {
        var method;
        var noop = function () { };
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = (typeof window !== 'undefined' && window.console) ? window.console : {};

        while (length--) {
            method = methods[length];

            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }

    }());


    if (!global.Sfdc) {
        global.Sfdc = {};
    }

    global.Sfdc.canvas = canvas;


}(this));
