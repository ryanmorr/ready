/*
 * ready
 * Watch for when an element becomes available in the DOM
 * @param {String} selector
 * @param {Function} fn
 */

(function(win){
    'use strict';

    var listeners = [], 
    doc = win.document, 
    MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
    observer;

    function ready(selector, fn){
        // Store the selector and callback to be monitored
        listeners.push({
            selector: selector,
            fn: fn
        });
        if(!observer){
            // Watch for changes in the document
            observer = new MutationObserver(checkListeners);
            observer.observe(doc.documentElement, {
                childList: true,
                subtree: true
            });
        }
        // Check if the element is currently in the DOM
        check(selector, fn);
    }

    function checkListeners(){
        // Check the DOM for elements matching a stored selector
        for(var i = 0, len = listeners.length, listener; i < len; i++){
            listener = listeners[i];
            check(listener.selector, listener.fn);
        }
    }

    function check(selector, fn){
        // Query for elements matching the specified selector
        var elements = doc.querySelectorAll(selector), i = 0, len = elements.length, element;
        for(; i < len; i++){
            element = elements[i];
            // Make sure the callback isn't invoked with the 
            // same element more than once
            if(!element.ready){
                element.ready = true;
                // Invoke the callback with the element
                fn.call(element, element);
            }
        }
    }

    // Expose `ready`
    win.ready = ready;
            
})(this);