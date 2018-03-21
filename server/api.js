var api = {
	getAvailableGameBundles: function() {
		var bundles = [];
		for (var bundle in loadedGameBundles) {
			bundles.push((new loadedGameBundles[bundle]()).clientInfo());
		}
		return bundles;
	},
	getGameList: function() {
		return [{
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
		}]
	}
}

module.exports = api;