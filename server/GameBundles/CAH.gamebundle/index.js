var GameModule = require("../../Classes/GameModule"),
	GameLogic = require("./GameLogic"),
	sqlite3 = require("sqlite3");

var CAHModule = function () {
	GameModule.call(this);

	this.displayName = "Cards Against Humanity";
	this.bundleID = "ml.festival.CAH-festival";
	this.version = "1.0";
	this.author = "Sniper_GER";
	this.clientDir = "cah";

	this.gameLogic = new GameLogic();

	return this;
}

app.get('/cah/createGame.html', function (req, res) {
	res.sendFile(__dirname + '/client/createGame.html');
});

app.get('/cah/client.js', function (req, res) {
	res.sendFile(__dirname + '/client/client.js');
});

app.get('/cah/game.html', function (req, res) {
	res.sendFile(__dirname + '/client/game.html');
});

app.get('/cah/style.css', function (req, res) {
	res.sendFile(__dirname + '/client/style.css');
});

app.get('/cah/cardSets', function(req, res) {
	var db = new sqlite3.Database(__dirname + "/../../../cards.db");
	db.serialize(function() {
		var decks = [];
		db.all("SELECT * FROM decks", function(err, all) {
			all.push({
				id: "0",
				name: "Other"
			})
			res.send(JSON.stringify(all));
		});
	})
})

CAHModule.prototype = new GameModule();

module.exports = CAHModule;