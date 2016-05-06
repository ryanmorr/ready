# ready [![Build Status](https://travis-ci.org/ryanmorr/ready.svg)](https://travis-ci.org/ryanmorr/ready)

Watch for specific element availability on initial page load as well as dynamically appended elements via mutation observers. Please refer to the [blog post](http://www.ryanmorr.com/using-mutation-observers-to-watch-for-element-availability) to read more.

## Usage

Provide a selector string for the element(s) you want to target as the first argument and the callback function as the second argument:

```javascript
ready('.foo', function(element){
    // do something
});
```

When any element matching the selector becomes available, the callback is invoked in the context of the element as well as passing it as the only parameter. If multiple elements are available, the callback is invoked in succession for each element in document order.

## Browser Support

* Chrome 18*
* Firefox 14*
* Opera 15+
* Safari 6+
* Internet Explorer 11+
* Android 4.4+
* iOS 7.1*

## Installation

Ready is [CommonJS](http://www.commonjs.org/) and [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) compatible with no dependencies. You can download the [development](http://github.com/ryanmorr/ready/raw/master/dist/ready.js) or [minified](http://github.com/ryanmorr/ready/raw/master/dist/ready.min.js) version, or install it in one of the following ways:

``` sh
npm install git+https://git@github.com/ryanmorr/ready.git

bower install ryanmorr/ready
```

## Tests

Open `test/runner.html` in your browser or test with PhantomJS by issuing the following commands:

``` sh
npm install
npm install -g gulp
gulp test
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).