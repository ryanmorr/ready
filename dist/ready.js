/*! ready v1.1.0 | https://github.com/ryanmorr/ready */
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
        // Make sure the callback isn't invoked with the
        // same element more than once
        if (!element.ready) {
            element.ready = true;
            // Invoke the callback with the element
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
    for (var i = 0, len = listeners.length; i < len; i++) {
        var listener = listeners[i];
        checkSelector(listener.selector, listener.fn);
    }
}

/*
 * Add a selector to watch for when a matching
 * element becomes available in the DOM
 *
 * @param {String} selector
 * @param {Function} fn
 * @api public
 */
function ready(selector, fn) {
    if (!observer) {
        // Watch for changes in the document
        observer = new MutationObserver(checkListeners);
        observer.observe(doc.documentElement, {
            childList: true,
            subtree: true
        });
    }
    // Store the selector and callback to be monitored
    listeners.push({ selector: selector, fn: fn });
    // Check if the element is currently in the DOM
    checkSelector(selector, fn);
}
module.exports = exports["default"];

},{}]},{},[1])(1)
});

