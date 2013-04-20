if (!window.XMLHttpRequest) {
	window.XMLHttpRequest = (function () {
		if (ActiveXObject) {
			var names = ["Msxml2.XMLHTTP", "Msxml3.XMLHTTP", "Microsoft.XMLHTTP"];
			for (var i = 0, l = names.length; i < l; i++) {
				try {
					new ActiveXObject(names[i]);
					return function () { return new ActiveXObject(names[i]); };
				}
				catch (error) {
					continue;
				}
			}
		}

		throw new Error("Browser does not support XMLHttpRequest, or equivalents.");
	})();
}

var require = (function () {
	return function require(filepath) {
		var data = "";

		var xhr = new XMLHttpRequest();
		xhr.onload = function () {
			data = xhr.response;
		};
		xhr.open("GET", filepath, false);
		xhr.send();

		return new Function("var module = { exports: { } };\n\n" + data + ";\n\nreturn module.exports")();
	};
})();
