# Static Site for Moebio Framework.

This site contains introductory material and docs for the moebio framework and is hosted on github-pages.

## Dev Workflow

The site currently uses jekyll to build as that is what github natively supports. To install you need Ruby installed, then you can use the following command to install jekyll.

````
gem install jekyll
````

Once you have that you can run.

````
jekyll serve
````

From the ```source``` directory and follow the instructions given at the command line.

See http://jekyllrb.com/docs/usage/ for more info.

You can also run the following grunt task from the top level

````
grunt jekyll:serve
````

then go to

````
http://localhost:8000/moebio_framework/index.html
````

to see the site

## Building

To build the site into the ```build folder``` use the following command from the ```source``` folder.

````
jekyll build --destination ../build
````

You can also run the following grunt task from the top level.

````
grunt jekyll:build
````

## Deployment

We are using [this plugin](https://github.com/tschaub/grunt-gh-pages) to manage deploying to gh-pages.

To deploy the site to gh-pages and update the ```gh-pages``` branch at the same time use the following grunt task from the top level folder of the project. This will automatically build the ```site/source``` folder into ```site/build```.

````
grunt deploy
````

Note that this will deploy the content of your current branch, whether it is pushed to github or not.

