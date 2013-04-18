var Perform = require("./index.js");

new Perform(function () {
	this.end(new Error("error"));
}).run(function (error) {
	if (error) {
		console.log("error recieved");
		throw error;
	}
});
