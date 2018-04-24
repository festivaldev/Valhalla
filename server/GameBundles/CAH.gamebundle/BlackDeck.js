var config = require("../../ServerConfig.json"),
	BlackCard = require("./BlackCard"),
	sqlite3 = require("sqlite3");

var shuffle = function(a) {
	for (var i = a.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var t = a[i];
		a[i] = a[j];
		a[j] = t;
	}

	return a;
}

var BlackDeck = function(sets) {
	var blackDeck = this;

	var deck = [],
		discard = [],
		hasFinishedLoading = false;
	
	var init = function() {
		var db = new sqlite3.Database(__dirname + "/../../../cards.db");

		db.serialize(function() {
			db.all("SELECT * FROM calls ORDER BY createdOn ASC", function (err, all) {
				all.forEach(function (row, index) {
					if (sets.indexOf(row.deckId) != -1) {
						var card = new BlackCard(row.id, row.text, row.deckId, false);
						deck.push(card);
					}
				});

				deck = shuffle(deck);
				hasFinishedLoading = true;
			});
		});
	}

	blackDeck.getDeck = function() {
		return deck;
	}

	blackDeck.getNextCard = function() {
		if (!deck.length) {
			return null;
		}

		var card = deck.splice(deck.length-1, 1)[0];
		return card;
	}

	blackDeck.getPossibleNextCards = function() {
		if (!deck.length) {
			return null;
		}

		var cards = [],
			numberOfBlackCardsToShow = Math.min(config.gameBundles.CAH.numberOfBlackCardsToShow, 4);
		for (var i=0; i<numberOfBlackCardsToShow; i++) {
			cards.push(blackDeck.getNextCard());
		}

		var blankBlackCard = new BlackCard("blank-black", "_", "0", true);
		cards.push(blankBlackCard);

		return cards;
	}

	blackDeck.reshuffleUnusedCard = function(card) {
		deck.push(card);
		deck = shuffle(deck);
	}

	blackDeck.discard = function(card) {
		if (card) {
			discard.push(card);
		}
	}

	blackDeck.reshuffle = function() {
		var cards = shuffle(discard);
		for (var i = 0; i < cards.length; i++) {
			deck.push(cards.splice(i, 1));
		}

		discard = [];
	}

	blackDeck.totalCount = function() {
		return (deck.length + discard.length);
	}

	blackDeck.hasFinishedLoading = function () {
		return hasFinishedLoading;
	}

	init();
}

module.exports = BlackDeck;