var Server = function(_connectedUsers, _gameManager) {
	var server = this;
	var connectedUsers = _connectedUsers;
	var gameManager = _gameManager;

	server.connectedUsers = function() {
		return connectedUsers;
	}

	server.gameManager = function() {
		return gameManager
	}
}

module.exports = Server;