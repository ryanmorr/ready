describe('ready', function(){
    'use strict';

    var expect = chai.expect;

    it('should immediately invoke the callback if the element is currently ready', function(){
        var spy = sinon.spy();
        ready('#container', spy);
        expect(spy.calledOnce).to.equal(true);
        var container = spy.getCall(0).args[0];
        expect(container.id).to.equal('container');
        expect(spy.calledOn(container)).to.equal(true);
    });

    it('should immediately invoke the callback for every element matching the selector that is currently ready', function(){
        var spy = sinon.spy();
        ready('.foo', spy);
        expect(spy.calledThrice).to.equal(true);
        var div = spy.getCall(0).args[0];
        expect(div.tagName.toLowerCase()).to.equal('div');
        expect(div.className).to.equal('foo');
        var span = spy.getCall(1).args[0];
        expect(span.tagName.toLowerCase()).to.equal('span');
        expect(span.className).to.equal('foo');
        var section = spy.getCall(2).args[0];
        expect(section.tagName.toLowerCase()).to.equal('section');
        expect(section.className).to.equal('foo');
    });

    it('should invoke the callback when an element matching the selector is appended to the document dynamically', function(done){
        var element;
        var spy = sinon.spy(function(el){
            expect(spy.calledOnce).to.equal(true);
            expect(el).to.equal(element);
            done();
        });
        ready('.bar', spy);
        setTimeout(function(){
            element = document.createElement('div');
            element.className = 'bar';
            document.body.appendChild(element);
        }, 200);
    });

    it('should invoke the callback for every element matching the selector appended to the document dynamically', function(done){
        var elements = [];
        var spy = sinon.spy(function(el){
            expect(el).to.equal(elements[spy.callCount - 1]);
            if(spy.calledThrice){
                done();    
            }
        });
        ready('.baz', spy);
        setTimeout(function(){
            var frag = document.createDocumentFragment();
            for(var i=0; i < 4; i++){
                var el = document.createElement('div');
                el.className = 'baz';
                frag.appendChild(el);
                elements.push(el);
            }
            document.body.appendChild(frag);
        }, 200);
    });

});