/**
 * The script served to clients containing clientside game logic
 * Scripts are always added to the gameScripts object in Angular's $rootScope
 * @author Sniper_GER
 * @version 1.0
 */

angular.element(document).injector().get("$rootScope").gameScripts["cah"] = {
	test: function() {
		console.log("test");
	},
	setupData: {
		cardSets: [
			{
				id: "5967345",
				title: "Test 1",
				calls: 10,
				responses: 10
			}
		]
	},
	defaultOptions: {
		playerLimit: 10,
		scoreLimit: 8
	}
}