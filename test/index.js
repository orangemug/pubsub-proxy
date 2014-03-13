require("customevent-polyfill");

var EventEmitter = require('events').EventEmitter;
var pubsubProxy = require("../");
var sinon = require("sinon");
var assert = require("assert");

describe('pubsubProxy', function() {
  describe("Element", function() {
    var el, proxy;
    beforeEach(function() {
      el = document.createElement("div");
      document.body.appendChild(el);
      proxy = pubsubProxy(el, "addEventListener", "removeEventListener", "dispatchEvent");
    });

    afterEach(function() {
      document.body.removeChild(el);
    });

    it('#object is same as original', function() {
      assert.equal(el, proxy.object());
    });

    it("sub should function as before", function() {
      var event, spy = sinon.spy();
      proxy.addEventListener("click", spy);
      event = new window.CustomEvent("click");
      el.dispatchEvent(event);
      assert(spy.calledOnce);
    });

    it("unsub should function as before", function() {
      var event, spy = sinon.spy();
      proxy.addEventListener("click", spy);
      proxy.removeEventListener("click", spy);
      event = new window.CustomEvent("click");
      el.dispatchEvent(event);
      assert(spy.notCalled);
    });

    it("#destroy should destroy only proxy bindings", function() {
      var event
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();

      proxy.addEventListener("click", spy1);
      el.addEventListener("click", spy2);
      proxy.addEventListener("click", spy3);
      proxy.destroy();
      event = new window.CustomEvent("click");
      el.dispatchEvent(event);
      assert(spy2.calledOnce);
    });
  });

  describe("Event", function() {
    var event, proxy;
    beforeEach(function() {
      event = new EventEmitter();
      proxy = pubsubProxy(event);
    });

    it('#object is same as original', function() {
      assert.equal(event, proxy.object());
    });

    // Event
    it("sub should function as before", function() {
      var spy = sinon.spy();
      proxy.addListener("test", spy);
      event.emit("test");
      assert(spy.calledOnce);
    });

    // Event
    it("unsub should function as before", function() {
      var spy = sinon.spy();
      proxy.addListener("test", spy);
      proxy.removeListener("test", spy);
      event.emit("test");
      assert(spy.notCalled);
    });

    it("#destroy should destroy only proxy bindings", function() {
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();

      proxy.addListener("test", spy1);
      event.addListener("test", spy2);
      proxy.addListener("test", spy3);
      proxy.destroy();
      event.emit("test");
      assert(spy2.calledOnce);
    });

  });
});


