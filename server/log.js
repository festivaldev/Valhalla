var path = require('path');

module.exports = {
	/**
	 * Logs information to the console, containing time, process name and PID
	 *
	 * @param text The text to be written into stdout 
	 */
	info: function(text) {
		var date = new Date();
		console.log("[INFO] %s.%d %s(%d) %s", date.toLocaleTimeString(), date.getMilliseconds(), process.title, process.pid, text);
	},

	/**
	 * Logs warnings to the console, containing time, process name and PID
	 *
	 * @param text The text to be written into stdout 
	 */
	warn: function(text) {
		var date = new Date();
		console.log("[WARNING] %s.%d %s(%d) %s", date.toLocaleTimeString(), date.getMilliseconds(), process.title, process.pid, text);
	},

	/**
	 * Logs errors to the console, containing time, process name and PID
	 *
	 * @param text The text to be written into stdout 
	 */
	error: function (text) {
		var date = new Date();
		console.log("[ERROR] %s.%d %s(%d) %s", date.toLocaleTimeString(), date.getMilliseconds(), process.title, process.pid, text);
	},
}