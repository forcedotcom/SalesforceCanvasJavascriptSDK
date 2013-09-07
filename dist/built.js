'use strict';
// Source: js/canvas.js
/**
* Copyright (c) 2011, salesforce.com, inc.
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
(function (global) {

if (global.Sfdc && global.Sfdc.canvas) {
        return;
    }

    // cached references
    //------------------

    var oproto = Object.prototype,
        aproto = Array.prototype,
        doc = global.document,
        /**
        * @class Canvas
        * @exports $ as Sfdc.canvas
        */
        // $ functions
        // The canvas global object is made available in the global scope.  The reveal to the global scope is done later.
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
             * Note: this doesn't handle multi-value parameters.  For instance,
             * passing in <code>?param=value1&​param=value2</code> will not return <code>['value1', 'value2']</code>
             *
             * @param {String} q ?param1=value1&amp;param2=value2
             * @return {Object} {param1 : 'value1', param2 : 'value2'}
             */
            objectify : function (q) {
                var o = {};
                q.replace(
                    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                    function($0, $1, $2, $3) { o[$1] = $3; }
                );
                return o;
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
            }            
       },

        readyHandlers = [],

        ready = function () {
            ready = $.nop;
            $.each(readyHandlers, $.invoker);
            readyHandlers = null;
        },

        /**
        * @description 
        * @param {Function} cb The function to run when ready.
        */
        canvas = function (cb) {
            if ($.isFunction(cb)) {
                readyHandlers.push(cb);
            }
        };

    (function () {
        var ael = 'addEventListener',
            tryReady = function () {
                if (doc && /loaded|complete/.test(doc.readyState)) {
                    ready();
                }
                else if (readyHandlers) {
                    if (!$.isNil(global.setTimeout)) {
                        global.setTimeout(tryReady, 30);
                    }
                }
            };

        if (doc && doc[ael]) {
            doc[ael]('DOMContentLoaded', ready, false);
        }

        tryReady();

        if (global[ael]) {
            global[ael]('load', ready, false);
        }
        else if (global.attachEvent) {
            global.attachEvent('onload', ready);
        }

    }());

    $.each($, function (fn, name) {
        canvas[name] = fn;
    });

    if (!global.Sfdc) { 
        global.Sfdc = {};
    }

    global.Sfdc.canvas = canvas;
    if (!global.Sfdc.JSON) {
        global.Sfdc.JSON = JSON;
    }


}(this));

// Source: js/cookies.js
/**
* Copyright (c) 2011, salesforce.com, inc.
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
(function ($$) {

var module =  (function() {

        function isSecure()
        {
            return window.location.protocol === 'https:';
        }

        /**
       * @description Create a cookie
       * @param {String} name Cookie name
       * @param {String} value Cookie value
       * @param {Integer} [days] Number of days for the cookie to remain active.
                If not provided, the cookie never expires
       */
       function set(name, value, days) {
           var expires = "", date;
           if (days) {
               date = new Date();
               date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
               expires = "; expires=" + date.toGMTString();
           }
           else {
               expires = "";
           }
           document.cookie = name + "=" + value + expires + "; path=/" +  ((isSecure() === true) ? "; secure" : "");
       }
       
       /**
       * @description Get the cookie with the specified name
       * @param {String} name The name of the cookie to retrieve
       * @returns The value of the cookie if the name is found, otherwise null
       */
       function get(name) {
           var nameEQ, ca, c, i;

           if ($$.isUndefined(name)) {
               return document.cookie.split(';');
           }

           nameEQ = name + "=";
           ca = document.cookie.split(';');
           for (i = 0; i < ca.length; i += 1) {
               c = ca[i];
               while (c.charAt(0) === ' ') {c = c.substring(1, c.length);}
               if (c.indexOf(nameEQ) === 0) {
                   return c.substring(nameEQ.length, c.length);
               }
           }
           return null;
       }
       
       /**
       * @description Remove the specified cookie by setting the expiry date to one day ago
       * @param {String} name The name of the cookie to remove.
       */
       function remove(name) {
           set(name, "", -1);
       }

       return {
            set : set,
            get : get,
            remove : remove
        };
    }());


    $$.module('Sfdc.canvas.cookies', module);

}(Sfdc.canvas));

// Source: js/oauth.js
/**
* Copyright (c) 2011, salesforce.com, inc.
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
/**
 *@namespace Sfdc.canvas.oauth
 *@name Sfdc.canvas.oauth
 */
(function ($$) {

var module =   (function() {

        var accessToken,
            instUrl,
            instId,
            tOrigin,
            childWindow;

        function init() {
            // Get the access token from the cookie (needed to survive refresh),
            // and then remove the cookie per security's request.
            accessToken = $$.cookies.get("access_token");
            $$.cookies.remove("access_token");
        }

        function query(params) {
            var r = [], n;
            if (!$$.isUndefined(params)) {
                for (n in params) {
                    if (params.hasOwnProperty(n)) {
                        // probably should encode these
                        r.push(n + "=" + params[n]);
                    }
                }
                return "?" + r.join('&');
            }
            return '';
        }
        /**
         *@private
         */
        function refresh() {
            // Temporarily set the oauth token in a cookie and then remove it
            // after the refresh.
            $$.cookies.set("access_token", accessToken);
            self.location.reload();
        }
        /**
         * @name Sfdc.canvas.oauth#login
         * @function
         * @description Opens the OAuth popup window to retrieve an OAuth token.
         * @param {Object} ctx  The context object that contains the URL, the response type, the client ID, and the callback URL
         * @docneedsimprovement
         * @example
         * function clickHandler(e)
         * {
         *  var uri;
         *  if (! connect.oauth.loggedin())
         *  {
         *   uri = connect.oauth.loginUrl();
         *   connect.oauth.login(
         *    {uri : uri,
         *     params: {
         *      response_type : "token",
         *      client_id :  "<%=consumerKey%>",
         *      redirect_uri : encodeURIComponent("/sdk/callback.html")
         *      }});
         *  } else {
         *     connect.oauth.logout();
         *  }
         *  return false;
         * }
         */
        function login(ctx) {
            var uri;

            ctx = ctx || {};
            uri = ctx.uri || "/rest/oauth2";
            ctx.params = ctx.params || {state : ""};
            ctx.params.state = ctx.params.state || ctx.callback || window.location.pathname;  // @TODO REVIEW THIS
            ctx.params.display= ctx.params.display || 'popup';
            uri = uri + query(ctx.params);
            childWindow = window.open(uri, 'OAuth', 'status=0,toolbar=0,menubar=0,resizable=0,scrollbars=1,top=50,left=50,height=500,width=680');
        }

        /**
         * @name Sfdc.canvas.oauth#token
         * @function
         * @description Sets, gets, or removes the <code>access_token</code> from this JavaScript object. <br>
         <p>This function does one of three things: <br>
         	1) If the 't' parameter isn't passed in, the current value for the <code>access_token</code> value is returned. <br>
         	2) If the the 't' parameter is null, the <code>access_token</code> value is removed. <br>
         	3) Otherwise the <code>access_token</code>  value is set to the 't' parameter and then returned.<br><br>
         	Note: for longer-term storage of the OAuth token, store it server-side in the session.  Access tokens
             should never be stored in cookies.
         * @param {String} [t] The OAuth token to set as the <code>access_token</code> value
         * @returns {String} The resulting <code>access_token</code> value if set; otherwise null
         */
        function token(t) {
            if (arguments.length === 0) {
                if (!$$.isNil(accessToken)) {return accessToken;}
            }
            else {
                accessToken = t;
            }

            return accessToken;
        }

        /**
         * @name Sfdc.canvas.oauth#instance
         * @function
         * @description Sets, gets, or removes the <code>instance_url</code> cookie. <br>
         <p> This function does one of three things: <br>
         1) If the 'i' parameter is not passed in, the current value for the <code>instance_url</code> cookie is returned. <br>
         2) If the 'i' parameter is null, the <code>instance_url</code> cookie is removed. <br>
         3) Otherwise, the <code>instance_url</code> cookie value is set to the 'i' parameter and then returned.
         * @param {String} [i] The value to set as the <code>instance_url</code> cookie
         * @returns {String} The resulting <code>instance_url</code> cookie value if set; otherwise null
         */
        function instanceUrl(i) {
            if (arguments.length === 0) {
                if (!$$.isNil(instUrl)) {return instUrl;}
                instUrl = $$.cookies.get("instance_url");
            }
            else if (i === null) {
                $$.cookies.remove("instance_url");
                instUrl = null;
            }
            else {
                $$.cookies.set("instance_url", i);
                instUrl = i;
            }
            return instUrl;
        }

        /**
         *@private
         */
            // Example Results of tha hash....
            // Name [access_token] Value [00DU0000000Xthw!ARUAQMdYg9ScuUXB5zPLpVyfYQr9qXFO7RPbKf5HyU6kAmbeKlO3jJ93gETlJxvpUDsz3mqMRL51N1E.eYFykHpoda8dPg_z]
            // Name [instance_url] Value [https://na12.salesforce.com]
            // Name [id] Value [https://login.salesforce.com/id/00DU0000000XthwMAC/005U0000000e6PoIAI]
            // Name [issued_at] Value [1331000888967]
            // Name [signature] Value [LOSzVZIF9dpKvPU07icIDOf8glCFeyd4vNGdj1dhW50]
            // Name [state] Value [/crazyrefresh.html]
        function parseHash(hash) {
            var i, nv, nvp, n, v;

            if (! $$.isNil(hash)) {
                if (hash.indexOf('#') === 0) {
                    hash = hash.substr(1);
                }
                nvp = hash.split("&");

                for (i = 0; i < nvp.length; i += 1) {
                    nv = nvp[i].split("=");
                    n = nv[0];
                    v = decodeURIComponent(nv[1]);
                    if ("access_token" === n) {
                        token(v);
                    }
                    else if ("instance_url" === n) {
                        instanceUrl(v);
                    }
                    else if ("target_origin" === n) {
                        tOrigin = decodeURIComponent(v);
                    }
                    else if ("instance_id" === n) {
                        instId = v;
                    }
                }
            }
        }

        /**
         * @name Sfdc.canvas.oauth#checkChildWindowStatus
         * @function
         * @description Refreshes the parent window only if the child window is closed.
         */
        function checkChildWindowStatus() {
            if (!childWindow || childWindow.closed) {
                refresh();
            }
        }

        /**
         * @name Sfdc.canvas.oauth#childWindowUnloadNotification
         * @function
         * @description Parses the hash value that is passed in and sets the
         <code>access_token</code> and <code>instance_url</code> cookies if they exist.  Use this method during
         User-Agent OAuth Authentication Flow to pass the OAuth token.
         * @param {String} hash A string of key-value pairs delimited by
         the ampersand character.
         * @example
         * Sfdc.canvas.oauth.childWindowUnloadNotification(self.location.hash);
         */
        function childWindowUnloadNotification(hash) {
            // Here we get notification from child window. Here we can decide if such notification is
            // raised because user closed child window, or because user is playing with F5 key.
            // NOTE: We can not trust on "onUnload" event of child window, because if user reload or refresh
            // such window in fact he is not closing child. (However "onUnload" event is raised!)
            //checkChildWindowStatus();
            parseHash(hash);
            setTimeout(window.Sfdc.canvas.oauth.checkChildWindowStatus, 50);
        }

        /**
         * @name Sfdc.canvas.oauth#logout
         * @function
         * @description Removes the <code>access_token</code> OAuth token from this object.
         */
        function logout() {
            // Remove the oauth token and refresh the browser
            token(null);
            // @todo: do we want to do this?
            //var home = $$.cookies.get("home");
            //window.location = home || window.location;
        }

        /**
         * @name Sfdc.canvas.oauth#loggedin
         * @function
         * @description Returns the login state.
         * @returns {Boolean} <code>true</code> if the <code>access_token</code> is available in this JS object.
         * Note: <code>access tokens</code> (for example, OAuth tokens) should be stored server-side for more durability.
         * Never store OAuth tokens in cookies as this can lead to a security risk.
         */
        function loggedin() {
            return !$$.isNil(token());
        }

        /**
         * @name Sfdc.canvas.oauth#loginUrl
         * @function
         * @description Returns the URL for the OAuth authorization service.
         * @returns {String} The URL for the OAuth authorization service or default if there's
         *   no value for loginUrl in the current URL's query string
         */
        function loginUrl() {
            var i, nvs, nv, q = self.location.search;

            if (q) {
                q = q.substring(1);
                nvs = q.split("&");
                for (i = 0; i < nvs.length; i += 1)
                {
                    nv = nvs[i].split("=");
                    if ("loginUrl" === nv[0]) {
                        return decodeURIComponent(nv[1]) + "/services/oauth2/authorize";
                    }
                }
            }
            return "https://login.salesforce.com/services/oauth2/authorize";
        }

        function targetOrigin(to) {

            if (!$$.isNil(to)) {
                tOrigin = to;
                return to;
            }

            if (!$$.isNil(tOrigin)) {return tOrigin;}

            // This relies on the parent passing it in. This may not be there as the client can do a
            // redirect or link to another page
            parseHash(document.location.hash);
            return tOrigin;
        }

        function instanceId(id) {

            if (!$$.isNil(id)) {
                instId = id;
                return id;
            }

            if (!$$.isNil(instId)) {return instId;}

            // This relies on the parent passing it in. This may not be there as the client can do a
            // redirect or link to another page
            parseHash(document.location.hash);
            return instId;
        }

        function client() {
            return {oauthToken : token(), instanceId : instanceId(), targetOrigin : targetOrigin()};
        }

        return {
            init : init,
            login : login,
            logout : logout,
            loggedin : loggedin,
            loginUrl : loginUrl,
            token : token,
            instance : instanceUrl,
            client : client,
            checkChildWindowStatus : checkChildWindowStatus,
            childWindowUnloadNotification: childWindowUnloadNotification
        };
    }());

    $$.module('Sfdc.canvas.oauth', module);

    $$.oauth.init();

}(Sfdc.canvas));

// Source: js/xd.js
/**
* Copyright (c) 2011, salesforce.com, inc.
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
(function ($$, window) {

var module =   (function() {

        var internalCallback;

        /**
        * @description Pass a message to the target url
        * @param {String} message The message to send
        * @param {String} target_url Specifies what the origin of the target must be for the event to be dispatched.
        * @param {String} [target] The window that is the message's target. Defaults to the parent of the current window.
        */
        function postMessage(message, target_url, target) {

            // If target url was not supplied (client may have lost it), we could default to '*',
            // However there are security implications here as other canvas apps could receive this
            // canvas apps oauth token.
            if ($$.isNil(target_url)) {
                throw "ERROR: target_url was not supplied on postMessage";
            }
            var otherWindow = $$.stripUrl(target_url);

            target = target || parent;  // default to parent
            if (window.postMessage) {
                // the browser supports window.postMessage, so call it with a targetOrigin
                // set appropriately, based on the target_url parameter.
                message = Sfdc.JSON.stringify(message);
                target.postMessage(message, otherWindow);
            }
        }
        
        /**
        * @name Sfdc.canvas.xd#receive
        * @description Runs the callback function when the message event is received.
        * @param {Function} callback Function to run when the message event is received 
            if the event origin is acceptable.
        * @param {String} source_origin The origin of the desired events
        */
        function receiveMessage(callback, source_origin) {

            // browser supports window.postMessage (if not not supported for pilot - removed per securities request)
            if (window.postMessage) {
                // bind the callback to the actual event associated with window.postMessage
                if (callback) {
                    internalCallback = function(e) {

                        var data, r;
                        if (typeof source_origin === 'string' && e.origin !== source_origin) {
                            return false;
                        }
                        if ($$.isFunction(source_origin)) {
                            r = source_origin(e.origin, e.data);
                            if (r === false) {
                                return false;
                            }
                        }
                        data = Sfdc.JSON.parse(e.data);
                        callback(data, r);

                    };
                }
                if (window.addEventListener) {
                    window.addEventListener('message', internalCallback, false);
                } else {
                    window.attachEvent('onmessage', internalCallback);
                }
            }
        }
        
        /**
        * @description Removes the message event listener
        * @public     
        */
        function removeListener() {

            // browser supports window.postMessage
            if (window.postMessage) {
                if (window.removeEventListener) {
                    window.removeEventListener('message', internalCallback, false);
                } else {
                    window.detachEvent('onmessage', internalCallback);
                }
            }
        }

        return {
            post : postMessage,
            receive : receiveMessage,
            remove : removeListener
        };
    }());

    $$.module('Sfdc.canvas.xd', module);

}(Sfdc.canvas, this));

// Source: js/client.js
/**
* Copyright (c) 2011, salesforce.com, inc.
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
/**
 *@namespace Sfdc.canvas.client
 *@name Sfdc.canvas.client
 */
(function ($$) {

var pversion, cversion = "28.0";

    var module =   (function() /**@lends module */ {

        var purl;

        function startsWithHttp(u, d) {
            return  $$.isNil(u) ? u : (u.substring(0, 4) === "http") ? u : d;
        }

        // returns the url of the Parent Window
        function getTargetOrigin(to) {
            var h;
            if (to === "*") {return to;}
            if (!$$.isNil(to)) {
                h = $$.stripUrl(to);
                purl = startsWithHttp(h, purl);
                if (purl) {return purl;}
            }
            // This relies on the parent passing it in. This may not be there as the client can do a redirect.
            h = $$.document().location.hash;
            if (h) {
                h = decodeURIComponent(h.replace(/^#/, ''));
                purl = startsWithHttp(h, purl);
            }
            return purl;
        }

        // The main cross domain callback handler
        function xdCallback(data) {
            if (data) {
                if (submodules[data.type]) {
                    submodules[data.type].callback(data);
                }
                else {
                    throw "Undefined event type " + data.type;
                }
            }
        }

        var submodules = (function () {

            var cbs = [], seq = 0, autog = true;

            // Functions common to submodules...

            function postit(clientscb, message) {
                var wrapped, to, c;

                // need to keep a mapping from request to callback, otherwise
                // wrong callbacks get called. Unfortunately, this is the only
                // way to handle this as postMessage acts more like topic/queue.
                // limit the sequencers to 100 avoid out of memory errors
                seq = (seq > 100) ? 0 : seq + 1;
                cbs[seq] = clientscb;
                wrapped = {seq : seq, src : "client", clientVersion : cversion, parentVersion: pversion, body : message};

                c  = message && message.config && message.config.client;
                to = getTargetOrigin($$.isNil(c) ? null : c.targetOrigin);
                if ($$.isNil(to)) {
                    throw "ERROR: targetOrigin was not supplied and was not found on the hash tag, this can result from a redirect or link to another page.";
                }
                $$.xd.post(wrapped, to, parent);
            }

            function validateClient(client, cb) {
                var msg;

                client = client || $$.oauth && $$.oauth.client();

                if ($$.isNil(client) || $$.isNil(client.oauthToken)) {
                    msg = {status : 401, statusText : "Unauthorized" , parentVersion : pversion, payload : "client or client.oauthToken not supplied"};
                }
                if ($$.isNil(client.instanceId) || $$.isNil(client.targetOrigin)) {
                    msg = {status : 400, statusText : "Bad Request" , parentVersion : pversion, payload : "client.instanceId or client.targetOrigin not supplied"};
                }
                if (!$$.isNil(msg)) {
                    if ($$.isFunction(cb)) {
                        cb(msg);
                        return false;
                    }
                    else {
                        throw msg;
                    }
                }
                return true;
            }

            // Submodules...

            var event = (function() {
                var subscriptions = {};

                function validName(name, res) {
                    var msg, r = $$.validEventName(name, res);
                    if (r !== 0) {
                        msg = {1 : "Event names can only contain one namespace",
                               2 : "Namespace has already been reserved",
                               3 : "Event name contains invalid characters"
                        };
                        throw msg[r];
                    }
                }

                return  {
                    callback : function (data) {
                        var event = data.payload,
                            subscription = subscriptions[event.name];
                        if (!$$.isNil(subscription)) {
                            if ($$.isFunction(subscription.onData)) {
                                subscription.onData(event.payload);
                            }
                        }
                    },
                    /**
                     * @description Subscribes to parent or custom events. Events
                     * with the namespaces 'canvas', 'sfdc', 'force', 'salesforce', and 'chatter' are reserved by Salesforce.
                     * Developers can choose their own namespace and event names.
                     * Event names must be in the form <code>namespace.eventname</code>.
                     * @public
                     * @name Sfdc.canvas.client#subscribe
                     * @function
                     * @param {client} client The object from the signed request
                     * @param {Object} s The subscriber object or array of objects with name and callback functions
                     * @example
                     * // Subscribe to the parent window onscroll event.
                     * Sfdc.canvas(function() {
                     *     sr = JSON.parse('<%=signedRequestJson%>');
                     *     // Capture the onScrolling event of the parent window.
                     *     Sfdc.canvas.client.subscribe(sr.client,
                     *          {name : 'canvas.scroll', onData : function (event) {
                     *              console.log("Parent's contentHeight; " + event.heights.contentHeight);
                     *              console.log("Parent's pageHeight; " + event.heights.pageHeight);
                     *              console.log("Parent's scrollTop; " + event.heights.scrollTop);
                     *              console.log("Parent's contentWidth; " + event.widths.contentWidth);
                     *              console.log("Parent's pageWidth; " + event.widths.pageWidth);
                     *              console.log("Parent's scrollLeft; " + event.widths.scrollLeft);
                     *          }}
                     *     );
                     * });
                     *
                     * @example
                     * // Subscribe to a custom event.
                     * Sfdc.canvas(function() {
                     *     sr = JSON.parse('<%=signedRequestJson%>');
                     *     Sfdc.canvas.client.subscribe(sr.client,
                     *         {name : 'mynamespace.someevent', onData : function (event) {
                     *             console.log("Got custom event ",  event);
                     *         }}
                     *     );
                     * });
                     *
                     * @example
                     * // Subscribe to multiple events
                     * Sfdc.canvas(function() {
                     *     sr = JSON.parse('<%=signedRequestJson%>');
                     *     Sfdc.canvas.client.subscribe(sr.client, [
                     *         {name : 'mynamespace.someevent1', onData : handler1},
                     *         {name : 'mynamespace.someevent2', onData : handler2},
                     *     ]);
                     * });
                     *
                     */
                    subscribe : function(client, s) {
                        var subs = {};

                        if ($$.isNil(s) || (!validateClient(client))) {
                            throw "precondition fail";
                        }

                        $$.each($$.isArray(s) ? s : [s], function (v) {
                            if (!$$.isNil(v.name)) {
                                validName(v.name, "canvas");
                                subscriptions[v.name] = v;
                                subs[v.name] = {
                                    params : v.params
                                };
                            }
                            else {
                                throw "subscription does not have a 'name'";
                            }
                        });
                        if (!client.isVF) {
                            postit(null, {type : "subscribe", config : {client : client}, subscriptions : subs});
                        }
                    },
                    /**
                     * @description Unsubscribes from parent or custom events.
                     * @public
                     * @name Sfdc.canvas.client#unsubscribe
                     * @function
                     * @param {client} client The object from the signed request
                     * @param {Object} s The events to unsubscribe from
                     * @example
                     * //Unsubscribe from the canvas.scroll method.
                     * Sfdc.canvas(function() {
                     *     sr = JSON.parse('<%=signedRequestJson%>');
                     *     Sfdc.canvas.client.unsubscribe(sr.client, "canvas.scroll");
                     *});
                     *
                     * @example
                     * //Unsubscribe from the canvas.scroll method by specifying the object name.
                     * Sfdc.canvas(function() {
                     *     sr = JSON.parse('<%=signedRequestJson%>');
                     *     Sfdc.canvas.client.unsubscribe(sr.client, {name : "canvas.scroll"});
                     *});
                     *
                     * @example
                     * //Unsubscribe from multiple events.
                     * Sfdc.canvas(function() {
                     *     sr = JSON.parse('<%=signedRequestJson%>');
                     *     Sfdc.canvas.client.unsubscribe(sr.client, ['canvas.scroll', 'foo.bar']);
                     *});
                     */
                    unsubscribe : function(client, s) {
                        // client can pass in the handler object or just the name
                        var subs = {};

                        if ($$.isNil(s) || !validateClient(client)) {
                            throw "PRECONDITION FAIL: need fo supply client and event name";
                        }

                        if ($$.isString(s)) {
                            subs[s] = {};
                            delete subscriptions[s];
                        }
                        else {
                            $$.each($$.isArray(s) ? s : [s], function (v) {
                                var name = v.name ? v.name : v;
                                validName(name, "canvas");
                                subs[name] = {
                                    params : v.params
                                };
                                delete subscriptions[name];
                            });
                        }
                        if (!client.isVF) {
                            postit(null, {type : "unsubscribe", config : {client : client}, subscriptions : subs});
                        }
                    },
                    /**
                     * @description Publishes a custom event. Events are published to all subscribing canvas applications
                     * on the same page, regardless of domain. Choose a unique namespace so the event doesn't collide with other
                     * application events. Events can have payloads of arbitrary JSON objects.
                     * @public
                     * @name Sfdc.canvas.client#publish
                     * @function
                     * @param {client} client The object from the signed request
                     * @param {Object} e The event to publish
                     * @example
                     * // Publish the foo.bar event with the specified payload.
                     * Sfdc.canvas(function() {
                     *     sr = JSON.parse('<%=signedRequestJson%>');
                     *     Sfdc.canvas.client.publish(sr.client,
                     *         {name : "foo.bar", payload : {some : 'stuff'}});
                     *});
                     */
                    publish : function(client, e) {
                        if (!$$.isNil(e) && !$$.isNil(e.name)) {
                            validName(e.name);
                            if (validateClient(client)) {
                                postit(null, {type : "publish", config : {client : client}, event : e});
                            }
                        }
                    }
                };
            }());

            var callback = (function() {
                return  {
                    callback : function (data) {
                        // If the server is telling us the access_token is invalid, wipe it clean.
                        if (data.status === 401 &&
                            $$.isArray(data.payload) &&
                            data.payload[0].errorCode &&
                            data.payload[0].errorCode === "INVALID_SESSION_ID") {
                            // Session has expired logout.
                            if ($$.oauth) {$$.oauth.logout();}
                        }
                        // Find appropriate client callback an invoke it.
                        if ($$.isFunction(cbs[data.seq])) {
                            if (!$$.isFunction(cbs[data.seq])) {
                                alert("not function");
                            }
                            cbs[data.seq](data);
                        }
                        else {
                            // This can happen when the user switches out canvas apps real quick,
                            // before the request from the last canvas app have finish processing.
                            // We will ignore any of these results as the canvas app is no longer active to
                            // respond to the results.
                        }
                    }
                };
            }());

            var services = (function() {
                return  {
                    /**
                     * @description Performs a cross-domain, asynchronous HTTP request.
                     <br>Note: this method shouldn't be used for same domain requests.
                     * @param {String} url The URL to which the request is sent
                     * @param {Object} settings A set of key/value pairs to configure the request
                     <br>The success setting is required at minimum and should be a callback function
                     * @config {String} [client] The required client context {oauthToken: "", targetOrigin : "", instanceId : ""}
                     * @config {String} [contentType] "application/json"
                     * @config {String} [data] The request body
                     * @config {String} [headers] request headers
                     * @config {String} [method="GET"] The type of AJAX request to make
                     * @config {Function} [success] Callback for all responses from the server (failure and success). Signature: success(response); interesting fields: [response.data, response.responseHeaders, response.status, response.statusText}
                     * @config {Boolean} [async=true] Asynchronous: only <code>true</code> is supported.
                     * @name Sfdc.canvas.client#ajax
                     * @function
                     * @throws An error if the URL is missing or the settings object doesn't contain a success callback function.
                     * @example
                     * //Posting to a Chatter feed:
                     * var sr = JSON.parse('<%=signedRequestJson%>');
                     * var url = sr.context.links.chatterFeedsUrl+"/news/"
                     *                                   +sr.context.user.userId+"/feed-items";
                     * var body = {body : {messageSegments : [{type: "Text", text: "Some Chatter Post"}]}};
                     * connect.client.ajax(url,
                     *   {client : sr.client,
                     *     method: 'POST',
                     *     contentType: "application/json",
                     *     data: JSON.stringify(body),
                     *     success : function(data) {
                     *     if (201 === data.status) {
                     *          alert("Success"
                     *          }
                     *     }
                     *   });
                     * @example
                     * // Gets a list of Chatter users:
                     * // Paste the signed request string into a JavaScript object for easy access.
                     * var sr = JSON.parse('<%=signedRequestJson%>');
                     * // Reference the Chatter user's URL from Context.Links object.
                     * var chatterUsersUrl = sr.context.links.chatterUsersUrl;
                     *
                     * // Make an XHR call back to Salesforce through the supplied browser proxy.
                     * connect.client.ajax(chatterUsersUrl,
                     *   {client : sr.client,
                     *   success : function(data){
                     *   // Make sure the status code is OK.
                     *   if (data.status === 200) {
                     *     // Alert with how many Chatter users were returned.
                     *     alert("Got back "  + data.payload.users.length +
                     *     " users"); // Returned 2 users
                     *    }
                     * })};
                     */
                    ajax : function (url, settings) {

                        var ccb, config, defaults;

                        if (!url) {
                            throw "PRECONDITION ERROR: url required with AJAX call";
                        }
                        if (!settings || !$$.isFunction(settings.success)) {
                            throw "PRECONDITION ERROR: function: 'settings.success' missing.";
                        }
                        if (! validateClient(settings.client, settings.success)) {
                            return;
                        }

                        ccb = settings.success;
                        defaults = {
                            method: 'GET',
                            async: true,
                            contentType: "application/json",
                            headers: {"Authorization" : "OAuth "  + settings.client.oauthToken,
                                "Accept" : "application/json"},
                            data: null
                        };
                        config = $$.extend(defaults, settings || {});

                        // Remove any listeners as functions cannot get marshaled.
                        config.success = undefined;
                        config.failure = undefined;
                        // Don't allow the client to set "*" as the target origin.
                        if (config.client.targetOrigin === "*") {
                            config.client.targetOrigin = null;
                        }
                        else {
                            // We need to set this here so we can validate the origin when we receive the call back
                            purl = startsWithHttp(config.targetOrigin, purl);
                        }
                        postit(ccb, {type : "ajax", url : url, config : config});
                    },
                    /**
                     * @description Returns the context for the current user and organization.
                     * @public
                     * @name Sfdc.canvas.client#ctx
                     * @function
                     * @param {Function} clientscb The callback function to run when the call to ctx completes
                     * @param {Object} client The signedRequest.client.
                     * @example
                     * // Gets context in the canvas app.
                     *
                     * function callback(msg) {
                     *   if (msg.status !== 200) {
                     *     alert("Error: " + msg.status);
                     *     return;
                     *   }
                     *   alert("Payload: ", msg.payload);
                     * }
                     * var ctxlink = connect.byId("ctxlink");
                     * var oauthtoken = connect.oauth.token();
                     * ctxlink.onclick=function() {
                     *   connect.client.ctx(callback, oauthtoken)};
                     * }
                     */
                    ctx : function (clientscb, client) {
                        if (validateClient(client, clientscb)) {
                            postit(clientscb, {type : "ctx", accessToken : client.oauthToken, config : {client : client}});
                        }
                    },
                    /**
                     * @description Stores or gets the oauth token in a local javascript variable. Note, if longer term
                     * (survive page refresh) storage is needed store the oauth token on the server side.
                     * @param {String} t oauth token, if supplied it will be stored in a volatile local JS variable.
                     * @returns {Object} the oauth token.
                     */
                    token : function(t) {
                        return $$.oauth && $$.oauth.token(t);
                    },
                    /**
                     * @description Returns the current version of the client.
                     * @returns {Object} {clientVersion : "28.0", paranetVersion : "28.0"}.
                     */
                    version : function() {
                        return {clientVersion: cversion, parentVersion : pversion};
                    }
                };
            }());

            var frame = (function() {
                return  {
                    /**
                     * @public
                     * @name Sfdc.canvas.client#size
                     * @function
                     * @description Returns the current size of the iFrame.
                     * @return {Object}<br>
                     * <code>heights.contentHeight</code>: the height of the virtual iFrame, all content, not just visible content.<br>
                     * <code>heights.pageHeight</code>: the height of the visible iFrame in the browser.<br>
                     * <code>heights.scrollTop</code>: the position of the scroll bar measured from the top.<br>
                     * <code>widths.contentWidth</code>: the width of the virtual iFrame, all content, not just visible content.<br>
                     * <code>widths.pageWidth</code>: the width of the visible iFrame in the browser.<br>
                     * <code>widths.scrollLeft</code>: the position of the scroll bar measured from the left.
                     * @example
                     * //get the size of the iFrame and print out each component.
                     * var sizes = Sfdc.canvas.client.size();
                     * console.log("contentHeight; " + sizes.heights.contentHeight);
                     * console.log("pageHeight; " + sizes.heights.pageHeight);
                     * console.log("scrollTop; " + sizes.heights.scrollTop);
                     * console.log("contentWidth; " + sizes.widths.contentWidth);
                     * console.log("pageWidth; " + sizes.widths.pageWidth);
                     * console.log("scrollLeft; " + sizes.widths.scrollLeft);
                     */
                    size : function() {
                        var docElement = $$.document().documentElement;
                        var contentHeight = docElement.scrollHeight,
                            pageHeight = docElement.clientHeight,
                            scrollTop = (docElement && docElement.scrollTop) || $$.document().body.scrollTop,
                            contentWidth = docElement.scrollWidth,
                            pageWidth = docElement.clientWidth,
                            scrollLeft = (docElement && docElement.scrollLeft) || $$.document().body.scrollLeft;

                        return {heights : {contentHeight : contentHeight, pageHeight : pageHeight, scrollTop : scrollTop},
                            widths : {contentWidth : contentWidth, pageWidth : pageWidth, scrollLeft : scrollLeft}};
                    },
                    /**
                     * @public
                     * @name Sfdc.canvas.client#resize
                     * @function
                     * @description Informs the parent window to resize the canvas iFrame. If no parameters are specified,
                     * the parent window attempts to determine the height of the canvas app based on the
                     * content and then sets the iFrame width and height accordingly. To explicitly set the dimensions,
                     * pass in an object with height and/or width properties.
                     * @param {Client} client The object from the signed request
                     * @param {size} size The optional height and width information
                     * @example
                     * //Automatically determine the size
                     * Sfdc.canvas(function() {
                     *     sr = JSON.parse('<%=signedRequestJson%>');
                     *     Sfdc.canvas.client.resize(sr.client);
                     * });
                     *
                     * @example
                     * //Set the height and width explicitly
                     * Sfdc.canvas(function() {
                     *     sr = JSON.parse('<%=signedRequestJson%>');
                     *     Sfdc.canvas.client.resize(sr.client, {height : "1000px", width : "900px"});
                     * });
                     *
                     * @example
                     * //Set only the height
                     * Sfdc.canvas(function() {
                     *     sr = JSON.parse('<%=signedRequestJson%>');
                     *     Sfdc.canvas.client.resize(sr.client, {height : "1000px"});
                     * });
                     *
                     */
                    resize : function(client, size) {
                        var sh, ch, sw, cw, s = {height : "", width : ""},
                            docElement = $$.document().documentElement;

                        // If the size was not supplied, adjust window
                        if ($$.isNil(size)) {
                            sh = docElement.scrollHeight;
                            ch = docElement.clientHeight;
                            if (ch !== sh) {
                                s.height = sh + "px";
                            }
                            sw = docElement.scrollWidth;
                            cw = docElement.clientWidth;
                            if (sw !== cw) {
                                s.width = sw + "px";
                            }
                        }
                        else {
                            if (!$$.isNil(size.height)) {
                                s.height = size.height;
                            }
                            if (!$$.isNil(size.width)) {
                                s.width = size.width;
                            }
                        }
                        if (!$$.isNil(s.height) || !$$.isNil(s.width)) {
                            postit(null, {type : "resize", config : {client : client}, size : s});
                        }
                    },
                    /**
                     * @public
                     * @name Sfdc.canvas.client#autogrow
                     * @function
                     * @description Starts or stops a timer which checks the content size of the iFrame and
                     * adjusts the frame accordingly.
                     * Use this function when you know your content is changing size, but you're not sure when. There's a delay as
                     * the resizing is done asynchronously. Therfore, if you know when your content changes size, you should 
                     * explicitly call the resize() method and save browser CPU cycles.
                     * Note: you should turn off scrolling before this call, otherwise you might get a flicker.
                     * @param {client} client The object from the signed request
                     * @param {boolean} b Whether it's turned on or off; defaults to <code>true</code>
                     * @param {Integer} interval The interval used to check content size; default timeout is 300ms.
                     * @example
                     *
                     * // Turn on auto grow with default settings.
                     * Sfdc.canvas(function() {
                     *     sr = JSON.parse('<%=signedRequestJson%>');
                     *     Sfdc.canvas.client.autogrow(sr.client);
                     * });
                     *
                     * // Turn on auto grow with a polling interval of 100ms (milliseconds).
                     * Sfdc.canvas(function() {
                     *     sr = JSON.parse('<%=signedRequestJson%>');
                     *     Sfdc.canvas.client.autogrow(sr.client, true, 100);
                     * });
                     *
                     * // Turn off auto grow.
                     * Sfdc.canvas(function() {
                     *     sr = JSON.parse('<%=signedRequestJson%>');
                     *     Sfdc.canvas.client.autogrow(sr.client, false);
                     * });
                     */
                    autogrow : function(client, b, interval) {
                        var ival = ($$.isNil(interval)) ? 300 : interval;
                        autog  = ($$.isNil(b)) ? true : b;
                        if (autog === false) {
                            return;
                        }
                        setTimeout(function () {
                            submodules.frame.resize(client);
                            submodules.frame.autogrow(client, autog);
                        },ival);
                    }
                };
            }());

            return {
                services : services,
                frame : frame,
                event : event,
                callback : callback
            };
        }());

        $$.xd.receive(xdCallback, getTargetOrigin);

        return {
            ctx : submodules.services.ctx,
            ajax : submodules.services.ajax,
            token : submodules.services.token,
            version : submodules.services.version,
            resize : submodules.frame.resize,
            size : submodules.frame.size,
            autogrow : submodules.frame.autogrow,
            subscribe : submodules.event.subscribe,
            unsubscribe : submodules.event.unsubscribe,
            publish : submodules.event.publish
        };
    }());

    $$.module('Sfdc.canvas.client', module);

}(Sfdc.canvas));
