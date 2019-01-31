/*! @ryanmorr/ready v1.3.1 | https://github.com/ryanmorr/ready */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ready = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ready;

/*
 * Common varilables
 */
var observer;
var listeners = [];
var doc = window.document;
var documentElement = doc.documentElement;
var docReady = /complete|loaded|interactive/.test(doc.readyState);
/**
 * Check if the DOM is already loaded
 */

if (!docReady) {
  doc.addEventListener('DOMContentLoaded', function () {
    docReady = true;
    var i = listeners.length;

    while (i--) {
      var listener = listeners[i];

      if (listener.selector === doc) {
        listener.callback.call(doc, doc);
        listeners.splice(i, 1);
      }
    }
  });
}
/*
 * Find the supported version of `matches`
 * to use
 */


var matchesFn = ['matches', 'webkitMatchesSelector', 'msMatchesSelector'].reduce(function (fn, name) {
  if (fn) {
    return fn;
  }

  return name in documentElement ? name : fn;
}, null);
/*
 * Checks if an element matches a given
 * CSS selector
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api private
 */

function matches(el, selector) {
  return el[matchesFn](selector);
}
/*
 * Check mutations for added nodes
 * that match a selector string and
 * invoke the callback function if it
 * does
 *
 * @param {Array} mutations
 * @api private
 */


function checkMutations(mutations) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = mutations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var mutation = _step.value;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        var _loop = function _loop() {
          var element = _step2.value;
          listeners.forEach(function (listener) {
            if (element.nodeType === 1 && matches(element, listener.selector)) {
              listener.callback.call(element, element);
            }
          });
        };

        for (var _iterator2 = mutation.addedNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}
/*
 * Remove a listener
 *
 * @param {Object} listener
 * @api private
 */


function removeListener(listener) {
  var i = listeners.length;

  while (i--) {
    if (listener === listeners[i]) {
      listeners.splice(i, 1);
    }
  }

  if (!listeners.length && observer) {
    observer.disconnect();
    observer = null;
  }
}
/*
 * Add a selector to watch for when a matching
 * element becomes available in the DOM
 *
 * @param {String|Document} selector
 * @param {Function} callback
 * @return {Function}
 * @api public
 */


function ready(selector, callback) {
  if (!observer) {
    observer = new MutationObserver(checkMutations);
    observer.observe(doc.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (selector === doc && docReady) {
    callback.call(doc, doc);
    return function () {};
  }

  var listener = {
    selector: selector,
    callback: callback
  };
  listeners.push(listener);

  if (typeof selector === 'string') {
    Array.from(doc.querySelectorAll(selector)).forEach(function (el) {
      return callback.call(el, el);
    });
  }

  return function () {
    return removeListener(listener);
  };
}

module.exports = exports.default;

},{}]},{},[1])(1)
});

