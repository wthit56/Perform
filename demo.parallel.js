var Perform = require("./index.js");

var start = new Date();

new Perform.parallel(
	function one() {
		var control = this;
		console.log("first action begins");
		setTimeout(function () {
			console.log("first action complete");
			control.actionComplete();
		}, 500);
	},
	function two() {
		var control = this;
		console.log("second action begins");
		setTimeout(function () {
			console.log("second action complete");
			control.actionComplete();
		}, 500);
	}
).run(function callback(error) {
	if (error) { throw error; }
	console.log("complete in " + (new Date() - start) + "ms");
});
