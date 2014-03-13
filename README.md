# pubsub-proxy
A really simple proxy for objects that support the pubsub pattern, allowing to to destroy groups of subscription handlers

[![browser support](https://ci.testling.com/orangemug/pubsub-proxy.png)](https://ci.testling.com/orangemug/pubsub-proxy)

## API
API is as follows

    var pubsubProxy = require("pubsub-proxy");
    pubsubProxy(object, addMethod, removeMethod, otherMethodsToProxy...);

## Usage

    var obj = new require("events").EventEmitter;

    // addListener/removeListener/emit are the defaults and optional
    pObj = pubsubProxy(obj, "addListener", "removeListener", "emit");

    // Bind some handlers
    pObj.addListener("foo", hdl);  // [1]
    pObj.addListener("bar", hdl);  // [2]
    obj.addListener("bla", hdl);   // [3]

    // Remove all added events via proxy ([1] and [2]) event [3] will still be bound to the object
    pObj.destroy();

    assert(pObj.object() === obj); // true

## License
MIT
