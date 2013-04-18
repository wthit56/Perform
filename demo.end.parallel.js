var Perform = require("./index.js");

var start = new Date();

new Perform.parallel(
	function one() {
		var control = this;
		console.log("action 1 begins");
		setTimeout(function () {
			control.add(function () {
				console.log("action 1.1 begins");
				setTimeout(function () {
					console.log("action 1.1 complete");
					control.actionComplete();
				}, 250);
			});
			
			console.log("first action complete");

			control.end();
			control.actionComplete();
		}, 500);
	},
	function two() {
		console.log("action 2 begins");
	}
).run(function callback(error) {
	if (error) { throw error; }
	console.log("complete in " + (new Date() - start) + "ms");
});
