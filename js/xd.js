
(function ($$, window) {

    "use strict";

    var module =   (function() {

        var internalCallback;

        /**
        * @description Pass a message to the target url
        * @param {String} message The message to send
        * @param {String} target_url Specifies what the origin of the target must be for the event to be dispatched.
        * @param {String} [target] The window that is the message's target. Defaults to the parent of the current window.
        */
        function postMessage(message, target_url, target) {
			var sfdcJson = Sfdc.JSON || JSON;

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

                // Add the targetModule as Canvas so we are the only ones interested in these events
                if ($$.isObject(message)) {message.targetModule = "Canvas";}
                message = sfdcJson.stringify(message);
                $$.console.log("Sending Post Message ", message);
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
						var sfdcJson = Sfdc.JSON || JSON;

                        $$.console.log("Post Message Got callback", e);

                        if (!$$.isNil(e)) {
                            if (typeof source_origin === 'string' && e.origin !== source_origin) {
                                $$.console.log("source origin's don't match", e.origin, source_origin);
                                return false;
                            }
                            if ($$.isFunction(source_origin)) {
                                r = source_origin(e.origin, e.data);
                                if (r === false) {
                                    $$.console.log("source origin's function returning false", e.origin, e.data);
                                    return false;
                                }
                            }
                            if ($$.appearsJson(e.data))  {
                                try {
                                    data = sfdcJson.parse(e.data);
                                } catch (ignore) {
                                    // Ignore parsing errors of any non json objects sent from other frames
                                }
                                // If we could parse the data and there is a targetModule make sure it is for us
                                if (!$$.isNil(data) && ($$.isNil(data.targetModule) || data.targetModule === "Canvas")) {
                                    $$.console.log("Invoking callback");
                                    callback(data, r);
                                }
                            }
                        }
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