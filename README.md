# Perform

When working with asynchronous calls, creating and maintaining the flow of logic through these calls can be very tricky. Perform provides a simple, straightforward and easy to understand way to implement any number of complex logic patterns.

## Serial and Parallel
There are two ways of handling asynchronous actions. While the asynchronous call itself is handled in a single thread (one thing happening at a time), you may want to wait for that method to callback before continuing to execute further actions. This is known as "serial", and basically means, everything happens in order.

In the example below, function "one" is called. After it notifies the Perform object that the action is complete, function "two" is the called, and so on.

```js
new Perform(
	function one(control) {
		// processing...
		control.actionCompleted();
		// happens first
	},
	function two(control) {
		// processing...
		control.actionCompleted();
		// happens second
	}
).run(callback);
```

If you need to run concurrent async method calls, then you can create a `Perform.parallel` object instead (or set a regular `Parallel` object's `.parellel` property to _true_ before running it). In the example below, function "one" will be run, and then function "two", this time without waiting for the first function saying its complete.

```js
new Perform.parallel(
	function one(control) {
		// processing...
		control.actionCompleted();
	},
	function two(control) {
		// processing...
		control.actionCompleted();
	}
).run(callback);
```


## Actions

When any action is called, it is called in a particular way. First, its _context_ is set to that of the action's parent Perform object. This means anywhere within the main action function, _this_ will be mapped to the Perform object itself.

This object is also passed in as the first parameter, making it easy to simply name an argument in the action's function declaration, and use the reference in any async callbacks you create.

## Callback

When you initiate a run-through of the Perform(ance), using ```.run()```, you can pass in a callback function. Once all actions have been run it will be called - again, with the context set to that of the Perform object. The first parameter passed in will be an _error_ object, if applicable. And the second object will, again, be the Perform object itself.

## Methods

The Perform object has a number of useful methods you can use to control and manipulate the flow of the Perform run-through.

- `.actionComplete()` is used to notify the Perform object that the current action has been completed. If the Perform is serial, and there are more actions to be run, the next one in the queue will be called immediately. If any actions have been added using the `.add(actions)` method, the first one added will be called. Once all queued actions have been run, the Perform run-through will end, and the callback will be triggered.
- `.run([callback]) is used to start the Perform going. You can optionally pass in a callback function which will be triggered when all execution has completed, or the `.end` method has been called to stop execution.
- `.add(actions)` can be used to add any number of actions to the queue. They will be added in-line, so that if you add actions from within another action, those added actions will be executed next, before anything else. Pass in as many actions as you want as parameters, and they will all be added in order.
- `.end(error)` can be used to prematurely end the execution of the Perform. You can also pass in an _error_ object if you so wish. This call will also travel up the tree and short-circuit any parent Perform objects that are running. And finally, the callback is triggered.

## Nesting

You can nest `Parallel` objects within each other as actions, too. Say you want to read multiple files at once, and then do something with the data for individual file's data. You could do soemthing like the following:

```js
var byteCount = 0;

new Perform.parallel(
	new Perform(
		function one(control) {
			read("file_one.txt", function callback_one(error, data) {
				if (error) { return control.end(error); }
				byteCount += data.length;
				control.data = data;

				control.actionComplete();
			});
		},
		function one_copy(control) {
			write("file_one_copy.txt", function callback_one_copy(error) {
				control.actionComplete();
			});
		}
	),
	new Perform(
		function two(control) {
			read("file_two.txt", function callback_two(error, data) {
				if (error) { return control.end(error); }
				byteCount += data.length;
				control.data = data;

				control.actionComplete();
			});
		},
		function two_copy(control) {
			write("file_two_copy.txt", function callback_two_copy(error) {
				control.actionComplete();
			});
		}
	)
).run(function callback(error) {
	if (error) { console.log(error.message); }
	else {
		console.log("file_one.txt and file_two.txt contain " + byteCount + " bytes");
	}
});
```

The example above is pretty contrived, but you can see how nesting of Perform objects can quickly give your code the structure you need in a complex asynchronous application.

## Testing

To run the tests, you can either open "index.html" in your browser, or use node to run "test.js".

I do this by using a simple, naive, hacked-together "require" replacement I wrote to patch the browser. I may release it as its own project at some point, but that would mean making it work under strenuous tests which I cannot presently be bothered to figure out...

## TODO
- All child Perform objects should be stopped when `.end`ing.
- Add comments to the source and tests
