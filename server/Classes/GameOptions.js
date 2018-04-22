var config = require("../ServerConfig.json");

var GameOptions = function(_gameBundle) {
	var gameOptions = this;

	var gameBundle = _gameBundle;

	gameOptions.playerLimit = -1;
	gameOptions.scoreGoal = -1;
	gameOptions.password = null;
	gameOptions.raw = {};

	gameOptions.update = function(newOptions) {
		gameOptions.playerLimit = newOptions.playerLimit;
		gameOptions.scoreGoal = newOptions.scoreGoal;
		gameOptions.password = newOptions.password;
	}

	gameOptions.serialize = function(includePassword, raw) {
		var info = {
			playerLimit: gameOptions.playerLimit,
			scoreGoal: gameOptions.scoreGoal,
			password: (includePassword ? gameOptions.password : null),
			raw: (raw ? gameOptions.raw : null)
		}

		return info;
	}

	gameOptions.deserialize = function(options) {
		var _options = new GameOptions();

		_options.playerLimit = options.playerLimit;
		_options.scoreGoal = options.scoreGoal;
		_options.password = options.password;
		_options.raw = options;

		return _options;
	}
}

module.exports = GameOptions;