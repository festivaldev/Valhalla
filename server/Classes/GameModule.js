var GameModule = function () {

}

var proto = GameModule.prototype;

proto.name = "Name";
proto.author = "Author";
proto.version = "1.0";
proto.id = "";

proto.getDetails = function () {
	return {
		"name": this.name,
		"author": this.author,
		"version": this.version,
		"id": this.id
	};
}

proto.gameLogicModule = null;
proto.game = null;

proto.setGame = function (game) {
	this.game = game;
	this.gameLogicModule.game = game;
}

proto.playerJoined = function (user) { }
proto.playerLeft = function (user) { }

module.exports = GameModule;