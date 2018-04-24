/**
 * The script served to clients containing clientside game logic
 * Scripts are always added to the gameScripts object in Angular's $rootScope
 * @author Sniper_GER
 * @version 1.0
 */

/*(function() {
	var $injector = angular.element(document).injector();
	var $rootScope = $injector.get("$rootScope");
	var $http = $injector.get("$http");

	$rootScope.gameScripts["cah"] = {
		startGame: function () {
			socket.emit("_sendPackage", { type: "startGame" })
		},
		handleGameEvent: function (data) {
			console.log(data);
		},
		setupData: {
			cardSets: null
		},
		defaultOptions: {
			playerLimit: 10,
			scoreGoal: 8,
			blanksInDeck: 0
		}
	};

	$http.get($rootScope.hostname + "/cah/cardSets").then(function (response) {
		$rootScope.gameScripts["cah"].setupData.cardSets = response.data;
	});
})()*/

(function () {
	//console.log('Hello World!');

	var $injector = angular.element(document).injector();
	var $rootScope = $injector.get("$rootScope");
	var $http = $injector.get("$http");
	var $sce = $injector.get("$sce");

	$rootScope.gameScripts["cah"] = {
		setupData: {
			cardSets: null
		},
		defaultOptions: {
			playerLimit: 10,
			scoreGoal: 8,
			blanksInDeck: 0
		},

		startGame: function () {
			socket.emit("_sendPackage", { type: "startGame" })
		},

		stopGame: function() {
			throw new Error("Not Implemented");
		},

		leaveGame: function() {},

		handleGameEvent: function (data) {
			console.log(data);
			switch (data.eventType) {
				case "gameStateChanged":
					if ($rootScope.currentGame) {
						$rootScope.$apply(function () {
							$rootScope.currentGame.state = data.data.gameState;

							if (data.data.blackCard) {
								$rootScope.currentGame.blackCard = JSON.parse(data.data.blackCard);
								$rootScope.currentGame.blackCards = [];
							}

							if (data.data.whiteCards) {
								$rootScope.currentGame.whiteCards = JSON.parse(data.data.whiteCards);
							}

							if (data.data.judge) {
								$rootScope.currentGame.judge = data.data.judge;
							}

							if (data.data.playerInfo) {
								$rootScope.currentGame.playerInfo = data.data.playerInfo;
							}

							$rootScope.currentGame.playedCards = [];
						})
					}
					break;
				case "updateHand":
					if ($rootScope.currentGame) {
						$rootScope.$apply(function () {
							$rootScope.currentGame.hand = JSON.parse(data.data.hand);
						});
					}
					break;
				case "roundOver":
					if ($rootScope.currentGame) {
						$rootScope.$apply(function () {
							$rootScope.currentGame.playerInfo = data.data.playerInfo;
							$rootScope.currentGame.roundWinner = data.data.roundWinnerId;
							$rootScope.currentGame.winningCard = data.data.winningCard;

							if (data.data.possibleBlackCards && $rootScope.currentGame.judge == socket.id) {
								$rootScope.currentGame.blackCards = data.data.possibleBlackCards;
							}
						});
					}
					break;
			}
		},

		playCard: function(card) {
			if (!$rootScope.currentGame || $rootScope.currentGame.judge == $rootScope.socket.id) {
				return;
			}

			if ($rootScope.currentGame.blackCard.pick <= 0) {
				return;
			} else {
				$rootScope.currentGame.blackCard.pick--;
			}

			if (card.id == "blank") {
				return;
				// TODO: Create custom alert and prompt
				/*var input = prompt("Enter the text you wish to write on the card:", "");
				if (input == null || input == "") {
					$rootScope.currentGame.blackCard.pick++;
					return;
				} else {
					card.text = input;
				}*/
			}

			socket.emit("_sendPackage", {
				type: "sendRequestToGame",
				data: {
					request: "playCard",
					card: JSON.stringify(card)
				}
			});

			if (!$rootScope.currentGame.playedCards) {
				$rootScope.currentGame.playedCards = [];
			}
			$rootScope.currentGame.playedCards.push(card);

			$rootScope.currentGame.hand.splice($rootScope.currentGame.hand.indexOf(card), 1);
			$rootScope.gameScripts["cah"].selectedCard = null;
		},

		selectCard: function(card) {
			if ($rootScope.socket.id != $rootScope.currentGame.judge) {
				return;
			}

			$rootScope.gameScripts["cah"].selectedCard = card;
		},
		judgeCard: function(card) {
			if ($rootScope.socket.id != $rootScope.currentGame.judge) {
				return;
			}

			socket.emit("_sendPackage", {
				type: "sendRequestToGame",
				data: {
					request: "judgeCard",
					card: JSON.stringify(card)
				}
			});
			$rootScope.gameScripts["cah"].selectedCard = null;
		},

		setBlackCard: function(card) {
			if ($rootScope.socket.id != $rootScope.currentGame.judge) {
				return;
			}

			socket.emit("_sendPackage", {
				type: "sendRequestToGame",
				data: {
					request: "setBlackCard",
					card: JSON.stringify(card)
				}
			});
			$rootScope.gameScripts["cah"].selectedCard = null;
		},

		combineCards: function(blackCard, whiteCards) {
			console.log(whiteCards);
			blackCard = blackCard.split("_");
			var text = "";
			for (var i = 0; i < blackCard.length; i++) {
				text += blackCard[i];

				if (whiteCards[i]) {
					text += "<span class=\"highlight\">" + whiteCards[i].text + "</span>";
				}
			}

			var texts = [];
			for (var i = 0; i < whiteCards.length; i++) {
				texts.push("<span class=\"highlight\">" + whiteCards[i].text + "</span>");
			}

			text = String.formatWithArray(text, texts);
			text = text.replace(/\\/g, "");

			return $sce.trustAsHtml(text);
		}
	};

	$http.get($rootScope.hostname + "/cah/cardSets").then(function (response) {
		$rootScope.gameScripts["cah"].setupData.cardSets = response.data;
	});
})();