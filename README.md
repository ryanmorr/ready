# ready

[![Version Badge][version-image]][project-url]
[![License][license-image]][license-url]
[![Build Status][build-image]][build-url]

> Detect element availability on the initial page load and those dynamically appended to the DOM

## Install

Download the [CJS](https://github.com/ryanmorr/ready/raw/master/dist/cjs/ready.js), [ESM](https://github.com/ryanmorr/ready/raw/master/dist/esm/ready.js), [UMD](https://github.com/ryanmorr/ready/raw/master/dist/umd/ready.js) versions or install via NPM:

``` sh
npm install @ryanmorr/ready
```

## Usage

Provide a selector string for the element(s) you want to target as the first argument and a callback function as the second argument. It returns a function that stops observing for new elements only for that particular selector/callback combination:

``` javascript
const stop = ready('.foo', (element) => {
    stop(); // Stop observing for ".foo" elements
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
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/ready?color=blue&style=flat-square
[build-url]: https://github.com/ryanmorr/ready/actions
[build-image]: https://img.shields.io/github/actions/workflow/status/ryanmorr/ready/node.js.yml?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/ready?color=blue&style=flat-square
[license-url]: UNLICENSE