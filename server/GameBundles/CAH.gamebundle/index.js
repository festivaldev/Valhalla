var GameModule = require("../../Classes/GameModule");

var CAHModule = function () {
	var module = this;

	module.name = "Cards Against Humanity - FESTIVAL Edition";
	module.author = "FESTIVAL Development";
	module.version = "1.0";
	module.id = "ml.festival.CAH-FESTIVAL";
	
	module.commandHandler = null;

	return module;
}

CAHModule.prototype = Object.create(GameModule.prototype);

// app.get('/cah.client.js', function (req, res) {
// 	console.log(req);
// 	res.sendFile(__dirname + '/index.js');
// });

module.exports = CAHModule;