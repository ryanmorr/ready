# ready

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> Detect element availability on the initial page load and those dynamically appended to the DOM

## Install

Download the [CommonJS](http://github.com/ryanmorr/ready/raw/master/dist/ready.cjs.js), [ES Module](http://github.com/ryanmorr/ready/raw/master/dist/ready.esm.js), or [UMD](http://github.com/ryanmorr/ready/raw/master/dist/ready.umd.js) versions. Or install via NPM:

``` sh
npm install @ryanmorr/ready
```

## Usage

Provide a selector string for the element(s) you want to target as the first argument and a callback function as the second argument. It returns a function that stops observing for new elements only for that particular selector/callback combination:

``` javascript
const off = ready('.foo', (element) => {
    off(); // Stop observing for ".foo" elements
});
```

When any element matching the selector becomes available, the callback is invoked in the context of the element as well as passing it as the only parameter. If multiple elements are found, the callback is invoked in succession for each element in document order.

Alternatively, provide just the callback function as the only argument to add a generic DOM ready event listener:

``` javascript
ready((doc) => {
    // The DOM is ready
});
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/ready
[version-image]: https://badge.fury.io/gh/ryanmorr%2Fready.svg
[build-url]: https://travis-ci.org/ryanmorr/ready
[build-image]: https://travis-ci.org/ryanmorr/ready.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE