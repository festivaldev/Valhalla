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

	$rootScope.gameScripts["cah"] = {
		startGame: function () {
			socket.emit("_sendPackage", { type: "startGame" })
		},
		handleGameEvent: function (data) {
			console.log(data);
			switch (data.eventType) {
				case "gameStateChanged":
					if ($rootScope.currentGame) {
						$rootScope.$apply(function () {
							$rootScope.currentGame.state = data.data.gameState;
						})
					}
					break;
			}
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
})();