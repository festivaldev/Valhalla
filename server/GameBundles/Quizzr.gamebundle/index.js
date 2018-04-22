var GameModule = require("../../Classes/GameModule");

var CAHModule = function () {
	GameModule.call(this);

	this.displayName = "Quizzr";
	this.bundleID = "ml.festival.quizzr";
	this.version = "1.0";
	this.author = "Sniper_GER";
	this.clientDir = "quiz";

	return this;
}

app.get('/quiz/createGame.html', function (req, res) {
	res.sendFile(__dirname + '/client/createGame.html');
});

app.get('/quiz/client.js', function (req, res) {
	res.sendFile(__dirname + '/client/client.js');
});

app.get('/quiz/style.css', function (req, res) {
	res.sendFile(__dirname + '/client/style.css');
});

CAHModule.prototype = new GameModule();

module.exports = CAHModule;