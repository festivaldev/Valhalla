var path = require('path');

module.exports = {
	info: function(text) {
		var date = new Date();
		console.log("[INFO] %s.%d node(%d)    ", date.toLocaleTimeString(), date.getMilliseconds(), process.pid, text);
	},
	warn: function(text) {
		var date = new Date();
		console.log("[WARNING] %s.%d node(%d)    ", date.toLocaleTimeString(), date.getMilliseconds(), process.pid, text);
	},
	error: function (text) {
		var date = new Date();
		console.log("[ERROR] %s.%d node(%d)    ", date.toLocaleTimeString(), date.getMilliseconds(), process.pid, text);
	},
}