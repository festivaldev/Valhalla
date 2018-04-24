var config = require("../../ServerConfig.json"),
	WhiteDeck = require("./WhiteDeck"),
	WhiteCard = require("./WhiteCard"),
	BlackDeck = require("./BlackDeck"),
	BlackCard = require("./BlackCard"),
	PlayedCardsTracker = require("./PlayedCardsTracker"),
	log = require("../../log");

var shuffle = function (a) {
	for (var i = a.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var t = a[i];
		a[i] = a[j];
		a[j] = t;
	}

	return a;
}

var GameState = {
	LOBBY: 0,
	DEALING: 1,
	PLAYING: 2,
	JUDGING: 3,
	ROUND_OVER: 4
}

var GamePlayerState = {
	HOST: 0,
	IDLE: 1,
	PLAYING: 2,
	JUDGE: 3,
	JUDGING: 4,
	WINNER: 5
}

var GameLogic = function() {
	var gameLogic = this;

	gameLogic.state = GameState.LOBBY;
	gameLogic.game = null;

	var roundPlayers = [],
		judgeIndex = -1,
		blackDeck = null,
		blackCard = null,
		whiteDeck = null,
		playedCards = new PlayedCardsTracker(),
		selectedBlackCard = null,
		rawPossibleBlackCards = [];
	
	var winStateTimeout;

	gameLogic.start = function() {
		if (gameLogic.state != GameState.LOBBY) {
			return;
		}

		var started = false;
		var numPlayers = gameLogic.game.getPlayers().length;

		if (numPlayers >= 3) {
			judgeIndex = Math.floor(Math.random() * numPlayers);
			started = true;
		}

		if (started) {
			log.info(String.format("Starting game {0}", gameLogic.game.getID()));

			var sets = Object.keys(gameLogic.game.getOptions(false, true).raw.sets);
			blackDeck = new BlackDeck(sets);
			whiteDeck = new WhiteDeck(sets, gameLogic.game.getOptions(false, true).raw.blanksInDeck);

			var finishedLoading = false;
			var loadingInterval = setInterval(function() {
				if (blackDeck.hasFinishedLoading() && whiteDeck.hasFinishedLoading()) {
					clearInterval(loadingInterval);

					blackCard = blackDeck.getNextCard();

					startNextRound();
					Broadcaster.updateGameList();
				} else {
					log.warn("White Deck hasn't finished loading!");
				}
			}, 50);
		}
	}

	gameLogic.playerLeft = function(player) {
		var players = gameLogic.game.getPlayers();
		if (players.length < 3 && gameLogic.state != 0) {
			resetState(true);
		}
	}

	/* States */

	var startNextRound = function() {
		var players = gameLogic.game.getPlayers();

		judgeIndex = (judgeIndex + 1) % players.length;

		roundPlayers = [];
		players.forEach(function(player, index) {
			if (player != getJudge()) {
				roundPlayers.push(player);
			}
		});

		dealState();
	}

	var dealState = function() {
		var players = gameLogic.game.getPlayers();
		if (!players.length) {
			return;
		}

		if (whiteDeck.totalCount() < players.length * 10) {
			log.error("NOT ENOUGH CARDS TO START GAME! ABORTING!");
			return;
		}

		gameLogic.state = GameState.DEALING;

		players.forEach(function(player, index) {
			var hand = player.getHand();

			if (hand.length == 0) {
				var card = new WhiteCard(player.getUser().getSocketID(), player.getUser().getUsername(), null, false);
				hand.push(card);
			}

			while (hand.length < 10) {
				var card = whiteDeck.getNextCard();
				hand.push(card);

				sendCardsToPlayer(player, hand);
			}
		});

		playingState();
	}

	var playingState = function() {
		var players = gameLogic.game.getPlayers();
		if (!players.length) {
			return;
		}

		gameLogic.state = GameState.PLAYING;
		playedCards.clear();

		if (selectedBlackCard) {
			blackCard = rawPossibleBlackCards.find((card) => card.getID() === selectedBlackCard.id);
			blackDeck.reshuffleUnusedCard(rawPossibleBlackCards.find((card) => card != blackCard));

			selectedBlackCard = null;
		}

		if (blackCard) {
			blackDeck.discard(blackCard);
		}

		Broadcaster.gameStateChanged(players, {
			blackCard: JSON.stringify(blackCard.clientInfo()),
			gameState: gameLogic.state,
			judge: players[judgeIndex].getUser().getSocketID(),
			gameInfo: gameLogic.game.getInfo(false),
			playerInfo: gameLogic.game.getAllPlayerInfo()
		})
	}

	var judgingState = function() {
		var players = gameLogic.game.getPlayers();
		if (!players.length) {
			return;
		}

		gameLogic.state = GameState.JUDGING;

		var whiteCardsToPlayers = getWhiteCards();
		Broadcaster.gameStateChanged(players, {
			blackCard: JSON.stringify(blackCard.clientInfo()),
			gameState: gameLogic.state,
			judge: players[judgeIndex].getUser().getSocketID(),
			playerInfo: gameLogic.game.getAllPlayerInfo(),
			whiteCards: JSON.stringify(whiteCardsToPlayers)
		})
	}

	var winState = function() {
		resetState(false);
	}

	var resetState = function(lostPlayer) {
		clearTimeout(winStateTimeout);

		var players = gameLogic.game.getPlayers();
		for (var player in players) {
			players[player].setHand([]);
			players[player].resetScore();
		}

		whiteDeck = null;
		blackDeck = null;
		blackCard = null;

		playedCards.clear();
		roundPlayers = [];

		gameLogic.state = GameState.LOBBY;
		var judge = getJudge();
		judgeIndex = 0;

		Broadcaster.gameStateChanged(players, {
			gameState: gameLogic.state
		});

		if (gameLogic.game.getHost() || judge) {
			Broadcaster.playerInfoChanged(gameLogic.game, players);
		}

		Broadcaster.updateGameList();
	}
	gameLogic.resetState = resetState;

	/* Gameplay */

	gameLogic.handleRequest = function(user, data) {
		switch (data.request) {
			case "playCard":
				var card = JSON.parse(data.card);
				playCard(user, card.id, card.text);
				break;
			case "judgeCard":
				var card = JSON.parse(data.card);
				judgeCard(user, card.id);
				break;
			case "setBlackCard":
				var card = JSON.parse(data.card);

				if (card.customText) {
					// TODO: Handle syntax
				} else {
					setBlackCard(user, card)
				}
				break;
			default: break;
		}
	}

	var playCard = function(user, cardID, cardText) {
		var player = gameLogic.game.getPlayerForUser(user);

		if (player) {
			if (getJudge() == player || gameLogic.state != GameState.PLAYING) {
				return;
			}

			var hand = player.getHand();
			var playedCard = null;

			for (var i=0; i<hand.length; i++) {
				var card = hand[i];
				if (card.getID() == cardID) {
					playedCard = card;

					if (playedCard.getID() == "blank") {
						playedCard.setID(String.format("blank-{0}", user.getUsername()));
						playedCard.setText(cardText);
					}

					hand.splice(i, 1);
					break;
				}
			}

			if (playedCard) {
				playedCards.addCard(player, playedCard);
				Broadcaster.playerInfoChanged(gameLogic.game, gameLogic.game.getPlayers());

				var _startJudging = startJudging();
				if (_startJudging) {
					judgingState();
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	var judgeCard = function(user, cardID) {
		var players = gameLogic.game.getPlayers();
		var player = gameLogic.game.getPlayerForUser(user);

		if (getJudge() != player || gameLogic.state != GameState.JUDGING) {
			return;
		}

		var cardPlayer = playedCards.getPlayerForID(cardID);
		if (!cardPlayer) {
			return;
		}
		cardPlayer.increaseScore();

		var clientCardID = playedCards.cardsForPlayer(cardPlayer)[0].getID();
		if (cardPlayer.getScore() < gameLogic.game.getOptions(false).scoreGoal) {
			var possibleBlackCards = [];
			rawPossibleBlackCards = [],

			// TODO: Custom black card
			rawPossibleBlackCards = getPossibleNextBlackCards();
			rawPossibleBlackCards.forEach(function(card, index) {
				possibleBlackCards.push(card.clientInfo());
			});

			Broadcaster.roundOver(gameLogic.game, players, cardPlayer, clientCardID, possibleBlackCards);
		} else {
			Broadcaster.roundOver(gameLogic.game, players, cardPlayer, clientCardID, []);
			winStateTimeout = setTimeout(function() {
				winState();
			}, config.gameBundles.CAH.roundIntermission);
		}
	}

	var setBlackCard = function(user, card) {
		var player = gameLogic.game.getPlayerForUser(user);

		if (getJudge() != player) {
			return;
		}

		if (card.id == "blank-black") {
			blackCard = new BlackCard("blank-black", card.raw, null, true);
		} else {
			selectedBlackCard = card;
		}

		startNextRound();
	}

	/* Get Infos */

	var getJudge = function() {
		var players = gameLogic.game.getPlayers();
		if (0 < judgeIndex < players.length) {
			return players[judgeIndex];
		}

		return null;
	}

	var getNextWhiteCard = function() {
		var players = gameLogic.game.getPlayers();
		try {
			if (whiteDeck && players.length >= 3) {
				return whiteDeck.getNextCard();
			}
		} catch (e) {
			throw e;
		}
	}

	var getPossibleNextBlackCards = function() {
		var players = gameLogic.game.getPlayers();
		try {
			if (blackDeck && players.length >= 3) {
				return blackDeck.getPossibleNextCards();
			}
		} catch (e) {
			throw e;
		}
	}

	var getWhiteCards = function() {
		if (gameLogic.state != GameState.JUDGING) {
			return [];
		} else {
			var shuffledPlayedCards = shuffle(playedCards.cards());
			var cardData = [];

			for (var i = 0; i < shuffledPlayedCards.length; i++) {
				cardData.push(getWhiteCardData(shuffledPlayedCards[i]));
			}

			return cardData;
		}
	}

	var getWhiteCardData = function(cards) {
		var data = [];

		cards.forEach(function(card, index) {
			data.push(card.clientInfo());
		});

		return data;
	}

	var sendCardsToPlayer = function(player, cards) {
		io.to(player.getUser().getSocketID()).emit("_receivePackage", {
			type: "gameEvent",
			eventType: "updateHand",
			data: {
				hand: JSON.stringify(getWhiteCardData(cards))
			}
		})
	}

	gameLogic.getPlayerStatus = function(player) {
		var playerStatus;

		switch (gameLogic.state) {
			case GameState.LOBBY:
				if (gameLogic.game.getHost() == player) {
					playerStatus = GamePlayerState.HOST;
				} else {
					playerStatus = GamePlayerState.IDLE;
				}
				break;
			case GameState.PLAYING:
				if (getJudge() == player) {
					playerStatus = GamePlayerState.JUDGE;
				} else {
					if (roundPlayers.indexOf(player) < 0) {
						playerStatus = GamePlayerState.IDLE;
						break;
					}

					var playerCards = playedCards.cards(player);
					var pick = blackCard.getPick();

					if (playedCards && blackCard && playerCards.length == pick) {
						playerStatus = GamePlayerState.IDLE;
					} else {
						playerStatus = GamePlayerState.PLAYING;
					}
				}
				break;
			case GameState.JUDGING:
				if (getJudge() == player) {
					playerStatus = GamePlayerState.JUDGING;
				} else {
					playerStatus = GamePlayerState.IDLE;
				}
				break;
			case GameState.ROUND_OVER:
				break;
			default: break;
		}

		return playerStatus;
	}

	var startJudging = function() {
		if (gameLogic.state != GameState.PLAYING) {
			return false;
		}

		if (playedCards.size() == roundPlayers.length) {
			var startJudging = true;

			for (var i=0; i<playedCards.size(); i++) {
				if (playedCards.cards()[i].length != blackCard.getPick()) {
					startJudging = false;
					break;
				}
			}

			return startJudging;
		} else {
			return false;
		}
	}
}

module.exports = GameLogic;