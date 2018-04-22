/**
 * The script served to clients containing clientside game logic
 * Scripts are always added to the gameScripts object in Angular's $rootScope
 * @author Sniper_GER
 * @version 1.0
 */


/*(function () {
	var $injector = angular.element(document).injector();
	var $rootScope = $injector.get("$rootScope");

	$rootScope.gameScripts["quiz"] = {
		startGame: function () {
			socket.emit("_sendPackage", { type: "startGame" })
		},
		handleGameEvent: function (data) {
			console.log(data);
		},
		defaultOptions: {
			playerLimit: 2
		}
	};
	window.resizeTo();
})()*/

(function () {
	//console.log('Hello World!');

	var $injector = angular.element(document).injector();
	var $rootScope = $injector.get("$rootScope");

	$rootScope.gameScripts["quiz"] = {
		startGame: function () {
			socket.emit("_sendPackage", { type: "startGame" })
		},
		handleGameEvent: function (data) {
			console.log(data);
		},
		defaultOptions: {
			playerLimit: 2
		}
	};
})();