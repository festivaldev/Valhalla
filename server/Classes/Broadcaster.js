var Broadcaster = {
	updateGameList: function() {
		var games = server.gameManager().getGames();

		var gameList = [];
		for (var gameID in games) {
			var game = games[gameID];

			gameList.push({
				gameID: game.getID(),
				gameName: game.getHost().getUser().getUsername(),
				gameMode: game.gameBundle.clientInfo().displayName,
				hostID: game.getHost().getUser().getSocketID(),
				playerCount: game.getPlayers().length,
				maxPlayers: game.getOptions(false).playerLimit,
				passworded: game.getOptions(true).password != null && game.getOptions(true).password.length
			});
		}

		var bundles = {};
		for (var bundle in loadedGameBundles) {
			bundles[bundle] = (new loadedGameBundles[bundle]()).clientInfo();
		}

		io.sockets.emit("_receivePackage", {
			type: "updateGameList",
			data: {
				gameList: gameList,
				bundles: bundles
			}
		})
	},

	gameStateChanged: function(players, data) {
		players.forEach(function(player, index) {
			io.to(player.getUser().getSocketID()).emit("_receivePackage", {
				type: "gameEvent",
				eventType: "gameStateChanged",
				data: data
			})
		});
	},

	playerInfoChanged: function(game, usersInGame) {
		players.forEach(function(player, index) {
			io.to(player.getUser().getSocketID()).emit("_receivePackage", {
				type: "playerInfoChanged",
				data: {
					playerInfo: game.getAllPlayerInfo()
				}
			})
		})
	},

	roundOver: function(game, playersInGame, cardPlayer, clientCardID, possibleBlackCards) {
		playersInGame.forEach(function(player, index) {
			if (clientCardID === "blank") {
				clientCardID += "-" + cardPlayer.getUser().getUsername();
			}

			io.to(player.getUser().getSocketID()).emit("_receivePackage", {
				type: "gameEvent",
				eventType: "roundOver",
				data: {
					roundWinner: cardPlayer.getUser().getUsername(),
					roundWinnerID: cardPlayer.getUser().getSocketID(),
					winningCard: clientCardID,
					playerInfo: game.getAllPlayerInfo(),
					possibleBlackCards: possibleBlackCards
				}
			})
		})
	}
}

module.exports = Broadcaster;