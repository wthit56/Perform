var Perform = require("./index.js");

var start = new Date();

new Perform(
	new Perform.parallel(
		function one(){
			console.log("action 1");
			this.end();
		},
		function two(){
			console.log("action 2");
			this.actionComplete();
		}
	),
	function three(){
		console.log("action 3");
		this.actionComplete();
	}
).run(function callback(error) {
	if (error) { console.warn("** error: ", error, "**"); }
	else{console.log("complete in " + (new Date() - start) + "ms");}
});
