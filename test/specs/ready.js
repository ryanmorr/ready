import ready from '../../src/ready';

describe('ready', () => {
    it('should immediately invoke the callback if the element is already available', () => {
        const div = document.createElement('div');
        div.id = 'foo';
        document.body.appendChild(div);

        const spy = sinon.spy();
        const off = ready('#foo', spy);

        expect(spy.callCount).to.equal(1);
        const element = spy.getCall(0).args[0];
        expect(element).to.equal(div);
        expect(document.body.contains(element)).to.equal(true);
        expect(spy.calledOn(element)).to.equal(true);

        document.body.removeChild(element);
        off();
    });

    it('should invoke the callback when an element is appended to the document dynamically', (done) => {
        const element = document.createElement('div');
        element.className = 'bar';

        const spy = sinon.spy((added) => {
            expect(spy.callCount).to.equal(1);
            expect(added).to.equal(element);
            expect(document.body.contains(added)).to.equal(true);
            expect(spy.calledOn(added)).to.equal(true);

            document.body.removeChild(element);
            off();
            done();
        });

        const off = ready('.bar', spy);

        requestAnimationFrame(() => document.body.appendChild(element));
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

        const spy = sinon.spy((added) => {
            expect(added).to.equal(elements[spy.callCount - 1]);
            expect(document.body.contains(added)).to.equal(true);
            expect(spy.calledOn(added)).to.equal(true);

            if (spy.callCount === 3) {
                elements.forEach((el) => document.body.removeChild(el));
                off();
                done();
            }
        });

        const off = ready('.baz.qux', spy);

        requestAnimationFrame(() => document.body.appendChild(frag));
    });

    it('should support selectors with combinators', (done) => {
        const element = document.createElement('div');
        element.className = 'foo';

        const child = document.createElement('div');
        child.className = 'bar';
        element.appendChild(child);

        const spy = sinon.spy((added) => {
            expect(added).to.equal(child);
            expect(document.body.contains(child)).to.equal(true);
            expect(spy.calledOn(added)).to.equal(true);

            document.body.removeChild(element);
            off();
            done();
        });

        const off = ready('.foo .bar', spy);

        requestAnimationFrame(() => document.body.appendChild(element));
    });

    it('should support a generic DOM ready listener by providing the callback function as the only argument', (done) => {
        const spy = sinon.spy((el) => {
            expect(spy.callCount).to.equal(1);
            expect(el).to.equal(document);
            expect(spy.calledOn(el)).to.equal(true);
            expect(/complete|loaded|interactive/.test(document.readyState)).to.equal(true);

            done();
        });

        ready(spy);
    });

    it('should only invoke the callback function once per element despite multiple insertions into the DOM', (done) => {
        const element = document.createElement('div');
        element.className = 'foo';
        document.body.appendChild(element);

        const spy = sinon.spy();
        const off = ready('.foo', spy);

        expect(spy.callCount).to.equal(1);
        document.body.removeChild(element);

        document.body.appendChild(element);

        requestAnimationFrame(() => {
            expect(spy.callCount).to.equal(1);
            document.body.removeChild(element);
            off();
            done();
        });
    });

    it('should return a function that stops observing for new elements when invoked', (done) => {
        const element = document.createElement('div');
        element.className = 'bar';

        const spy = sinon.spy();
        const off = ready('.bar', spy);

        off();
        document.body.appendChild(element);

        requestAnimationFrame(() => {
            expect(spy.called).to.equal(false);
            document.body.removeChild(element);
            done();
        });
    });

    it('should disconnect the mutation observer when all listeners have been removed', () => {
        const mutationSpy = sinon.spy(MutationObserver.prototype, 'disconnect');

        const off1 = ready('.aaa', () => {});
        const off2 = ready('.bbb', () => {});

        off1();
        expect(mutationSpy.called).to.equal(false);

        off2();
        expect(mutationSpy.called).to.equal(true);

        mutationSpy.restore();
    });/**/
});
