
The Moebio Framework is a set of data manipulation and visualization tools for creating interactive web-based visualizations.

### Data Types and Functions

A core philosophy of Moebio Framework is that the type of data you are looking at determines the operations and manipulations you can perform on that data. Another way to say this is that if we get our data into the right _data type_, then we will have access to all the methods and functions in the framework that work on that data type.

And in Moebio Framework, there are a lot of data types and functions to work with them! From the documentation, you can get a sense for how these data types are arranged. There are the normal basic types you would expect, like Strings and Numbers, but also ones like [Rectangle](http://moebiolabs.github.io/moebio_framework/docs/Rectangle.html), [Point](http://moebiolabs.github.io/moebio_framework/docs/Point.html), and [Polygon](http://moebiolabs.github.io/moebio_framework/docs/Polygon.html).

Typically in a data set you are dealing with more then just one of these values, and that is where [List](http://moebiolabs.github.io/moebio_framework/docs/List.html) and [Table](http://moebiolabs.github.io/moebio_framework/docs/Table.html) come in. Most of the basic data types have an associated list type that provides specific methods and functions to that type.  [NumberList](http://moebiolabs.github.io/moebio_framework/docs/NumberList.html) for example has [getMax](http://moebiolabs.github.io/moebio_framework/docs/NumberList.html#getMax), [getMin](http://moebiolabs.github.io/moebio_framework/docs/NumberList.html#getMin), [getAverage](http://moebiolabs.github.io/moebio_framework/docs/NumberList.html#getAverage), and many other methods that are specific to working with a list of numbers.

In addition to these methods callable on an instance of a list or basic data type, Moebio Framework provides a host of customized functions that work on and transform these data types. These functions are organized into namespaces by what types of operations they perform.

* **Operators** work on a particular data type to derive insights or details.
* **Conversions** convert between different data types.
* **Generators** generates artificial data using a number of algorithms.
* **Encodings** serialize and deserialize the data types.

Not all data types have each of these namespaces, but most have some to explore for additional capabilities of the framework. [NumberList](http://moebiolabs.github.io/moebio_framework/docs/NumberList.html) for example, has [NumberListOperators](http://moebiolabs.github.io/moebio_framework/docs/NumberListOperators.html), [NumberListConversions](http://moebiolabs.github.io/moebio_framework/docs/NumberListConversions.html), and [NumberListGenerators](http://moebiolabs.github.io/moebio_framework/docs/NumberListGenerators.html). The namespaces attempt to partition up the frameworks functionality in a consistent manner.

Knowing more about the structure and the capabilities of the data types and their helper functions, let's dive in to using these functions to get an understanding into a particular data set!
