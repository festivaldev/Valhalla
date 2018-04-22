/**
 * Sets the process title
 */
process.title = "Valhalla";

/**
 * Adds a C#-like string format method to JavaScript
 * 
 * @param {any} format An array including the string to be formatted and strings to be inserted
 * @returns A formatted string
 */
String.format = function (format) {
	var args = Array.prototype.slice.call(arguments, 1);
	return format.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] != "undefined" ? args[number] : match;
	});
};

/**
 * Determines if Node.js is currently in the process of shutting down
 */
global.isShuttingDown = false;

/**
 * Important NPM includes, and the currently used server port
 */
var app = require("express")(),
	http = require("http").Server(app),
	io = require("socket.io")(http),
	readline = require("readline").createInterface(process.stdin, process.stdout),
	fs = require("fs"),
	path = require("path"),
	log = require("./log"),
	seedrandom = require("seedrandom"),
	sqlite3 = require("sqlite3"),
	serverPort = 8080;

seedrandom((new Date()).getTime(), { global: true });

global.app = app;
global.io = io;

app.use(function (request, response, next) {
	response.header("Access-Control-Allow-Origin", "*");
	next();
});

/**
 * Load game bundles
 */
global.loadedGameBundles = {};
var gameBundlePath = path.join(__dirname, "GameBundles");

var gameScripts = "";

fs.readdirSync(gameBundlePath).forEach(function(file) {
	if (path.extname(file) == ".gamebundle") {
		var bundle = require("./GameBundles/" + file);
		loadedGameBundles[(new bundle()).clientInfo().clientDir] = bundle;

		fs.readFile("./GameBundles/" + file + "/client/client.js", "utf8", function(error, content) {
			gameScripts += content + "\n\n";
		});

		log.info(String.format("Loading {0}", file));
	}
});

/**
 * Valhalla components
 */
var Server = require("./Classes/Server"),
	ConnectedUsers = require("./Classes/ConnectedUsers"),
	GameManager = require("./Classes/GameManager"),
	User = require("./Classes/User.js"),
	API = require("./api"),
	Broadcaster = require("./Classes/Broadcaster");

global.server = new Server(new ConnectedUsers(), new GameManager());
global.Broadcaster = Broadcaster;

/**
 * Handler for receiving SIGINT (^C)
 */
readline.on("SIGINT", function() {
	isShuttingDown = true;
	log.info(String.format("Closing {0} connection(s)...", Object.keys(io.sockets.sockets).length));
	for (var s in io.sockets.sockets) {
		io.sockets.sockets[s].disconnect(true);
	}

	log.info("Stopping (received SIGINT)");
	process.exit();
});

/**
 * Handler for processing uncaught exceptions
 * Only intended for development purposes
 */
process.on("uncaughtException", function (error) {
	log.error(error.message);
	console.log(error);
});

/**
 * Handle incoming Socket.IO connections
 */
io.on("connection", function(socket) {
	var isAdmin = false;
	var convertedIp = socket.request.connection.remoteAddress.replace(/:*(.*?):/g, "");
	if (convertedIp == "1" || convertedIp == "127.0.0.1") {
		isAdmin = true;
	}

	var user = new User(socket.handshake.query.username, socket.id, isAdmin);
	server.connectedUsers().addUser(user);
	
	socket.on("disconnect", function() {
		var user = server.connectedUsers().getUser(socket.id);
		server.connectedUsers().removeUser(socket.id);
		if (!isShuttingDown) {
			log.info(String.format("User {0} disconnected", user.toString()));
		}
	});

	socket.on("_sendPackage", function(data) {
		var user = server.connectedUsers().getUser(socket.id);

		if (user) {
			switch (data.type) {
				case "ping":
					io.to(socket.id).emit("_receivePackage", { type: "pong" });
					break;
				case "createGame":
					server.gameManager().createGameWithPlayer(data.data.gameBundle, data.data.gameOptions, user);
					break;
				case "joinGame":
					server.gameManager().getGameByID(data.data.gameID).addPlayer(user, data.data.password);
					break;
				case "leaveGame":
					break;
				case "startGame":
					user.getGame().gameBundle.gameLogic.start();
					break;
				default: break;
			}
		}
	})
});

/**
 * API Handlers
 */

app.get("/gameScripts.js", function(req, res) {
	res.setHeader('Content-Type', 'application/javascript');
	res.send(gameScripts);
})

app.get("/gameBundles", function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(API.getAvailableGameBundles(), null, 4));
});

app.get("/gameList", function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(API.getGameList(), null, 4));
});

/**
 * Initialize the webserver
 * Might use this one to serve game scripts to the client
 */
http.listen(serverPort, function(){
	log.info(String.format("Server listening on *:{0}", serverPort));
});