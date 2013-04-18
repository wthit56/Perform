# Perform

When working with asynchronous calls, creating and maintaining the flow of logic through these calls can be very tricky. Perform provides a simple, straightforward and easy to understand way to implement any kinds of complex logic patterns.

```js
new Perform(
	function first(){
		// this === parent Perform object
		this.actionComplete();
		// this will trigger the next action
	},
	function second(){
		var control = this;

		setTimeout(function(){
			control.actionComplete();
			// using a reference to the Perform object,
			// .actionComplete can be called from within any async callbacks
		}, 100);
	}
);
```
