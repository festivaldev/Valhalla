var api = {
	getAvailableGameBundles: function() {
		var bundles = {};
		for (var bundle in loadedGameBundles) {
			bundles[bundle] = (new loadedGameBundles[bundle]()).clientInfo();
		}
		return bundles;
	},
	getGameList: function() {
		var games = server.gameManager().getGames();

		var gameList = [];
		for (var gameID in games) {
			var game = games[gameID];

			gameList.push({
				gameID: game.getID(),
				gameName: game.getHost().getUser().getUsername(),
				gameMode: game.gameBundle.clientInfo().displayName,
				playerCount: game.getPlayers().length,
				maxPlayers: game.getOptions(false).playerLimit
			})
		}

		return gameList;
		/*return [{
			gameId: 678423,
			gameName: "Test",
			gameMode: "Cards Against Humanity",
			playerCount: 4,
			maxPlayers: 10,
		}, {
			gameId: 678423,
			gameName: "Test",
			gameMode: "Cards Against Humanity",
			playerCount: 4,
			maxPlayers: 10,
		}, {
			gameId: 678423,
			gameName: "Test",
			gameMode: "Cards Against Humanity",
			playerCount: 4,
			maxPlayers: 10,
		}, {
			gameId: 678423,
			gameName: "Test",
			gameMode: "Cards Against Humanity",
			playerCount: 4,
			maxPlayers: 10,
		}, {
			gameId: 678423,
			gameName: "Test",
			gameMode: "Cards Against Humanity",
			playerCount: 4,
			maxPlayers: 10,
		}, {
			gameId: 678423,
			gameName: "Test",
			gameMode: "Cards Against Humanity",
			playerCount: 4,
			maxPlayers: 10,
		}, {
			gameId: 678423,
			gameName: "Test",
			gameMode: "Cards Against Humanity",
			playerCount: 4,
			maxPlayers: 10,
		}, {
			gameId: 678423,
			gameName: "Test",
			gameMode: "Cards Against Humanity",
			playerCount: 4,
			maxPlayers: 10,
		}, {
			gameId: 678423,
			gameName: "Test",
			gameMode: "Cards Against Humanity",
			playerCount: 4,
			maxPlayers: 10,
		}, {
			gameId: 678423,
			gameName: "Test",
			gameMode: "Cards Against Humanity",
			playerCount: 4,
			maxPlayers: 10,
		}, {
			gameId: 678423,
			gameName: "Test",
			gameMode: "Cards Against Humanity",
			playerCount: 4,
			maxPlayers: 10,
		}, {
			gameId: 678423,
			gameName: "Test",
			gameMode: "Cards Against Humanity",
			playerCount: 4,
			maxPlayers: 10,
		}]*/
	}
}

module.exports = api;