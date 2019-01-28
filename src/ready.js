/*
 * Common varilables
 */
let observer;
const listeners = [];
const doc = window.document;

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
    listeners.forEach((listener) => checkSelector(listener.selector, listener.fn));
}

/*
 * Remove a listener
 *
 * @param {String} selector
 * @param {Function} fn
 * @api private
 */
function removeListener(selector, fn) {
    let i = listeners.length;
    while (i--) {
        const listener = listeners[i];
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
export default function ready(selector, fn) {
    if (!observer) {
        observer = new MutationObserver(checkListeners);
        observer.observe(doc.documentElement, {
            childList: true,
            subtree: true
        });
    }
    listeners.push({selector, fn});
    checkSelector(selector, fn);
    return () => removeListener(selector, fn);
}
