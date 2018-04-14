var log = require("../log");

var User = function (_username, _socketId, _isAdmin) {
	var user = this;

	var username = _username,
		currentGame = null,
		socketId = _socketId,
		isAdmin = _isAdmin;

	user.isAdmin = function () {
		return isAdmin;
	}
	user.getUsername = function () {
		return username;
	}
	user.getSocketId = function () {
		return socketId;
	}
	user.toString = function () {
		return user.getUsername();
	}

	user.noLongerValid = function() {
		if (currentGame != null) {
			currentGame.removePlayer(user);
		}
	}

	user.getGame = function () {
		return currentGame;
	}
	user.joinGame = function (game) {
		if (currentGame != null) {
			return;
		}

		log.info(String.format("User {0} joined game with id {1}", user.toString(), game.getID()))
		currentGame = game;
	}

	user.leaveGame = function (game) {
		if (currentGame == game) {
			currentGame = null;
		}
	}

	user.getClientInfo = function() {
		return {
			username: username,
			currentGame: null,
			isAdmin: isAdmin
		}
	}

	return user;
}

module.exports = User;