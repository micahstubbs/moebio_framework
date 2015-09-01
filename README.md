# Static Site for Moebio Framework.

This site contains introductory material and docs for the [moebio framework](https://github.com/moebiolabs/moebio_framework) and is hosted on github-pages.

## Initial Setup

The site currently uses jekyll to build as that is what github natively supports. To install you need Ruby installed, then you can use the following command to install jekyll.

```
gem install jekyll
```

You are also expected to have node and npm installed and available on your machine.

## Dev Workflow

The process for building the site is as follows:

 - pull down latest moebio framework changes.
 - build the site and docs.
 - deploy site to github pages.

## Building

To build the site into the `build folder` use the following command:

```
grunt build
```

This task also pulls down the latest version of Moebio framework. As the framework is listed as a dependency in the `package.json`, you can also run this step manually using:

```
npm install
```

## Local Preview

Changes can be observed locally using

```
grunt serve
```

Which uses the `jekyll serve` command to build the project locally.

See http://jekyllrb.com/docs/usage/ for more info.

## Deployment

We are using [this plugin](https://github.com/tschaub/grunt-gh-pages) to manage deploying to gh-pages.

To deploy the site to gh-pages and update the `gh-pages` branch at the same time use the following grunt task from the top level folder of the project. This will automatically build the `site/source` folder into `site/build`.

```
grunt deploy
```

Note that this will deploy the content of your current branch, whether it is pushed to github or not.
