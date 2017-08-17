/*! ready v1.2.0 | https://github.com/ryanmorr/ready */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ready = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ready;
/*
 * Common varilables
 */
var observer = void 0;
var listeners = [];
var doc = window.document;
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

/*
 * Checks a selector for new matching
 * elements and invokes the callback
 * if one is found
 *
 * @param {String} selector
 * @param {Function} fn
 * @api private
 */
function checkSelector(selector, fn) {
    var elements = doc.querySelectorAll(selector);
    for (var i = 0, len = elements.length; i < len; i++) {
        var element = elements[i];
        if (!element.ready) {
            element.ready = true;
            fn.call(element, element);
        }
    }
}

/*
 * Check all selectors for new elements
 * following a change in the DOM
 *
 * @api private
 */
function checkListeners() {
    listeners.forEach(function (listener) {
        return checkSelector(listener.selector, listener.fn);
    });
}

/*
 * Remove a listener
 *
 * @param {String} selector
 * @param {Function} fn
 * @api private
 */
function removeListener(selector, fn) {
    var i = listeners.length;
    while (i--) {
        var listener = listeners[i];
        if (listener.selector === selector && listener.fn === fn) {
            listeners.splice(i, 1);
            if (!listeners.length && observer) {
                observer.disconnect();
                observer = null;
            }
        }
    }
}

/*
 * Add a selector to watch for when a matching
 * element becomes available in the DOM
 *
 * @param {String} selector
 * @param {Function} fn
 * @return {Function}
 * @api public
 */
function ready(selector, fn) {
    if (!observer) {
        observer = new MutationObserver(checkListeners);
        observer.observe(doc.documentElement, {
            childList: true,
            subtree: true
        });
    }
    listeners.push({ selector: selector, fn: fn });
    checkSelector(selector, fn);
    return function () {
        return removeListener(selector, fn);
    };
}
module.exports = exports["default"];

},{}]},{},[1])(1)
});

