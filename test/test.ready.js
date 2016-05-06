describe('ready', function(){
    'use strict';

    var expect = chai.expect;

    it('should immediately invoke the callback if the element is already available', function(){
        var spy = sinon.spy();
        ready('#container', spy);
        expect(spy.calledOnce).to.equal(true);
        var element = spy.getCall(0).args[0];
        expect(element.id).to.equal('container');
        expect(document.body.contains(element)).to.equal(true);
        expect(spy.calledOn(element)).to.equal(true);
    });

    it('should invoke the callback when an element is appended to the document dynamically', function(done){
        var element,
        spy = sinon.spy(function(added){
            expect(spy.calledOnce).to.equal(true);
            expect(added).to.equal(element);
            expect(document.body.contains(added)).to.equal(true);
            expect(spy.calledOn(added)).to.equal(true);
            done();
        });
        ready('.bar', spy);
        setTimeout(function(){
            element = document.createElement('div');
            element.className = 'bar';
            document.body.appendChild(element);
        }, 200);
    });

    it('should invoke the callback for multiple elements that match the selector', function(done){
        var elements = [],
        spy = sinon.spy(function(added){
            expect(added).to.equal(elements[spy.callCount - 1]);
            expect(document.body.contains(added)).to.equal(true);
            expect(spy.calledOn(added)).to.equal(true);
            if(spy.calledThrice){
                done();    
            }
        });
        ready('.baz.qux', spy);
        setTimeout(function(){
            var frag = document.createDocumentFragment();
            ['div', 'span', 'section'].forEach(function(tag){
                var element = document.createElement(tag);
                element.className = 'baz qux';
                frag.appendChild(element);
                elements.push(element);
            });
            document.body.appendChild(frag);
        }, 200);
    });

});