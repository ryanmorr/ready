/*
 * Common varilables
 */
let observer;
const listeners = [];
const doc = window.document;
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

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
    const elements = doc.querySelectorAll(selector);
    for (let i = 0, len = elements.length; i < len; i++) {
        const element = elements[i];
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
    for (let i = 0, len = listeners.length; i < len; i++) {
        const listener = listeners[i];
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
export default function ready(selector, fn) {
    if (!observer) {
        // Watch for changes in the document
        observer = new MutationObserver(checkListeners);
        observer.observe(doc.documentElement, {
            childList: true,
            subtree: true
        });
    }
    // Store the selector and callback to be monitored
    listeners.push({selector, fn});
    // Check if the element is currently in the DOM
    checkSelector(selector, fn);
}
