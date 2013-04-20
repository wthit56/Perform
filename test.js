var Perform = require("./index.js");

function timeCheck(name, ms, errorExpected) {
	var errorFound = false;
	return function (error) {
		if (error) {
			if (errorExpected) { errorFound = true; }
			else {
				console.error(name + " - Error received: " + error.message, error);
			}
		}

		var test = new Date() - start;
		if ((test < ms) || (test > ms + 249)) {
			console.error(name + " - should have taken " + ms + "ms, but took " + test + "ms");
			return;
		}

		if (errorExpected && !errorFound) {
			console.error(name + " - should have errored.");
			return;
		}

		if (this.actions.length != this.actionsOriginal.length) {
			console.error(name + " - should have reset actions to length of " + this.actionsOriginal.length + ", but actions are length of " + this.actions.length);
			return;
		}

		console.log(name + " - passed");
	};
}

var start = new Date();

new Perform(
	function one(control) {
		setTimeout(function () {
			control.actionComplete();
		}, 500);
	},
	function two(control) {
		setTimeout(function () {
			control.actionComplete();
		}, 500);
	}
).run(timeCheck("Serial", 1000));

new Perform.parallel(
	function one(control) {
		setTimeout(function () {
			control.actionComplete();
		}, 500);
	},
	function two(control) {
		setTimeout(function () {
			control.actionComplete();
		}, 500);
	}
).run(timeCheck("Parallel", 500));

new Perform.serial(
	function one(control) {
		setTimeout(function () {
			control.actionComplete();
		}, 500);
	},
	function two(control) {
		setTimeout(function () {
			control.actionComplete();
		}, 500);
	}
).run(timeCheck("Explicit Serial", 1000));


new Perform.parallel(
	function one(control) {
		setTimeout(function () { control.actionComplete(); }, 500);
	},
	new Perform(
		function two_one(control) {
			setTimeout(function () { control.actionComplete(); }, 250);
		},
		function two_two(control) {
			setTimeout(function () { control.actionComplete(); }, 250);
		}
	)
).run(timeCheck("Parallel, Nested Serial", 500));

new Perform.parallel(
	function one(control) {
		setTimeout(function () { control.actionComplete(); }, 500);
	},
	new Perform.parallel(
		function two_one(control) {
			setTimeout(function () { control.actionComplete(); }, 250);
		},
		function two_two(control) {
			setTimeout(function () { control.actionComplete(); }, 250);
		}
	)
).run(timeCheck("Parallel, Nested Parallel", 500));

new Perform(
	function one(control) {
		setTimeout(function () { control.actionComplete(); }, 500);
	},
	new Perform.parallel(
		function two_one(control) {
			setTimeout(function () { control.actionComplete(); }, 250);
		},
		function two_two(control) {
			setTimeout(function () { control.actionComplete(); }, 250);
		}
	)
).run(timeCheck("Serial, Nested Parallel", 750));

new Perform(
	function one(control) {
		setTimeout(function () { control.actionComplete(); }, 500);
	},
	new Perform(
		function two_one(control) {
			setTimeout(function () { control.actionComplete(); }, 250);
		},
		function two_two(control) {
			setTimeout(function () { control.actionComplete(); }, 250);
		}
	)
).run(timeCheck("Serial, Nested Serial", 1000));

new Perform(
	function one(control) {
		setTimeout(function () { control.end(new Error("Ended in action 1.")); }, 500);
	},
	function two(control) {
		setTimeout(function () { control.actionComplete(); }, 250);
	}
).run(timeCheck("End", 500, true));

new Perform(
	new Perform(
		function one_one(control) {
			setTimeout(function () { control.actionComplete(); }, 250);
		},
		function one_two(control) {
			setTimeout(function () { control.end(new Error("Ended in action 1.2.")); }, 250);
		}
	),
	function two(control) {
		setTimeout(function () { control.actionComplete(); }, 250);
	}
).run(timeCheck("Nested End", 500, true));

new Perform(
	function one(control) {
		setTimeout(function () {
			control.add(function one_two(control) {
				setTimeout(function () { control.actionComplete(); }, 500);
			});

			control.actionComplete();
		}, 500);
	}
).run(timeCheck("Add Action", 1000));

