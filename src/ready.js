/*
 * Common varilables
 */
let observer;
const listeners = [];
const doc = window.document;
const documentElement = doc.documentElement;
let docReady = /complete|loaded|interactive/.test(doc.readyState);

/**
 * Check if the DOM is already loaded
 */
if (!docReady) {
    doc.addEventListener('DOMContentLoaded', () => {
        docReady = true;
        let i = listeners.length;
        while (i--) {
            const listener = listeners[i];
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
            if (element.nodeType !== 1) continue;
            listeners.forEach((listener) => {
                const items = Array.from(element.querySelectorAll(listener.selector));
                if (matches(element, listener.selector)) items.push(element);
                items.forEach((el) => listener.callback.call(el, el));
            });
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
    let i = listeners.length;
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
export default function ready(selector, callback) {
    if (!observer) {
        observer = new MutationObserver(checkMutations);
        observer.observe(doc.documentElement, {
            childList: true,
            subtree: true
        });
    }
    if (selector === doc && docReady) {
        callback.call(doc, doc);
        return () => {};
    }
    const listener = {selector, callback};
    listeners.push(listener);
    if (typeof selector === 'string') {
        Array.from(doc.querySelectorAll(selector)).forEach((el) => callback.call(el, el));
    }
    return () => removeListener(listener);
}
