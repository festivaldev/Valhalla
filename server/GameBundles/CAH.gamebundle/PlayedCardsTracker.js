var PlayedCardsTracker = function() {
	var tracker = this;

	var playerCardMap = {},
		reverseIDMap = {};
	
	tracker.addCard = function(player, card) {
		var cards = playerCardMap[player.getUser().getSocketID()];

		if (!cards) {
			cards = [];
			playerCardMap[player.getUser().getSocketID()] = cards;
		}

		reverseIDMap[card.getID()] = player;
		cards.push(card);
	}

	tracker.getPlayerForID = function(id) {
		return reverseIDMap[id];
	}

	tracker.hasPlayer = function(player) {
		return playerCardMap[player.getUser().getSocketID()] != null;
	}

	tracker.getCardsForPlayer = function() {
		return playerCardMap[player.getUser().getSocketID()];
	}

	tracker.removePlayer = function(player) {
		var cards = playerCardMap[player.getUser().getSocketID()];

		for (var card in cards) {
			delete reverseIDMap[cards[card].getID()];
		}
		delete playerCardMap[player.getUser().getSocketID()];

		return playerCardMap;
	}

	tracker.size = function() {
		return Object.keys(playerCardMap).length;
	}

	tracker.playedPlayers = function() {
		return Object.keys(playerCardMap);
	}

	tracker.clear = function() {
		playerCardMap = {};
		reverseIDMap = {};
	}

	tracker.cards = function() {
		return tracker.getMapValues(playerCardMap);
	}

	tracker.getMapValues = function(map) {
		return Object.keys(map).map(function(key) {
			return map[key];
		})
	}
}

module.exports = PlayedCardsTracker;