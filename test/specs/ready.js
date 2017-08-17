/* eslint-disable max-len */

import { expect } from 'chai';
import sinon from 'sinon';
import ready from '../../src/ready';

function timeout(fn) {
    setTimeout(fn, 100);
}

describe('ready', () => {
    it('should immediately invoke the callback if the element is already available', () => {
        const spy = sinon.spy();
        const off = ready('#container', spy);

        expect(spy.calledOnce).to.equal(true);
        const element = spy.getCall(0).args[0];
        expect(element.id).to.equal('container');
        expect(document.body.contains(element)).to.equal(true);
        expect(spy.calledOn(element)).to.equal(true);
        document.body.removeChild(element);
        off();
    });

    it('should invoke the callback when an element is appended to the document dynamically', (done) => {
        const element = document.createElement('div');
        element.className = 'bar';

        let off = 1;
        const spy = sinon.spy((added) => {
            expect(spy.calledOnce).to.equal(true);
            expect(added).to.equal(element);
            expect(document.body.contains(added)).to.equal(true);
            expect(spy.calledOn(added)).to.equal(true);
            document.body.removeChild(element);
            off();
            done();
        });

        off = ready('.bar', spy);

        timeout(() => document.body.appendChild(element));
    });

    it('should invoke the callback for multiple elements that match the selector', (done) => {
        const elements = [];
        const frag = document.createDocumentFragment();
        ['div', 'span', 'section'].forEach((tag) => {
            const element = document.createElement(tag);
            element.className = 'baz qux';
            frag.appendChild(element);
            elements.push(element);
        });

        let off = 1;
        const spy = sinon.spy((added) => {
            expect(added).to.equal(elements[spy.callCount - 1]);
            expect(document.body.contains(added)).to.equal(true);
            expect(spy.calledOn(added)).to.equal(true);
            if (spy.calledThrice) {
                elements.forEach((el) => document.body.removeChild(el));
                off();
                done();
            }
        });

        off = ready('.baz.qux', spy);

        timeout(() => document.body.appendChild(frag));
    });

    it('should return a function that stops observing for new elements when invoked', (done) => {
        const element = document.createElement('div');
        element.className = 'bar';

        const spy = sinon.spy();
        const off = ready('.bar', spy);

        off();
        document.body.appendChild(element);

        timeout(() => {
            expect(spy.called).to.equal(false);
            document.body.removeChild(element);
            done();
        });
    });

    it('should disconnect the mutation observer when all listeners have been removed', () => {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        const mutationSpy = sinon.spy(MutationObserver.prototype, 'disconnect');

        const off1 = ready('.aaa', () => {});
        const off2 = ready('.bbb', () => {});

        off1();
        expect(mutationSpy.called).to.equal(false);
        off2();
        expect(mutationSpy.called).to.equal(true);
        mutationSpy.restore();
    });
});
