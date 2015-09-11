# Moebio Framework

## What is this?

Moebio Framework is a JavaScript toolkit for performing data analysis and creating visualizations. It provides a canvas based graphics framework and data structures and operators for manipulating data.

## Features

* Fast canvas based 2D and 3D drawing api with mouse interaction
* Text Rendering Support
* Canvas based UI Elements like Color Pickers, Text Boxes and Tooltips
* A Growing collection of tools for Statistics, Prediction, Math, Network Analysis and more!

## Supported Browsers

Should work on most major browsers. Currently tested on Chrome (44+).

## Getting Started

Download the pre-built files (minified and unminified) from the `dist/` directory and start using in your project.

```
<script src="moebio_framework.js"></script>
```

For more info and examples, check out the website:  [http://moebiolabs.github.io/moebio_framework/](http://moebiolabs.github.io/moebio_framework/).

Moebio Framework is on _npm_ and _bower_ as well.

```
npm install moebio-framework
```

or

```
bower install moebio-framework
```

will install from those sources.

## Getting Help

Have questions? Comments? Suggestions? [Ask away in the issues](https://github.com/moebiolabs/moebio_framework/issues). Tag a question with the _#question_ tag and we will do our best to answer.

## Project Layout

Primary code in the Moebio Framework is organized in its `src` directory the following way:

  * `dataTypes`: basic data types for storing and manipulating different kinds of data.
  * `tools`: drawing tools for basic shapes, as well as helpers for interaction, data loading, and 3D.
  * `visualization`: functions for visualization the data types used in the framework
  * `operators`: more advanced functionality that work on instances of different data types.
  * `index.js`: This file defines the public interface of the framework.

Moebio Framework uses ES6 module syntax (transpiled using rollup) to define modules and dependencies. Note: it _does not_ support the use of other ES6 features in the code.

To learn more about ES6 Modules, check out [jsmodules.io](http://jsmodules.io) and ["ECMAScript 6 modules: the final syntax"](http://www.2ality.com/2014/09/es6-modules-final.html)

## Dev Setup

If you would like to contribute to Moebio Framework, try out customizations locally, or just build from source, you can clone the repository and use the instructions below to get started.

Grunt is used as the build tool. So you need node.js and npm installed on your machine.

The project is built using grunt. Most of the grunt tasks are kept in separate
files in the the `/tasks` folder.

## Common Grunt tasks

Here's a short list of grunt tasks you might want to be familiar with:

```
grunt         # builds the dist/ files once
grunt watch   # builds dist files after every source code change
grunt doc     # build the docs using JSDoc
grunt release # build and deploy a new release of the software
grunt test    # run tests in a chrome window.
grunt jshint  # run hinting tool
```

### Building Code

To build the source code, you will need [Node](https://nodejs.org/) and [Grunt](http://gruntjs.com/) installed on your system.

First use NPM to install the Framework's dependencies:

```bash
npm install
```

Then the default Grunt task will concatenate the source files into the `dist` directory:

```bash
grunt
```

### Building the Docs

The [JSDoc](http://usejsdoc.org/) format is used to annotate the source code and the JSDoc command line tool is used to generate the static API documentation used on the site.

After using `npm install` to download development dependencies, the documentation files can be generated locally using grunt:

```bash
grunt doc
```

This will build the documentation into the following directory:

```bash
docs/build
```

JSDoc templates can be found in `docs/moebio-jsdoc` and are directly inspired by the documentation of [TurfJS](http://turfjs.org/).

## Testing

Use:

```bash
grunt test
```

to run tests.

Tests are in `tests/` directory and use the [Karma](http://karma-runner.github.io/0.13/index.html) testing framework.

## Contributors

* [Santiago Ortiz](https://twitter.com/moebio)
* [Daniel Aguilar](https://twitter.com/protozoo)
* [Jeff Clark](https://twitter.com/JeffClark)
* [Yannick Assogba](https://twitter.com/tafsiri)
* [Jim Vallandingham](https://twitter.com/vlandham)
