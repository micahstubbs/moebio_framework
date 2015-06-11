# Moebio Framework

## What is this?

A set of tools for Moebio's projects

## Getting Started

Download the pre-built files (minified and unminified) from the `dist/` directory and start using in your project.

For more info check out the website and docs at [http://bocoup.github.io/moebio_framework/](http://bocoup.github.io/moebio_framework/).

## Project Layout

Primary code in the Moebio Framework is organized in its `src` directory the following way:

  * `dataStructures`: basic data types for storing and manipulating different kinds of data.
  * `tools`: drawing tools for basic shapes, as well as helpers for interaction, data loading, and 3D.
  * `visualization`: functions for visualization the data types used in the framework
  * `operators`: more advanced functionality that work on instances of different data types.

## Requirements

For Deployment: Supported Browsers

For Development: Grunt is used as the build tool. So you need node.js and npm installed on your machine.

## Dev Setup

If you would like to contribute to Moebio Framework, try out customizations locally, or just build from source, you can clone the repository and use the instructions below to get started.

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

### Docs Build

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

### Site Build

Build the Moebio Framework is managed in the [Moebio Framework Site](https://github.com/bocoup/moebio_framework_site) repo.
