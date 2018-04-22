var config = require("../ServerConfig.json"),
	log = require("../log");

var ConnectedUsers = function () {
	var connectedUsers = this;
	var users = {};

	var kServerMaxUsers = config.server.maxUsers;

	connectedUsers.hasUser = function (socketID) {
		return users[socketID] != null;
	}

	connectedUsers.getUser = function (socketID) {
		return users[socketID];
	}

	connectedUsers.addUser = function (user) {
		if (this.hasUser(user.getSocketID())) {
			// User already exists
			return false;
		} else if (Object.keys(users).length >= kServerMaxUsers && !user.isAdmin()) {
			// Server has reached max capacity, user is not admin
			return false;
		} else {
			// User is allowed to enter server
			log.info(String.format("User {0} connected (admin={1})", user.toString(), user.isAdmin()));
			users[user.getSocketID()] = user;

			return true;
		}
	}

	connectedUsers.removeUser = function(socketID) {
		if (this.hasUser(socketID)) {
			users[socketID].noLongerValid();
			delete users[socketID];
		}
	}

	connectedUsers.length = function() {
		return Object.keys(users).length;
	}
}

module.exports = ConnectedUsers;