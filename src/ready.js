let observer = null;
const listeners = [];
const doc = window.document;
const IS_READY = Symbol('ready');
let docReady = /complete|loaded|interactive/.test(doc.readyState);

if (!docReady) {
    doc.addEventListener('DOMContentLoaded', () => {
        docReady = true;
        for(let i = 0, len = listeners.length; i < len; i++) {
            const listener = listeners[i];
            if (listener.selector === doc) {
                listener.callback.call(doc, doc);
                listeners.splice(i--, 1);
            }
        }
    });
}

function checkListener({selector, callback}) {
    const elements = doc.querySelectorAll(selector);
    for (let i = 0, len = elements.length; i < len; i++) {
        const element = elements[i];
        if (!element[IS_READY]) {
            element[IS_READY] = true;
            callback.call(element, element);
        }
    }
}

function checkListeners() {
    listeners.forEach(checkListener);
}

function removeListener(listener) {
    let index = listeners.indexOf(listener);
    if (index !== -1) {
        listeners.splice(index, 1);
    }
    if (listeners.length === 0 && observer != null) {
        observer.disconnect();
        observer = null;
    }
}

export default function ready(selector, callback) {
    if (typeof selector === 'function') {
        callback = selector;
        selector = doc;
        if (docReady) {
            callback.call(doc, doc);
            return () => null;
        }
    }
    if (!observer) {
        observer = new MutationObserver(checkListeners);
        observer.observe(doc.documentElement, {
            childList: true,
            subtree: true
        });
    }
    const listener = {selector, callback};
    listeners.push(listener);
    checkListener(listener);
    return () => removeListener(listener);
}
