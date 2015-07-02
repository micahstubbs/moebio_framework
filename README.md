# Moebio Framework

## What is this?

A set of tools for Moebio's projects

## Getting Started

Download the pre-built files (minified and unminified) from the `dist/` directory and start using in your project.

For more info check out the website and docs at [http://moebiolabs.github.io/moebio_framework/](http://moebiolabs.github.io/moebio_framework/).

## Project Layout

Primary code in the Moebio Framework is organized in its `src` directory the following way:

  * `dataStructures`: basic data types for storing and manipulating different kinds of data.
  * `tools`: drawing tools for basic shapes, as well as helpers for interaction, data loading, and 3D.
  * `visualization`: functions for visualization the data types used in the framework
  * `operators`: more advanced functionality that work on instances of different data types.
  * `index.js`: This file defines the public interface of the framework.

Moebio Framework uses ES6 module syntax (transpiled using esperanto) to define modules and dependencies. Note: it _does not_ support the use of other ES6 features in the code.

To learn more about ES6 Modules, check out [jsmodules.io](http://jsmodules.io) and ["ECMAScript 6 modules: the final syntax"](http://www.2ality.com/2014/09/es6-modules-final.html)

## Requirements

For Deployment: Supported Browsers

For Development: Grunt is used as the build tool. So you need node.js and npm installed on your machine.

## Dev Setup

If you would like to contribute to Moebio Framework, try out customizations locally, or just build from source, you can clone the repository and use the instructions below to get started.

The project is built using grunt. Most of the grunt tasks are kept in separate
files in the the ```/tasks``` folder.

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

### Building the Site

The website and the build process for managing it are housed in the [Moebio Framework Site Repository](https://github.com/moebiolabs/moebio_framework_site). Check out the details there.

### Releasing the Framework

The [grunt-release](https://github.com/geddski/grunt-release) tool is used for building releases of the framework. Additionally, [grunt-git]() is used to commit build files as part of the release process. Briefly, releasing entails the following procedure:

 - bump the version number in `package.json`.
 - bump version number in `src/Version.js`
 - rebuild distribution files in `dist/`
 - add and commit changed `src/Version.js` and `dist/` files.
 - stage the package.json file's change.
 - commit that change with a message like "release 0.6.22".
 - create a new git tag for the release.
 - push the changes out to GitHub.
 - also push the new tag out to GitHub.
 - create a .zip release on GitHub.

All this can be done with

```bash
grunt release
```

for patch builds. Major and minor releases can also be automated using `grunt release:major` and `grunt release:minor`, respectively. For more on semantic versioning, check out [semver.org](http://semver.org/).
