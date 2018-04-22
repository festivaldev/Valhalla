var log = require("../log");

var User = function (_username, _socketID, _isAdmin) {
	var user = this;

	var username = _username,
		currentGame = null,
		socketID = _socketID,
		isAdmin = _isAdmin;

	user.isAdmin = function () {
		return isAdmin;
	}
	user.getUsername = function () {
		return username;
	}
	user.getSocketID = function () {
		return socketID;
	}
	user.toString = function () {
		return user.getUsername();
	}

	user.noLongerValid = function() {
		if (currentGame) {
			currentGame.removePlayer(user);
		}
	}

	user.getGame = function () {
		return currentGame;
	}
	user.joinGame = function (game) {
		if (currentGame) {
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