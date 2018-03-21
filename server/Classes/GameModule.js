var GameModule = function() {
	var gameModule = this;
}

GameModule.prototype["displayName"] = "Name";
GameModule.prototype["bundleId"] = "";
GameModule.prototype["version"] = "1.0";
GameModule.prototype["author"] = "";
GameModule.prototype["clientDir"] = "";

GameModule.prototype.clientInfo = function() {
	return {
		displayName: this.displayName,
		bundleId: this.bundleId,
		version: this.version,
		author: this.author,
		clientDir: this.clientDir
	}
}

// GameModule.prototype["displayName"] = "Cards Against Humanity - FESTIVAL Edition";
// GameModule.prototype["bundleId"] = "ml.festival.CAH-festival";
// GameModule.prototype["version"] = "1.0";

module.exports = GameModule;