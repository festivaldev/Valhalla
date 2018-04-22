var GameModule = function() {
	var gameModule = this;
}

GameModule.prototype["displayName"] = "Name";
GameModule.prototype["bundleID"] = "";
GameModule.prototype["version"] = "1.0";
GameModule.prototype["author"] = "";
GameModule.prototype["clientDir"] = "";

GameModule.prototype.clientInfo = function() {
	return {
		displayName: this.displayName,
		bundleID: this.bundleID,
		version: this.version,
		author: this.author,
		clientDir: this.clientDir
	}
}

GameModule.prototype.gameLogic = null;
GameModule.prototype.game = null;

GameModule.prototype.setGame = function(game) {
	this.game = game;
	this.gameLogic.game = game;
}

// GameModule.prototype["displayName"] = "Cards Against Humanity - FESTIVAL Edition";
// GameModule.prototype["bundleId"] = "ml.festival.CAH-festival";
// GameModule.prototype["version"] = "1.0";

module.exports = GameModule;