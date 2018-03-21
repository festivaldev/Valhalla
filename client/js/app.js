var socket,
	gameScript,
	gameBundleCache = "";

var app = angular.module("Valhalla", ["ngRoute"])
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
	.controller("MainViewController", function($scope, $location) {
		if (!socket || !socket.connected) {
			$location.path("/").replace();
		}
	})
	.controller("LoginController", function($scope, $rootScope, $http, $location, $timeout) {
		$rootScope.hostname = "http://" + location.hostname + ":8080";
		$scope.isConnecting = false;

		$scope.time = (new Date()).getTime();

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
					return;
				}

				$scope.isConnecting = true;

				$rootScope.socket = socket = io($rootScope.hostname, {
					secure: true,
					multiplex: false,
					"force new connection": true,
					query: "username=" + $scope.username,
					"reconnectionDelay": 1000,
					"reconnectionDelayMax": 1000,
					"reconnectionAttempts": 5
				});

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
					
					$timeout(() => {
						$scope.isConnecting = false;
						$location.path("/lobby").replace();
					}, Math.floor(1000 + Math.random() * 1000));
				});

				socket.on("disconnect", function () {
					socket.close();
					socket = undefined;

					$timeout(function() {
						$location.path("/").replace();
					})
				});
			}
		}

		$scope.inputKeydown = function(event) {
			if ($scope.isConnecting) {
				event.preventDefault();
				return false;
			}
			if (event.keyCode === 13 && $scope.username.length != 0) {
				$scope.connect();
			}
		}
	})
	.controller("LobbyController", function($scope, $rootScope, $timeout, $http) {
		$scope.headers = ["Games", "Create Game", "Settings"];
		$scope.isShowingGameDetails = false;

		$scope.gameOptions = {
			currentBundle: null,
			playerLimit: "10"
		}

		$http.get($rootScope.hostname + "/gameList").then(function (response) {
			$rootScope.gameList = response.data;
		});

		$http.get($rootScope.hostname + "/gameBundles").then(function (response) {
			$rootScope.gameBundles = response.data;
			$scope.gameOptions.currentBundle = $rootScope.gameBundles[0].clientDir;
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
		
		
		$scope.loadGameScript = function() {
			if ($scope.gameOptions.currentBundle && gameBundleCache != $scope.gameOptions.currentBundle) {
				gameBundleCache = $scope.gameOptions.currentBundle;
				
				if (gameScript) {
					document.head.removeChild(gameScript);
				}
				gameScript = document.createElement("script");
				gameScript.src = $rootScope.hostname + "/" + $scope.gameOptions.currentBundle + "/client.js";
				document.head.appendChild(gameScript);
			}
		}
	})
	.config(function($routeProvider, $sceProvider) {
		$routeProvider.when("/", {
			templateUrl: "static/login.html",
			controller: "LoginController"
		})
		.when("/lobby", {
			templateUrl: "static/lobby.html",
			controller: "LobbyController"
		});

		$sceProvider.enabled(false);
	});