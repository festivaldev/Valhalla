var config = require("../ServerConfig.json"),
	log = require("../log");

var ConnectedUsers = function () {
	var connectedUsers = this;
	var users = {};

	var kServerMaxPlayers = config.server.maxPlayers;

	connectedUsers.hasUser = function (socketId) {
		return users[socketId] != null;
	}

	connectedUsers.getUser = function (socketId) {
		return users[socketId];
	}

	connectedUsers.addUser = function (user) {
		if (this.hasUser(user.getSocketId())) {
			// User already exists
			return false;
		} else if (Object.keys(users).length >= kServerMaxPlayers && !user.isAdmin()) {
			// Server has reached max capacity, user is not admin
			return false;
		} else {
			// User is allowed to enter server
			log.info(String.format("User {0} connected (admin={1})", user.toString(), user.isAdmin()));
			users[user.getSocketId()] = user;

			return true;
		}
	}
}

module.exports = ConnectedUsers;