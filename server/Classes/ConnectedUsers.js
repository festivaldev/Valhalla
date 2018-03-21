var config = require("../ServerConfig.json"),
	log = require("../log");

var ConnectedUsers = function () {
	var connectedUsers = this;
	var users = {};

	var kServerMaxUsers = config.server.maxUsers;

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
		} else if (Object.keys(users).length >= kServerMaxUsers && !user.isAdmin()) {
			// Server has reached max capacity, user is not admin
			return false;
		} else {
			// User is allowed to enter server
			log.info(String.format("User {0} connected (admin={1})", user.toString(), user.isAdmin()));
			users[user.getSocketId()] = user;

			return true;
		}
	}

	connectedUsers.removeUser = function(socketId) {
		if (this.hasUser(socketId)) {
			delete users[socketId];
		}
	}

	connectedUsers.length = function() {
		return Object.keys(users).length;
	}
}

module.exports = ConnectedUsers;