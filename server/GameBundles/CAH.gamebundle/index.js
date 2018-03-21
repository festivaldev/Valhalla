var GameModule = require("../../Classes/GameModule");

var CAHModule = function () {
	GameModule.call(this);

	this.displayName = "Cards Against Humanity";
	this.bundleId = "ml.festival.CAH-festival";
	this.version = "1.0";
	this.author = "Sniper_GER";
	this.clientDir = "cah";

	return this;
}

app.get('/cah/createGame.html', function (req, res) {
	res.sendFile(__dirname + '/client/createGame.html');
});

app.get('/cah/client.js', function (req, res) {
	res.sendFile(__dirname + '/client/client.js');
});

app.get('/cah/style.css', function (req, res) {
	res.sendFile(__dirname + '/client/style.css');
});

CAHModule.prototype = new GameModule();

module.exports = CAHModule;