String.format = function (format) {
	var args = Array.prototype.slice.call(arguments, 1);
	return format.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
};

String.formatWithArray = function (format) {
	var args = Array.prototype.slice.call(arguments, 1);
	var array = args[0];

	if (typeof (array) !== "object") {
		return String.format(format);
	}

	return format.replace(/{(\d+)}/g, function (match, number) {
		return typeof array[number] != 'undefined' ? array[number] : match;
	});
}

var socket,
	gameScripts = {},
	latencyCheck;

var PackageHandler = function($rootScope, $location) {
	var handler = function(data) {
		switch (data.type) {
			case "pong":
				$rootScope.$apply(function () {
					$rootScope.latency = Date.now() - $rootScope.startTime;
				});
				break;
			case "updateGameList":
				console.log(data.data);
				$rootScope.$apply(function () {
					$rootScope.gameList = data.data.gameList;
					$rootScope.gameBundles = data.data.bundles;
				})
				break;
			case "joinedGame":
				$rootScope.$apply(function() {
					$location.path("/game/"+data.data.gameID).replace();
					$rootScope.currentGame = data.data.gameInfo;
				});
				break;
			case "joinGameFailed":
				alert("Joining this game failed. Reason: " + data.data.reason);
				break;
			case "playerJoinedGame":
				if ($rootScope.currentGame) {
					$rootScope.$apply(function () {
						$rootScope.currentGame.players = data.data.usernames;
						$rootScope.currentGame.host = data.data.host;
						$rootScope.currentGame.hostID = data.data.hostID;
						$rootScope.currentGame.playerInfo = data.data.playerInfo;
					});
				}
				break;
			case "playerInfoChanged":
				if ($rootScope.currentGame) {
					$rootScope.$apply(function () {
						$rootScope.currentGame.playerInfo = data.data.playerInfo;
					});
				}
				break;
			case "gameEvent":
				$rootScope.gameScripts[$rootScope.currentGame.gameBundle.clientDir].handleGameEvent(data);
				break;
			default: break;
		}
	}

	return handler;
}

var app = angular.module("Valhalla", ["ngRoute"])
	.service("PackageHandler", PackageHandler)
	.filter('range', function () {
		return function (input, total) {
			total = parseInt(total);
			for (var i = 0; i < total; i++) {
				input.push(i);
			}
			return input;
		};
	})
	.filter('nl2br', ['$sce', function ($sce) {
		return function (text) {
			return text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) : '';
		};
	}])
	.filter("render", function ($sce) {
		return function (text) {
			//return text.join("<span class=\"spacer\"></span>");
			return $sce.trustAsHtml(text.replace(/(\_|\{.[0-9]*\})/g, "<span class=\"spacer\"></span>").replace(/\\/g, ""));
		}
	})
	.directive("tabHeader", function() {
		return {
			restrict: "E",
			scope: {
				headers: "="
			},
			template: '<ul class="nav">\
				<li ng-repeat="header in headers track by $index" ng-click="itemClicked($event.currentTarget, $index)" ng-class="{\'selected\': $index == 0}">{{header}}</li>\
			</ul>',
			link: function($scope, $element) {
				$scope.itemClicked = function(item, index) {
					item.parentElement.querySelectorAll(".selected").forEach(function(element, index) {
						element.classList.remove("selected");
					});
					item.classList.add("selected");

					document.querySelector(".tab-controller").style.transform = "translate3d(-" + (index * 100) + "%, 0, 0)";
				}
			}
		}
	})
	.controller("MainViewController", function($scope, $rootScope, $location) {
		$rootScope.hostname = "http://" + location.hostname + ":8080";

		$rootScope.gameScripts = {};
		document.querySelector("script#game-scripts").setAttribute("src", $rootScope.hostname + "/gameScripts.js");

		if (!socket || !socket.connected) {
			$location.path("/").replace();
		}
	})
	.controller("LoginController", function($scope, $rootScope, $http, $location, $timeout, PackageHandler) {
		$scope.isConnecting = false;
		$scope.time = (new Date()).getTime();

		$scope.keyLength = function(keys) {
			return Object.keys(keys).length;
		}

		$scope.connect = function() {
			if (socket) {
				if (socket._connectTimer) {
					clearTimeout(socket._connectTimer);
				}
				socket.close();
				socket = undefined;

				$scope.isConnecting = false;
			} else {
				if (!$scope.username) {
					//return;
				}

				$scope.isConnecting = true;

				$rootScope.socket = socket = io($rootScope.hostname, {
					secure: true,
					multiplex: false,
					"force new connection": true,
					//query: "username=" + $scope.username,
					query: "username="+(new Date()).getTime(),
					"reconnectionDelay": 1000,
					"reconnectionDelayMax": 1000,
					"reconnectionAttempts": 5
				});

				$rootScope.startTime = Date.now();
				socket._connectTimer = setTimeout(function () {
					socket.close();
					socket = undefined;

					$rootScope.$apply(function () {
						$scope.isConnecting = false;
					});
				}, 5000);

				socket.on("connect", function () {
					if (socket._connectTimer) {
						clearTimeout(socket._connectTimer);
					}

					$rootScope.latency = Date.now() - $rootScope.startTime;
					
					$timeout(() => {
						$scope.isConnecting = false;
						$location.path("/lobby").replace();
					}, 0/*Math.floor(1000 + Math.random() * 1000)*/);

					var startTime;
					latencyCheck = setInterval(function () {
						$rootScope.startTime = Date.now();
						socket.emit("_sendPackage", { type: "ping" });
					}, 10000);
				});

				socket.on("_receivePackage", PackageHandler);

				socket.on("disconnect", function () {
					clearInterval(latencyCheck);
					socket.close();
					socket = undefined;

					delete $rootScope.currentGame;
					delete $rootScope.gameList;
					delete $rootScope.gameBundles;

					$timeout(function() {
						$location.path("/").replace();
					})
				});
			}
		}
		$scope.connect();

		$scope.inputKeydown = function(event) {
			if ($scope.isConnecting) {
				event.preventDefault();
				return false;
			}
			if (event.keyCode === 13 && $scope.username && $scope.username.length) {
				$scope.connect();
			}
		}
	})
	.controller("LobbyController", function($scope, $rootScope, $timeout, $http) {
		$scope.headers = ["Games", "Create Game", "Settings"];
		$scope.isShowingGameDetails = false;

		$http.get($rootScope.hostname + "/gameList").then(function (response) {
			$rootScope.gameList = response.data;
		});

		$scope.showGameDetails = function(game) {
			$scope.game = game;
			$timeout(function() {
				$scope.isShowingGameDetails = true;
			}, 200);
		}

		$scope.range = function (min, max, step) {
			step = step || 1;
			var input = [];
			for (var i = min; i <= max; i += step) {
				input.push(i);
			}
			return input;
		};

		$scope.joinGame = function(game) {
			socket.emit("_sendPackage", {
				type: "joinGame",
				data: {
					gameID: game.gameID,
					password: (game.passworded ? prompt("Enter Password") : null)
				}
			})
		}
	})
	.controller("GameSetupController", function($scope, $rootScope, $http) {
		$scope.gameOptions = {};

		$http.get($rootScope.hostname + "/gameBundles").then(function (response) {
			$rootScope.gameBundles = response.data;
			$scope.currentBundle = Object.keys($rootScope.gameBundles)[0];
			$scope.gameBundleChanged();
		});

		$scope.gameBundleChanged = function() {
			$scope.gameOptions = $rootScope.gameScripts[$scope.currentBundle].defaultOptions;
		}

		$scope.createGame = function() {
			socket.emit("_sendPackage", {
				type: "createGame",
				data: {
					gameBundle: $scope.currentBundle,
					gameOptions: $scope.gameOptions
				}
			})
		}
	})
	.controller("GameController", function($scope, $rootScope) {
		$scope.showScoreboard = false;
		$scope.gameLogic = $rootScope.gameScripts[$rootScope.currentGame.gameBundle.clientDir];

		window.addEventListener("keydown", function(e) {
			if (e.keyCode == 9) {
				e.preventDefault();

				$rootScope.$apply(function() {
					$scope.showScoreboard = true;
				});
			}
		});

		window.addEventListener("keyup", function(e) {
			if (e.keyCode == 9) {
				e.preventDefault();

				$rootScope.$apply(function() {
					$scope.showScoreboard = false;
				});
			}
		})
	})
	.config(function($routeProvider, $sceProvider) {
		$routeProvider.when("/", {
			templateUrl: "static/login.html",
			controller: "LoginController"
		})
		.when("/lobby", {
			templateUrl: "static/lobby.html",
			controller: "LobbyController"
		})
		.when("/game/:gameID", {
			templateUrl: "static/game.html",
			controller: "GameController"
		});

		$sceProvider.enabled(false);
	});