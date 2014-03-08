function bind(fun, obj) {
  return function() {
    return fun.apply(obj, arguments);
  }
}

/**
 * Really simple proxy for objects that support the pubsub pattern
 *
 * @param {Object} obj with pubsub methods
 * @param {Array|String} subName name(s) of sub method on object
 * @param {Array|String} unsubName name(s) of unsub method on object
 * @return {Object} with subsub methods proxied to `obj`
 */
function eventProxy(obj, subName, unsubName) {
  var i, len, tmp, subFun, unsubFun, events = [], tmpObj = {}, directProxies = [];
  subName   = subName   || "addListener";
  unsubName = unsubName || "removeListener";

  // If we define any args don't default anything
  if(arguments.length > 1) {
    directProxies = Array.prototype.slice.call(arguments, 3);
  } else {
    directProxies = ["emit"];
  }

  // Bind direct proxies
  for(i=0, len=directProxies.length; i<len; i++) {
    tmp = directProxies[i];
    if(obj[tmp]) {
      tmpObj[tmp] = bind(obj[tmp], obj);
    }
  }

  // sub handling
  subFun = function(funName) {
    return function() {
      var args = Array.prototype.slice.call(arguments, 0);
      events.push(args);
      return obj[funName].apply(obj, args);
    }
  }

  if(subName instanceof Array) {
    for(i=0, len=subName.length; i<len; i++) {
      var n = subName[i];
      tmpObj[n] = subFun(n);
    }
  } else {
    tmpObj[subName] = subFun(subName);
  }

  // unsub handling
  unsubFun = function(funName) {
    return function() {
      offArgs = arguments;
      events = events.filter(function(arg, idx) {
        if(offArgs[idx] === arg) {
          return false;
        }
        return true;
      });
      return obj[funName].apply(obj, arguments);
    }
  };

  if(unsubName instanceof Array) {
    for(i=0, len=unsubName.length; i<len; i++) {
      var n = unsubName[i];
      tmpObj[n] = unsubFun(n);
    }
  } else {
    tmpObj[unsubName] = unsubFun(unsubName);
  }

  // Destroy everything
  tmpObj.destroy = function() {
    for(i=0, len=events.length; i<len; i++) {
      var k = unsubName;
      if(k instanceof Array) k[0];
      obj[k].apply(obj, events[i]);
    }
    events = [];
  };

  // Return undelying object
  tmpObj.object = function() {
    return obj;
  }

  return tmpObj;
};

module.exports = eventProxy;
