var config = require("../../ServerConfig.json"),
	WhiteCard = require("./WhiteCard"),
	sqlite3 = require("sqlite3");

var shuffle = function (a) {
	for (var i = a.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var t = a[i];
		a[i] = a[j];
		a[j] = t;
	}
}

var WhiteDeck = function (sets, blanksInDeck) {
	var whiteDeck = this;

	var deck = [],
		discard = [],
		lastBlankCard = -1,
		hasFinishedLoading = false;

	var init = function () {
		for (var i = 0; i < blanksInDeck; i++) {
			var card = new WhiteCard("blank", "<span class=\"spacer\"></span>", null, true);
			deck.push(card);
		}

		var db = new sqlite3.Database(__dirname + "/../../../cards.db");
		db.serialize(function () {
			db.all("SELECT * FROM responses ORDER BY createdOn ASC", function(err, all) {
				all.forEach(function (row, index) {
					if (sets.indexOf(row.deckId) != -1) {
						var card = new WhiteCard(row.id, row.text, row.deckId, false);
						deck.push(card);
					}
				});

				shuffle(deck);
				hasFinishedLoading = true;
			})
		});
	}

	whiteDeck.getDeck = function () {
		return deck;
	}

	whiteDeck.getNextCard = function () {
		if (!deck.length) {
			return null;
		}

		var card = deck.splice(deck.length - 1, 1)[0];
		return card;
	}

	whiteDeck.discard = function (card) {
		if (card) {
			discard.push(card);
		}
	}

	whiteDeck.reshuffle = function () {
		var cards = shuffle(discard);
		for (var i=0; i<cards.length; i++) {
			deck.push(cards.splice(i, 1));
		}

		discard = [];
	}

	whiteDeck.totalCount = function () {
		return (deck.length + discard.length);
	}

	whiteDeck.hasFinishedLoading = function() {
		return hasFinishedLoading;
	}

	init();
}

module.exports = WhiteDeck;