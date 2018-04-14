var config = require("../ServerConfig.json"),
	log = require("../log"),
	ConnectedUsers = require("./ConnectedUsers"),
	Game = require("./Game");

var GameManager = function() {
	var gameManager = this;
	var games = {};

	var maxGames = config.server.maxGames;

	var createGame = function(gameBundle) {
		if (Object.keys(games).length >= maxGames) {
			return null;
		}

		var gameID = Math.floor(1E7 + Math.random() * 9E7).toString();
		var game = new Game(gameBundle, gameID, new ConnectedUsers(), gameManager);

		if (game.getID() < 0) {
			return null;
		}

		games[gameID] = game;
		return game;
	}

	gameManager.createGameWithPlayer = function(gameBundle, gameOptions, user) {
		try {
			var game = createGame(gameBundle);
			log.info(String.format("User {0} created new game of type \"{1}\" with ID {2}", user.toString(), gameBundle, game.getID()));

			game.setGameSettings(gameOptions);
			game.addPlayer(user);
		} catch (error) {
			console.log(error);
		}
	}

	gameManager.destroyGame = function(gameID) {
		var game = games[gameID];

		if (!delete games[gameID]) {
			return;
		}

		game.getUsers().forEach(function(user, index) {
			game.removePlayer(user);
		});

		/// TODO: Broadcast game list update
		log.info(String.format("Destroyed game {0}", gameID));
	}

	gameManager.getGameByID = function(gameID) {
		return games[gameID];
	}

	gameManager.getGames = function() {
		return games;
	}
}

module.exports = GameManager;