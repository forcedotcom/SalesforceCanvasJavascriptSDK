(function(global) {
  if(global.Sfdc && global.Sfdc.canvas && global.Sfdc.canvas.module) {
    return
  }
  var extmodules = {};
  if(global.Sfdc && global.Sfdc.canvas) {
    for(var key in global.Sfdc.canvas) {
      if(global.Sfdc.canvas.hasOwnProperty(key)) {
        extmodules[key] = global.Sfdc.canvas[key]
      }
    }
  }
  var oproto = Object.prototype, aproto = Array.prototype, doc = global.document, keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", $ = {hasOwn:function(obj, prop) {
    return oproto.hasOwnProperty.call(obj, prop)
  }, isUndefined:function(value) {
    var undef;
    return value === undef
  }, isNil:function(value) {
    return $.isUndefined(value) || value === null || value === ""
  }, isNumber:function(value) {
    return!!(value === 0 || value && value.toExponential && value.toFixed)
  }, isFunction:function(value) {
    return!!(value && value.constructor && value.call && value.apply)
  }, isArray:Array.isArray || function(value) {
    return oproto.toString.call(value) === "[object Array]"
  }, isArguments:function(value) {
    return!!(value && $.hasOwn(value, "callee"))
  }, isObject:function(value) {
    return value !== null && typeof value === "object"
  }, isString:function(value) {
    return value !== null && typeof value == "string"
  }, appearsJson:function(value) {
    return/^\{.*\}$/.test(value)
  }, nop:function() {
  }, invoker:function(fn) {
    if($.isFunction(fn)) {
      fn()
    }
  }, identity:function(obj) {
    return obj
  }, each:function(obj, it, ctx) {
    if($.isNil(obj)) {
      return
    }
    var nativ = aproto.forEach, i = 0, l, key;
    l = obj.length;
    ctx = ctx || obj;
    if(nativ && nativ === obj.forEach) {
      obj.forEach(it, ctx)
    }else {
      if($.isNumber(l)) {
        while(i < l) {
          if(it.call(ctx, obj[i], i, obj) === false) {
            return
          }
          i += 1
        }
      }else {
        for(key in obj) {
          if($.hasOwn(obj, key) && it.call(ctx, obj[key], key, obj) === false) {
            return
          }
        }
      }
    }
  }, startsWithHttp:function(orig, newUrl) {
    return!$.isString(orig) ? orig : orig.substring(0, 4) === "http" ? orig : newUrl
  }, map:function(obj, it, ctx) {
    var results = [], nativ = aproto.map;
    if($.isNil(obj)) {
      return results
    }
    if(nativ && obj.map === nativ) {
      return obj.map(it, ctx)
    }
    ctx = ctx || obj;
    $.each(obj, function(value, i, list) {
      results.push(it.call(ctx, value, i, list))
    });
    return results
  }, values:function(obj) {
    return $.map(obj, $.identity)
  }, slice:function(array, begin, end) {
    return aproto.slice.call(array, $.isUndefined(begin) ? 0 : begin, $.isUndefined(end) ? array.length : end)
  }, toArray:function(iterable) {
    if(!iterable) {
      return[]
    }
    if(iterable.toArray) {
      return iterable.toArray
    }
    if($.isArray(iterable)) {
      return iterable
    }
    if($.isArguments(iterable)) {
      return $.slice(iterable)
    }
    return $.values(iterable)
  }, size:function(obj) {
    return $.toArray(obj).length
  }, indexOf:function(array, item) {
    var nativ = aproto.indexOf, i, l;
    if(!array) {
      return-1
    }
    if(nativ && array.indexOf === nativ) {
      return array.indexOf(item)
    }
    for(i = 0, l = array.length;i < l;i += 1) {
      if(array[i] === item) {
        return i
      }
    }
    return-1
  }, isEmpty:function(obj) {
    if(obj === null) {
      return true
    }
    if($.isArray(obj) || $.isString(obj)) {
      return obj.length === 0
    }
    for(var key in obj) {
      if($.hasOwn(obj, key)) {
        return false
      }
    }
    return true
  }, remove:function(array, item) {
    var i = $.indexOf(array, item);
    if(i >= 0) {
      array.splice(i, 1)
    }
  }, param:function(a, encode) {
    var s = [];
    encode = encode || false;
    function add(key, value) {
      if($.isNil(value)) {
        return
      }
      value = $.isFunction(value) ? value() : value;
      if($.isArray(value)) {
        $.each(value, function(v, n) {
          add(key, v)
        })
      }else {
        if(encode) {
          s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value)
        }else {
          s[s.length] = key + "=" + value
        }
      }
    }
    if($.isArray(a)) {
      $.each(a, function(v, n) {
        add(n, v)
      })
    }else {
      for(var p in a) {
        if($.hasOwn(a, p)) {
          add(p, a[p])
        }
      }
    }
    return s.join("&").replace(/%20/g, "+")
  }, objectify:function(q) {
    var arr, obj = {}, i, p, n, v, e;
    if($.isNil(q)) {
      return obj
    }
    if(q.substring(0, 1) == "?") {
      q = q.substring(1)
    }
    arr = q.split("&");
    for(i = 0;i < arr.length;i += 1) {
      p = arr[i].split("=");
      n = p[0];
      v = p[1];
      e = obj[n];
      if(!$.isNil(e)) {
        if($.isArray(e)) {
          e[e.length] = v
        }else {
          obj[n] = [];
          obj[n][0] = e;
          obj[n][1] = v
        }
      }else {
        obj[n] = v
      }
    }
    return obj
  }, stripUrl:function(url) {
    return $.isNil(url) ? null : url.replace(/([^:]+:\/\/[^\/\?#]+).*/, "$1")
  }, query:function(url, q) {
    if($.isNil(q)) {
      return url
    }
    url = url.replace(/#.*$/, "");
    url += /^\#/.test(q) ? q : (/\?/.test(url) ? "&" : "?") + q;
    return url
  }, extend:function(dest) {
    $.each($.slice(arguments, 1), function(mixin, i) {
      $.each(mixin, function(value, key) {
        dest[key] = value
      })
    });
    return dest
  }, endsWith:function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1
  }, capitalize:function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }, uncapitalize:function(str) {
    return str.charAt(0).toLowerCase() + str.slice(1)
  }, decode:function(str) {
    var output = [], chr1, chr2, chr3 = "", enc1, enc2, enc3, enc4 = "", i = 0;
    str = str.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    do {
      enc1 = keyStr.indexOf(str.charAt(i++));
      enc2 = keyStr.indexOf(str.charAt(i++));
      enc3 = keyStr.indexOf(str.charAt(i++));
      enc4 = keyStr.indexOf(str.charAt(i++));
      chr1 = enc1 << 2 | enc2 >> 4;
      chr2 = (enc2 & 15) << 4 | enc3 >> 2;
      chr3 = (enc3 & 3) << 6 | enc4;
      output.push(String.fromCharCode(chr1));
      if(enc3 !== 64) {
        output.push(String.fromCharCode(chr2))
      }
      if(enc4 !== 64) {
        output.push(String.fromCharCode(chr3))
      }
      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = ""
    }while(i < str.length);
    return $.escapeToUTF8(output.join(""))
  }, escapeToUTF8:function(str) {
    var outStr = "";
    var i = 0;
    while(i < str.length) {
      var c = str.charCodeAt(i++);
      var c1;
      if(c < 128) {
        outStr += String.fromCharCode(c)
      }else {
        if(c > 191 && c < 224) {
          c1 = str.charCodeAt(i++);
          outStr += String.fromCharCode((c & 31) << 6 | c1 & 63)
        }else {
          c1 = str.charCodeAt(i++);
          var c2 = str.charCodeAt(i++);
          outStr += String.fromCharCode((c & 15) << 12 | (c1 & 63) << 6 | c2 & 63)
        }
      }
    }
    return outStr
  }, validEventName:function(name, res) {
    var ns, parts = name.split(/\./), regex = /^[$A-Z_][0-9A-Z_$]*$/i, reserved = {"sfdc":true, "canvas":true, "force":true, "salesforce":true, "chatter":true, "s1":true};
    $.each($.isArray(res) ? res : [res], function(v) {
      reserved[v] = false
    });
    if(parts.length > 2) {
      return 1
    }
    if(parts.length === 2) {
      ns = parts[0].toLowerCase();
      if(reserved[ns]) {
        return 2
      }
    }
    if(!regex.test(parts[0]) || !regex.test(parts[1])) {
      return 3
    }
    return 0
  }, prototypeOf:function(obj) {
    var nativ = Object.getPrototypeOf, proto = "__proto__";
    if($.isFunction(nativ)) {
      return nativ.call(Object, obj)
    }else {
      if(typeof{}[proto] === "object") {
        return obj[proto]
      }else {
        return obj.constructor.prototype
      }
    }
  }, module:function(ns, decl) {
    var parts = ns.split("."), parent = global.Sfdc.canvas, i, length;
    if(parts[1] === "canvas") {
      parts = parts.slice(2)
    }
    length = parts.length;
    for(i = 0;i < length;i += 1) {
      if($.isUndefined(parent[parts[i]])) {
        parent[parts[i]] = {}
      }
      parent = parent[parts[i]]
    }
    if($.isFunction(decl)) {
      decl = decl()
    }
    return $.extend(parent, decl)
  }, document:function() {
    return doc
  }, byId:function(id) {
    return doc.getElementById(id)
  }, byClass:function(clazz) {
    return doc.getElementsByClassName(clazz)
  }, attr:function(el, name) {
    var a = el.attributes, i;
    for(i = 0;i < a.length;i += 1) {
      if(name === a[i].name) {
        return a[i].value
      }
    }
  }, onReady:function(cb) {
    if($.isFunction(cb)) {
      readyHandlers.push(cb)
    }
  }, console:function() {
    var enabled = false;
    if(window && !window.console) {
      window.console = {}
    }
    if(window && !window.console.log) {
      window.console.log = function() {
      }
    }
    if(window && !window.console.error) {
      window.console.error = function() {
      }
    }
    function isSessionStorage() {
      try {
        return"sessionStorage" in window && window.sessionStorage !== null
      }catch(e) {
        return false
      }
    }
    function log() {
    }
    function error() {
    }
    function activate() {
      if(Function.prototype.bind) {
        log = Function.prototype.bind.call(console.log, console)
      }else {
        log = function() {
          Function.prototype.apply.call(console.log, console, arguments)
        }
      }
    }
    function deactivate() {
      log = function() {
      }
    }
    function enable() {
      enabled = true;
      if(isSessionStorage()) {
        sessionStorage.setItem("canvas_console", "true")
      }
      activate()
    }
    function disable() {
      enabled = false;
      if(isSessionStorage()) {
        sessionStorage.setItem("canvas_console", "false")
      }
      deactivate()
    }
    enabled = isSessionStorage() && sessionStorage.getItem("canvas_console") === "true";
    if(enabled) {
      activate()
    }else {
      deactivate()
    }
    if(Function.prototype.bind) {
      error = Function.prototype.bind.call(console.error, console)
    }else {
      error = function() {
        Function.prototype.apply.call(console.error, console, arguments)
      }
    }
    return{enable:enable, disable:disable, log:log, error:error}
  }()}, readyHandlers = [], canvas = function(cb) {
    if($.isFunction(cb)) {
      readyHandlers.push(cb)
    }
  };
  (function() {
    var called = false, isFrame, fn;
    function ready() {
      if(called) {
        return
      }
      called = true;
      ready = $.nop;
      $.each(readyHandlers, $.invoker);
      readyHandlers = []
    }
    function tryScroll() {
      if(called) {
        return
      }
      try {
        document.documentElement.doScroll("left");
        ready()
      }catch(e) {
        setTimeout(tryScroll, 30)
      }
    }
    if(document.addEventListener) {
      document.addEventListener("DOMContentLoaded", ready, false)
    }else {
      if(document.attachEvent) {
        try {
          isFrame = self !== top
        }catch(e) {
        }
        if(document.documentElement.doScroll && !isFrame) {
          tryScroll()
        }
        document.attachEvent("onreadystatechange", function() {
          if(document.readyState === "complete") {
            ready()
          }
        })
      }
    }
    if(window.addEventListener) {
      window.addEventListener("load", ready, false)
    }else {
      if(window.attachEvent) {
        window.attachEvent("onload", ready)
      }else {
        fn = window.onload;
        window.onload = function() {
          if(fn) {
            fn()
          }
          ready()
        }
      }
    }
  })();
  $.each($, function(fn, name) {
    canvas[name] = fn
  });
  $.each(extmodules, function(fn, name) {
    canvas[name] = fn
  });
  (function() {
    var method;
    var noop = function() {
    };
    var methods = ["assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "table", "time", "timeEnd", "timeStamp", "trace", "warn"];
    var length = methods.length;
    var console = typeof window !== "undefined" && window.console ? window.console : {};
    while(length--) {
      method = methods[length];
      if(!console[method]) {
        console[method] = noop
      }
    }
  })();
  if(!global.Sfdc) {
    global.Sfdc = {}
  }
  global.Sfdc.canvas = canvas
})(window);
(function($$) {
  var module = function() {
    function isSecure() {
      return window.location.protocol === "https:"
    }
    function set(name, value, days) {
      var expires = "", date;
      if(days) {
        date = new Date;
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1E3);
        expires = "; expires=" + date.toGMTString()
      }else {
        expires = ""
      }
      document.cookie = name + "=" + value + expires + "; path=/" + (isSecure() === true ? "; secure" : "")
    }
    function get(name) {
      var nameEQ, ca, c, i;
      if($$.isUndefined(name)) {
        return document.cookie.split(";")
      }
      nameEQ = name + "=";
      ca = document.cookie.split(";");
      for(i = 0;i < ca.length;i += 1) {
        c = ca[i];
        while(c.charAt(0) === " ") {
          c = c.substring(1, c.length)
        }
        if(c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length, c.length)
        }
      }
      return null
    }
    function remove(name) {
      set(name, "", -1)
    }
    return{set:set, get:get, remove:remove}
  }();
  $$.module("Sfdc.canvas.cookies", module)
})(Sfdc.canvas);
(function($$) {
  var storage = function() {
    function isLocalStorage() {
      try {
        return"sessionStorage" in window && window.sessionStorage !== null
      }catch(e) {
        return false
      }
    }
    return{get:function get(key) {
      if(isLocalStorage()) {
        return sessionStorage.getItem(key)
      }
      return $$.cookies.get(key)
    }, set:function set(key, value) {
      if(isLocalStorage()) {
        return sessionStorage.setItem(key, value)
      }
      return $$.cookies.set(key, value)
    }, remove:function remove(key) {
      if(isLocalStorage()) {
        return sessionStorage.removeItem(key)
      }
      return $$.cookies.remove(key)
    }}
  }();
  var module = function() {
    var accessToken, instUrl, instId, tOrigin, childWindow;
    function init() {
      accessToken = storage.get("access_token");
      storage.remove("access_token")
    }
    function query(params) {
      var r = [], n;
      if(!$$.isUndefined(params)) {
        for(n in params) {
          if(params.hasOwnProperty(n)) {
            r.push(n + "=" + params[n])
          }
        }
        return"?" + r.join("&")
      }
      return""
    }
    function refresh() {
      storage.set("access_token", accessToken);
      self.location.reload()
    }
    function login(ctx) {
      var uri;
      ctx = ctx || {};
      uri = ctx.uri || "/rest/oauth2";
      ctx.params = ctx.params || {state:""};
      ctx.params.state = ctx.params.state || ctx.callback || window.location.pathname;
      ctx.params.display = ctx.params.display || "popup";
      ctx.params.redirect_uri = $$.startsWithHttp(ctx.params.redirect_uri, encodeURIComponent(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port) + ctx.params.redirect_uri);
      uri = uri + query(ctx.params);
      childWindow = window.open(uri, "OAuth", "status=0,toolbar=0,menubar=0,resizable=0,scrollbars=1,top=50,left=50,height=500,width=680")
    }
    function token(t) {
      if(arguments.length === 0) {
        if(!$$.isNil(accessToken)) {
          return accessToken
        }
      }else {
        accessToken = t
      }
      return accessToken
    }
    function instanceUrl(i) {
      if(arguments.length === 0) {
        if(!$$.isNil(instUrl)) {
          return instUrl
        }
        instUrl = storage.get("instance_url")
      }else {
        if(i === null) {
          storage.remove("instance_url");
          instUrl = null
        }else {
          storage.set("instance_url", i);
          instUrl = i
        }
      }
      return instUrl
    }
    function parseHash(hash) {
      var i, nv, nvp, n, v;
      if(!$$.isNil(hash)) {
        if(hash.indexOf("#") === 0) {
          hash = hash.substr(1)
        }
        nvp = hash.split("&");
        for(i = 0;i < nvp.length;i += 1) {
          nv = nvp[i].split("=");
          n = nv[0];
          v = decodeURIComponent(nv[1]);
          if("access_token" === n) {
            token(v)
          }else {
            if("instance_url" === n) {
              instanceUrl(v)
            }else {
              if("target_origin" === n) {
                tOrigin = decodeURIComponent(v)
              }else {
                if("instance_id" === n) {
                  instId = v
                }
              }
            }
          }
        }
      }
    }
    function checkChildWindowStatus() {
      if(!childWindow || childWindow.closed) {
        refresh()
      }
    }
    function childWindowUnloadNotification(hash) {
      var retry = 0, maxretries = 10;
      function cws() {
        retry++;
        if(!childWindow || childWindow.closed) {
          refresh()
        }else {
          if(retry < maxretries) {
            setTimeout(cws, 50)
          }
        }
      }
      parseHash(hash);
      setTimeout(cws, 50)
    }
    function logout() {
      token(null)
    }
    function loggedin() {
      return!$$.isNil(token())
    }
    function loginUrl() {
      var i, nvs, nv, q = self.location.search;
      if(q) {
        q = q.substring(1);
        nvs = q.split("&");
        for(i = 0;i < nvs.length;i += 1) {
          nv = nvs[i].split("=");
          if("loginUrl" === nv[0]) {
            return decodeURIComponent(nv[1]) + "/services/oauth2/authorize"
          }
        }
      }
      return"https://login.salesforce.com/services/oauth2/authorize"
    }
    function targetOrigin(to) {
      if(!$$.isNil(to)) {
        tOrigin = to;
        return to
      }
      if(!$$.isNil(tOrigin)) {
        return tOrigin
      }
      parseHash(document.location.hash);
      return tOrigin
    }
    function instanceId(id) {
      if(!$$.isNil(id)) {
        instId = id;
        return id
      }
      if(!$$.isNil(instId)) {
        return instId
      }
      parseHash(document.location.hash);
      return instId
    }
    function client() {
      return{oauthToken:token(), instanceId:instanceId(), targetOrigin:targetOrigin()}
    }
    return{init:init, login:login, logout:logout, loggedin:loggedin, loginUrl:loginUrl, token:token, instance:instanceUrl, client:client, checkChildWindowStatus:checkChildWindowStatus, childWindowUnloadNotification:childWindowUnloadNotification}
  }();
  $$.module("Sfdc.canvas.oauth", module);
  $$.oauth.init()
})(Sfdc.canvas);
(function($$, window) {
  var module = function() {
    var internalCallback;
    function postMessage(message, target_url, target) {
      var sfdcJson = Sfdc.JSON || JSON;
      if($$.isNil(target_url)) {
        throw"ERROR: target_url was not supplied on postMessage";
      }
      var otherWindow = $$.stripUrl(target_url);
      target = target || parent;
      if(window.postMessage) {
        if($$.isObject(message)) {
          message.targetModule = "Canvas"
        }
        message = sfdcJson.stringify(message);
        $$.console.log("Sending Post Message ", message);
        target.postMessage(message, otherWindow)
      }
    }
    function receiveMessage(callback, source_origin) {
      if(window.postMessage) {
        if(callback) {
          internalCallback = function(e) {
            var data, r;
            var sfdcJson = Sfdc.JSON || JSON;
            $$.console.log("Post Message Got callback", e);
            if(!$$.isNil(e)) {
              if(typeof source_origin === "string" && e.origin !== source_origin) {
                $$.console.log("source origin's don't match", e.origin, source_origin);
                return false
              }
              if($$.isFunction(source_origin)) {
                r = source_origin(e.origin, e.data);
                if(r === false) {
                  $$.console.log("source origin's function returning false", e.origin, e.data);
                  return false
                }
              }
              if($$.appearsJson(e.data)) {
                try {
                  data = sfdcJson.parse(e.data)
                }catch(ignore) {
                }
                if(!$$.isNil(data) && ($$.isNil(data.targetModule) || data.targetModule === "Canvas")) {
                  $$.console.log("Invoking callback");
                  callback(data, r)
                }
              }
            }
          }
        }
        if(window.addEventListener) {
          window.addEventListener("message", internalCallback, false)
        }else {
          window.attachEvent("onmessage", internalCallback)
        }
      }
    }
    function removeListener() {
      if(window.postMessage) {
        if(window.removeEventListener) {
          window.removeEventListener("message", internalCallback, false)
        }else {
          window.detachEvent("onmessage", internalCallback)
        }
      }
    }
    return{post:postMessage, receive:receiveMessage, remove:removeListener}
  }();
  $$.module("Sfdc.canvas.xd", module)
})(Sfdc.canvas, window);
(function($$) {
  var pversion, cversion = "41.0";
  var module = function() {
    var purl;
    function getTargetOrigin(to) {
      var h;
      if(to === "*") {
        return to
      }
      if(!$$.isNil(to)) {
        h = $$.stripUrl(to);
        purl = $$.startsWithHttp(h, purl);
        if(purl) {
          return purl
        }
      }
      h = $$.document().location.hash;
      if(h) {
        h = decodeURIComponent(h.replace(/^#/, ""));
        purl = $$.startsWithHttp(h, purl)
      }
      return purl
    }
    function xdCallback(data) {
      if(data) {
        if(submodules[data.type]) {
          submodules[data.type].callback(data)
        }
      }
    }
    var submodules = function() {
      var cbs = [], seq = 0, autog = true;
      function postit(clientscb, message) {
        var wrapped, to, c;
        seq = seq > 100 ? 0 : seq + 1;
        cbs[seq] = clientscb;
        wrapped = {seq:seq, src:"client", clientVersion:cversion, parentVersion:pversion, body:message};
        c = message && message.config && message.config.client;
        to = getTargetOrigin($$.isNil(c) ? null : c.targetOrigin);
        if($$.isNil(to)) {
          throw"ERROR: targetOrigin was not supplied and was not found on the hash tag, this can result from a redirect or link to another page.";
        }
        $$.console.log("posting message ", {message:wrapped, to:to});
        $$.xd.post(wrapped, to, parent)
      }
      function validateClient(client, cb) {
        var msg;
        client = client || $$.oauth && $$.oauth.client();
        if($$.isNil(client) || $$.isNil(client.oauthToken)) {
          msg = {status:401, statusText:"Unauthorized", parentVersion:pversion, payload:"client or client.oauthToken not supplied"}
        }
        if($$.isNil(client.instanceId) || $$.isNil(client.targetOrigin)) {
          msg = {status:400, statusText:"Bad Request", parentVersion:pversion, payload:"client.instanceId or client.targetOrigin not supplied"}
        }
        if(!$$.isNil(msg)) {
          if($$.isFunction(cb)) {
            cb(msg);
            return false
          }else {
            throw msg;
          }
        }
        return true
      }
      var event = function() {
        var subscriptions = {}, STR_EVT = "sfdc.streamingapi";
        function validName(name, res) {
          var msg, r = $$.validEventName(name, res);
          if(r !== 0) {
            msg = {1:"Event names can only contain one namespace", 2:"Namespace has already been reserved", 3:"Event name contains invalid characters"};
            throw msg[r];
          }
        }
        function findSubscription(event) {
          var s, name = event.name;
          if(name === STR_EVT) {
            if(!$$.isNil(subscriptions[name])) {
              s = subscriptions[name][event.params.topic]
            }
          }else {
            s = subscriptions[name]
          }
          if(!$$.isNil(s) && ($$.isFunction(s.onData) || $$.isFunction(s.onComplete))) {
            return s
          }
          return null
        }
        return{callback:function(data) {
          var event = data.payload, subscription = findSubscription(event), func;
          if(!$$.isNil(subscription)) {
            if(event.method === "onData") {
              func = subscription.onData
            }else {
              if(event.method === "onComplete") {
                func = subscription.onComplete
              }
            }
            if(!$$.isNil(func) && $$.isFunction(func)) {
              func(event.payload)
            }
          }
        }, subscribe:function(client, s) {
          var subs = {};
          if($$.isNil(s) || !validateClient(client)) {
            throw"precondition fail";
          }
          $$.each($$.isArray(s) ? s : [s], function(v) {
            if(!$$.isNil(v.name)) {
              validName(v.name, ["canvas", "sfdc"]);
              if(v.name === STR_EVT) {
                if(!$$.isNil(v.params) && !$$.isNil(v.params.topic)) {
                  if($$.isNil(subscriptions[v.name])) {
                    subscriptions[v.name] = {}
                  }
                  subscriptions[v.name][v.params.topic] = v
                }else {
                  throw"[" + STR_EVT + "] topic is missing";
                }
              }else {
                subscriptions[v.name] = v
              }
              subs[v.name] = {params:v.params}
            }else {
              throw"subscription does not have a 'name'";
            }
          });
          if(!client.isVF) {
            postit(null, {type:"subscribe", config:{client:client}, subscriptions:subs})
          }
        }, unsubscribe:function(client, s) {
          var subs = {};
          if($$.isNil(s) || !validateClient(client)) {
            throw"PRECONDITION FAIL: need fo supply client and event name";
          }
          if($$.isString(s)) {
            subs[s] = {};
            delete subscriptions[s]
          }else {
            $$.each($$.isArray(s) ? s : [s], function(v) {
              var name = v.name ? v.name : v;
              validName(name, ["canvas", "sfdc"]);
              subs[name] = {params:v.params};
              if(name === STR_EVT) {
                if(!$$.isNil(subscriptions[name])) {
                  if(!$$.isNil(subscriptions[name][v.params.topic])) {
                    delete subscriptions[name][v.params.topic]
                  }
                  if($$.size(subscriptions[name]) <= 0) {
                    delete subscriptions[name]
                  }
                }
              }else {
                delete subscriptions[name]
              }
            })
          }
          if(!client.isVF) {
            postit(null, {type:"unsubscribe", config:{client:client}, subscriptions:subs})
          }
        }, publish:function(client, e) {
          if(!$$.isNil(e) && !$$.isNil(e.name)) {
            validName(e.name, ["s1"]);
            if(validateClient(client)) {
              postit(null, {type:"publish", config:{client:client}, event:e})
            }
          }
        }}
      }();
      var callback = function() {
        return{callback:function(data) {
          if(data.status === 401 && $$.isArray(data.payload) && data.payload[0].errorCode && data.payload[0].errorCode === "INVALID_SESSION_ID") {
            if($$.oauth) {
              $$.oauth.logout()
            }
          }
          if($$.isFunction(cbs[data.seq])) {
            if(!$$.isFunction(cbs[data.seq])) {
              alert("not function")
            }
            cbs[data.seq](data)
          }else {
          }
        }}
      }();
      var services = function() {
        var sr;
        return{ajax:function(url, settings) {
          var ccb, config, defaults;
          if(!url) {
            throw"PRECONDITION ERROR: url required with AJAX call";
          }
          if(!settings || !$$.isFunction(settings.success)) {
            throw"PRECONDITION ERROR: function: 'settings.success' missing.";
          }
          if(!validateClient(settings.client, settings.success)) {
            return
          }
          ccb = settings.success;
          defaults = {method:"GET", async:true, contentType:"application/json", headers:{"Authorization":"OAuth " + settings.client.oauthToken, "Accept":"application/json"}, data:null};
          config = $$.extend(defaults, settings || {});
          config.success = undefined;
          config.failure = undefined;
          if(config.client.targetOrigin === "*") {
            config.client.targetOrigin = null
          }else {
            purl = $$.startsWithHttp(config.targetOrigin, purl)
          }
          postit(ccb, {type:"ajax", url:url, config:config})
        }, ctx:function(clientscb, client) {
          if(validateClient(client, clientscb)) {
            postit(clientscb, {type:"ctx", accessToken:client.oauthToken, config:{client:client}})
          }
        }, token:function(t) {
          return $$.oauth && $$.oauth.token(t)
        }, version:function() {
          return{clientVersion:cversion, parentVersion:pversion}
        }, signedrequest:function(s) {
          if(arguments.length > 0) {
            sr = s
          }
          return sr
        }, refreshSignedRequest:function(clientscb) {
          var id = window.name.substring("canvas-frame-".length), client = {oauthToken:"null", instanceId:id, targetOrigin:"*"};
          postit(clientscb, {type:"refresh", accessToken:client.oauthToken, config:{client:client}})
        }, repost:function(refresh) {
          var id = window.name.substring("canvas-frame-".length), client = {oauthToken:"null", instanceId:id, targetOrigin:"*"}, r = refresh || false;
          postit(null, {type:"repost", accessToken:client.oauthToken, config:{client:client}, refresh:r})
        }}
      }();
      var frame = function() {
        return{size:function() {
          var docElement = $$.document().documentElement;
          var contentHeight = docElement.scrollHeight, pageHeight = docElement.clientHeight, scrollTop = docElement && docElement.scrollTop || $$.document().body.scrollTop, contentWidth = docElement.scrollWidth, pageWidth = docElement.clientWidth, scrollLeft = docElement && docElement.scrollLeft || $$.document().body.scrollLeft;
          return{heights:{contentHeight:contentHeight, pageHeight:pageHeight, scrollTop:scrollTop}, widths:{contentWidth:contentWidth, pageWidth:pageWidth, scrollLeft:scrollLeft}}
        }, resize:function(client, size) {
          var sh, ch, sw, cw, s = {height:"", width:""}, docElement = $$.document().documentElement;
          if($$.isNil(size)) {
            sh = docElement.scrollHeight;
            ch = docElement.clientHeight;
            if(ch !== sh) {
              s.height = sh + "px"
            }
            sw = docElement.scrollWidth;
            cw = docElement.clientWidth;
            if(sw !== cw) {
              s.width = sw + "px"
            }
          }else {
            if(!$$.isNil(size.height)) {
              s.height = size.height
            }
            if(!$$.isNil(size.width)) {
              s.width = size.width
            }
          }
          if(!$$.isNil(s.height) || !$$.isNil(s.width)) {
            postit(null, {type:"resize", config:{client:client}, size:s})
          }
        }, autogrow:function(client, b, interval) {
          var ival = $$.isNil(interval) ? 300 : interval;
          autog = $$.isNil(b) ? true : b;
          if(autog === false) {
            return
          }
          setTimeout(function() {
            submodules.frame.resize(client);
            submodules.frame.autogrow(client, autog)
          }, ival)
        }}
      }();
      return{services:services, frame:frame, event:event, callback:callback}
    }();
    $$.xd.receive(xdCallback, getTargetOrigin);
    return{ctx:submodules.services.ctx, ajax:submodules.services.ajax, token:submodules.services.token, version:submodules.services.version, resize:submodules.frame.resize, size:submodules.frame.size, autogrow:submodules.frame.autogrow, subscribe:submodules.event.subscribe, unsubscribe:submodules.event.unsubscribe, publish:submodules.event.publish, signedrequest:submodules.services.signedrequest, refreshSignedRequest:submodules.services.refreshSignedRequest, repost:submodules.services.repost}
  }();
  $$.module("Sfdc.canvas.client", module)
})(Sfdc.canvas);

