var Player = require("./Player"),
	GameOptions = require("./GameOptions"),
	log = require("../log");

var Game = function (_gameBundle, _id, _connectedUsers, _gameManager) {
	var game = this;

	var gameBundle = _gameBundle,
		id = _id,
		connectedUsers = _connectedUsers,
		gameManager = _gameManager,
		options = new GameOptions(gameBundle);

	var players = [],
		host = null;

	game.gameBundle = new loadedGameBundles[gameBundle]();
	game.gameBundle.setGame(game);


	game.getID = function () {
		return id;
	}

	game.getOptions = function(includePassword) {
		return options.serialize(includePassword);
	}

	game.getHost = function () {
		return host;
	}

	game.getUsers = function () {
		return playersToUsers();
	}

	var playersToUsers = function () {
		var users = [];
		for (var i = 0; i < players.length; i++) {
			users.push(players[i].getUser());
		}

		return users;
	}

	game.getPlayerNames = function () {
		var usernames = [];
		for (var i = 0; i < players.length; i++) {
			usernames.push(players[i].getUser().getUsername());
		}

		return usernames;
	}

	game.getPlayers = function () {
		return players;
	}

	game.getPlayerForUser = function (user) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].getUser() == user) {
				return players[i];
			}
		}
		return null;
	}

	game.getInfo = function (includePassword) {
		if (!host) {
			return null;
		}

		var info = {
			id: id,
			host: host.getUser().getUsername(),
			//state: game.gameBundle.gameLogicModule.state,
			gameBundle: game.gameBundle.clientInfo(),
			//gameOptions: options.serialize(includePassword),
			//hasPassword: options.password != null && options.password != ""
		};

		var playerNames = [];
		for (var i = 0; i < players.length; i++) {
			playerNames.push(players[i].getUser().getUsername());
		}
		info.players = playerNames;

		return info;
	}

	game.getAllPlayerInfo = function () {
		var info = [];
		for (var i = 0; i < players.length; i++) {
			var playerInfo = game.getPlayerInfo(players[i]);
			info.push(playerInfo);
		}

		return info;
	}

	game.getPlayerInfo = function (player) {
		if (player == null) {
			return {};
		}

		var playerInfo = {
			name: player.getUser().getUsername(),
			id: player.getUser().getSocketId(),
			score: player.getScore(),
			status: game.gameBundle.gameLogicModule.getPlayerStatus(player)
		};

		return playerInfo;
	}



	game.addPlayer = function (user) {
		// if (players.length >= gameOptions.maxPlayers) {
		// 	return;
		// }

		user.joinGame(game);

		var player = new Player(user);
		players.push(player);

		if (!host) {
			host = player;
		}

		io.to(user.getSocketId()).emit("_receivePackage", { type: "joinedGame", data: { gameId: id, gameInfo: game.getInfo(false) } });
		/// TODO: Broadcast game list update
	}

	game.removePlayer = function (user) {
		var player = game.getPlayerForUser(user);

		if (player) {
			log.info(String.format("Removing {0} from game {1}", user.toString(), id));
			players.splice(players.indexOf(player), 1);
			user.leaveGame(game);

			if (host == player) {
				if (players.length) {
					host = players[0];
				} else {
					host = null;
				}
			}

			if (players.length) {
				// TODO: player stuff
			} else {
				gameManager.destroyGame(id);
			}
		}
	}

	game.setGameSettings = function (gameOptions) {
		options = new GameOptions(gameBundle).deserialize(gameOptions);
	}
}

module.exports = Game;