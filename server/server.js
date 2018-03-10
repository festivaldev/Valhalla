String.format = function (format) {
	var args = Array.prototype.slice.call(arguments, 1);
	return format.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
};

var isShuttingDown = false;

var app = require("express")(),
	http = require("http").Server(app),
	io = require("socket.io")(http),
	readline = require("readline").createInterface(process.stdin, process.stdout),
	log = require("./log.js");

readline.on('SIGINT', function() {
	isShuttingDown = true;
	log.info(String.format("Closing {0} connection(s)...", Object.keys(io.sockets.sockets).length));
	for (var s in io.sockets.sockets) {
		io.sockets.sockets[s].disconnect(true);
	}

	log.warn("Stopping (received SIGINT)");
	process.exit();
});

io.on("connection", function(socket){
	log.info("User connected");
	
	socket.on("disconnect", function() {
		if (!isShuttingDown) {
			log.info("User disconnected");
		}
	});
});

http.listen(3000, function(){
	log.info("Listening on *:3000");
});