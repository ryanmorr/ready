/* eslint-disable max-len */

import { expect } from 'chai';
import sinon from 'sinon';
import ready from '../../src/ready';

describe('ready', () => {
    it('should immediately invoke the callback if the element is already available', () => {
        const spy = sinon.spy();
        ready('#container', spy);
        expect(spy.calledOnce).to.equal(true);
        const element = spy.getCall(0).args[0];
        expect(element.id).to.equal('container');
        expect(document.body.contains(element)).to.equal(true);
        expect(spy.calledOn(element)).to.equal(true);
    });

    it('should invoke the callback when an element is appended to the document dynamically', (done) => {
        let element;
        const spy = sinon.spy((added) => {
            expect(spy.calledOnce).to.equal(true);
            expect(added).to.equal(element);
            expect(document.body.contains(added)).to.equal(true);
            expect(spy.calledOn(added)).to.equal(true);
            done();
        });
        ready('.bar', spy);
        setTimeout(() => {
            element = document.createElement('div');
            element.className = 'bar';
            document.body.appendChild(element);
        }, 200);
    });

    it('should invoke the callback for multiple elements that match the selector', (done) => {
        const elements = [];
        const spy = sinon.spy((added) => {
            expect(added).to.equal(elements[spy.callCount - 1]);
            expect(document.body.contains(added)).to.equal(true);
            expect(spy.calledOn(added)).to.equal(true);
            if (spy.calledThrice) {
                done();
            }
        });
        ready('.baz.qux', spy);
        setTimeout(() => {
            const frag = document.createDocumentFragment();
            ['div', 'span', 'section'].forEach((tag) => {
                const element = document.createElement(tag);
                element.className = 'baz qux';
                frag.appendChild(element);
                elements.push(element);
            });
            document.body.appendChild(frag);
        }, 200);
    });
});
