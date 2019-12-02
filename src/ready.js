let observer;
const listeners = [];
const doc = window.document;
let docReady = /complete|loaded|interactive/.test(doc.readyState);

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

function checkListener({selector, callback}) {
    const elements = doc.querySelectorAll(selector);
    for (let i = 0, len = elements.length; i < len; i++) {
        const element = elements[i];
        if (!element.ready) {
            element.ready = true;
            callback.call(element, element);
        }
    }
}

function checkListeners() {
    listeners.forEach((listener) => checkListener(listener));
}

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

export default function ready(selector, callback) {
    if (!observer) {
        observer = new MutationObserver(checkListeners);
        observer.observe(doc.documentElement, {
            childList: true,
            subtree: true
        });
    }
    if (selector === doc && docReady) {
        callback.call(doc, doc);
        return () => null;
    }
    const listener = {selector, callback};
    listeners.push(listener);
    checkListener(listener);
    return () => removeListener(listener);
}
