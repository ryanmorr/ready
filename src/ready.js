/*
 * Common varilables
 */
let observer;
const listeners = [];
const doc = window.document;
const documentElement = doc.documentElement;

/*
 * Find the supported version of `matches`
 * to use
 */
const matchesFn = [
    'matches',
    'webkitMatchesSelector',
    'msMatchesSelector'
].reduce((fn, name) => {
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
    for (const mutation of mutations) {
        for (const element of mutation.addedNodes) {
            listeners.forEach((listener) => {
                if (element.nodeType === 1 && matches(element, listener.selector)) {
                    listener.callback.call(element, element);
                }
            });
        }
    }
}

/*
 * Remove a listener
 *
 * @param {String} selector
 * @param {Function} callback
 * @api private
 */
function removeListener(selector, callback) {
    let i = listeners.length;
    while (i--) {
        const listener = listeners[i];
        if (listener.selector === selector && listener.callback === callback) {
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
 * @param {Function} callback
 * @return {Function}
 * @api public
 */
export default function ready(selector, callback) {
    if (!observer) {
        observer = new MutationObserver(checkMutations);
        observer.observe(doc.documentElement, {
            childList: true,
            subtree: true
        });
    }
    listeners.push({selector, callback});
    Array.from(doc.querySelectorAll(selector)).forEach((el) => callback.call(el, el));
    return () => removeListener(selector, callback);
}
