
The Moebio Framework is a set of data manipulation and visualization tools for creating interactive web-based visualizations.


## Getting Started With Moebio Framework

Let's start by making a simple example with the Moebio Framework.

### Including the script

First add the framework source file and shim to an html page.

```html
<script src="js/moebio_framework.js"></script>
<script src="js/global_shim.js"></script>
```
The `global_shim` adds all the functions and data types in `moebio_framework`
into the global environment.

This should go near the bottom of the page, right before the closing `body` tag - which allows the rest of the page to load before needing to load this JavaScript.


### Setting up the Canvas

Moebio Framework harnesses [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) for much of its visualization capabilities. So, we need to provide it with a canvas element to draw in.

This canvas element is expected to have an id of `main`. So, the HTML could look something like this:

```html
<div id="maindiv">
  <canvas id="main"></canvas>
</div>
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

Let's use just one of these functions, `fRect`, to draw a rectangle. We will also use `setFill` to provide the rectangle's color.

Modify the cycle function to look like this:

```javascript
cycle = function() {
  setFill('steelblue');
  fRect(cW / 2, cH / 2, (mX / 2), (mY / 2));
}
```

Reloading the page gives us a blue rectangle in the middle of the visualization, with dimensions based on the current location of the mouse.

### Basic Interaction

So we have a rectangle updating with every `cycle`. Let's add another shape that is interactive and responds to mouse events.

Still in cycle, add this to create a circle:

```javascript
  setFill('grey');
  var over = fCircleM(100, 100, 60);
```

Drawing functions that end in `M` return `true` if the mouse is hovering over the drawn shape during the current iteration of `cycle`.

We can use this returned value to visually update the shape when it is moused over:

```javascript
  if(over) {
    setFill('orange');
    fCircle(100, 100, 60);
    setStroke('grey');
    sCircle(100, 100, 70);
  }
```

Now, if `over` is true, meaning this circle is currently being moused over, we change the fill and re-draw an orange circle on top of our original grey circle. We also add a ring around this circle using `sCircle`.

As an aside, the use of `sCircle` hints that there are a number of different draw functions availible to us for each type of basic shape. Functions that start with `f`, like `fRect` and `fCircle` draw a filled in shape. Those starting with `s` draw just a stroke. And those that start with `fs`, like `fsRect` draw the shape both filled in and with an outline. Check out the documentation to find out more!

Finally, let's add a basic mouse click interaction. Moebio Framework indicates mouse interactions by setting a few globally accessible variables:

 - `MOUSE_DOWN` - true if the current `cycle` has a mouse down event.
 - `MOUSE_UP` - true if the current `cycle` has a mouse up event.
 - `MOUSE_PRESSED` - true if the mouse is currently being pressed.


 Let's change the color of the circle to be red if the mouse clicks on it. For this, we will want to handle both `MOUSE_DOWN` and `MOUSE_PRESSED` to ensure it stays red if the mouse is held down.

 Add this to the end of the `cycle` function:

 ```javascript
 if((MOUSE_DOWN || MOUSE_PRESSED) && over) {
   setFill('red');
   fCircle(100, 100, 60);
 }
 ```

 Now, if the mouse is over the circle, and it is being pressed down, the circle will turn red.

Just to see it all together, here is our complete `cycle` function:


```javascript
cycle = function cycle() {
  setFill('steelblue');
  fRect(cW / 2, cH / 2, (mX / 2), (mY / 2));

  setFill('grey');
  var over = fCircleM(100, 100, 60);

  if(over) {
    setFill('orange');
    fCircle(100, 100, 60);
    setStroke('grey');
    sCircle(100, 100, 70);
  }

  if((MOUSE_DOWN || MOUSE_PRESSED) && over) {
    setFill('red');
    fCircle(100, 100, 60);
  }
};
```
