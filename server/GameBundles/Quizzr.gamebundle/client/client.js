/**
 * The script served to clients containing clientside game logic
 * Scripts are always added to the gameScripts object in Angular's $rootScope
 * @author Sniper_GER
 * @version 1.0
 */

angular.element(document).injector().get("$rootScope").gameScripts["quiz"] = {
	test: function () {
		console.log("test");
	},
	defaultOptions: {
		playerLimit: 2
	}
}