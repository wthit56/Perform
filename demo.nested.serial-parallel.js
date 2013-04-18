var Perform = require("./index.js");

var start = new Date();

new Perform(
	function one() {
		var control = this;
		console.log("action 1 begins");
		setTimeout(function () {
			console.log("action 1 complete");
			control.actionComplete();
		}, 500);
	},
	new Perform.parallel(
		function two_one() {
			var control = this;
			console.log("action 2.1 begins");
			setTimeout(function () {
				console.log("action 2.1 complete");
				control.actionComplete();
			}, 250);
		},
		function two_two() {
			var control = this;
			console.log("action 2.2 begins");
			setTimeout(function () {
				console.log("action 2.2 complete");
				control.actionComplete();
			}, 250);
		}
	),
	function three() {
		var control = this;
		console.log("action 3 begins");
		setTimeout(function () {
			console.log("action 3 complete");
			control.actionComplete();
		}, 500);
	}
).run(function callback(error) {
	if (error) { throw error; }
	console.log("complete in " + (new Date() - start) + "ms");
});
