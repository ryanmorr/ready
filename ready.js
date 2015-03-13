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
		// Append the specifics to an array so that it may be monitored
		listeners.push({
			selector: selector,
			fn: fn
		});
		if(!observer){
			// Use `MutationObserver` to watch for changes in the entire document
			observer = new MutationObserver(check);
			observer.observe(doc.documentElement, {
				childList: true,
				subtree: true
			});
			// Disconnect the mutation observer on unload to avoid memory leaks
			win.addEventListener('unload', observer.disconnect.bind(observer), false);
		}
		// Check elements currently in the DOM
		check();
	};
		
	// Check all listeners to see if they are ready
	function check(){
		var i = 0, len = listeners.length, n = 0, nLen, listener, elements, element;
		for(; i < len; i++){
			listener = listeners[i];
			elements = doc.querySelectorAll(listener.selector);
			nLen = elements.length;
			for(; n < nLen; n++){
				element = elements[n];
				if(!element.ready){
					element.ready = true;
					listener.fn.call(element, element);
				}
			}
		}
	}

	// Expose `ready`
	win.ready = ready;
	    	
})(this);