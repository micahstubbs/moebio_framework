## Moebio Framework?

The Moebio Framework is a set of data manipulation and visualization tools for creating interactive web-based visualizations.


## Getting Started With Moebio Framework

Let's start by making a simple example with the Moebio Framework.

### Including the script

First add the source file to an html page.

```html
<script src="js/moebio.js"></script>
```

This can go in the `head` of the page, or you can put it at the bottom, right before the closing `body` tag - which allows the rest of the page to load before needing to load this JavaScript.


### Setting up the Canvas

Moebio Framework harnesses [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) for much of its visualization capabilities. So, we need to provide it with a canvas element to draw in.

This canvas element is expected to have an id of `main`. Moebio Framework also expects a `removeDiv` div to be present on the page. So, the HTML should look something like this:

```html
<div id="maindiv">
	<canvas id="main"></canvas>
</div>

<div id="removeDiv"></div>
```

With this, we are ready to use Moebio Framework.

### init and cycle

Moebio Framework is built around the concept of a drawing loop. The drawing loop is called over and over again, and it is responsible for drawing the visualization for each _frame_. If you have worked with something like [Processing](https://processing.org/), then this will look familiar.

In Moebio there are two main functions to implement: `init` which gets called before the looping starts, and `cycle` which draws the visualization for each iteration of the loop.

For this simple example, we can start to implement them inside a `script` tag in our html page:

```javascript
init = function() {
	// setup code goes here
}

cycle = function() {
	// drawing code goes here
}
```

### Visualization Attributes

The Moebio Framework provides access to a number of useful attributes that let you reason about the current state of the visualization and handle various types of interations.

These attributes are accessible at any point in your code. Lets use [console.log](https://developer.mozilla.org/en-US/docs/Web/API/Console/log) to monitor some of them.

In `cycle`, add the following logging:

```javascript
cycle = function() {
	console.log("canvas width: " + cW + " canvas height: " + cH);
	console.log("mouse x: " + mX + " mouse y: " + mY);
}
```

Now open up this page in a web browser and also open the browser's console.

You should see a bunch of logs scrolling past in the console. Mousing over the window will show the change in the `mX` and `mY`, the mouse X and Y position. Resizing the window will change `cW` and `cH`, the canvas's width and height.

We will look at some of the other attributes later, but these should be enough to get us started.

### Drawing Functions

Part of what makes Moebio Framework a powerful tool is its collection of drawing functions. We can think of these as helper functions that simplify the canvas API to allow for quickly displaying common shapes.

Let's use just one of these functions, `fRect`, to draw a few rectangles. We will also use `setFill` to provide the rectangle's color.

Modify the cycle function to look like this:

```javascript
cycle = function() {
	setFill('red');
	fRect(cW / 2, cH / 2, 50, 50);

	setFill('steelblue');
	fRect(mX - 20, mY - 20, 30, 30);
}
```

Reloading the page gives us a red square in the middle of the visualization, and blue square that follows the mouse around the page.
