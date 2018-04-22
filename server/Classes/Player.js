var Player = function(_user) {
	var player = this;

	var user = _user,
		score = 0,
		hand = [];
	
	player.getUser = function() {
		return user;
	}

	player.getScore = function() {
		return score;
	}

	player.setScore = function(newScore) {
		score = newScore;
	}

	player.increaseScore = function(increaseBy) {
		score += (increaseBy || 1);
	}

	player.decreaseScore = function(decreaseBy) {
		score -= (decreaseBy || 1);
	}

	player.resetScore = function() {
		score = 0;
	}

	player.getHand = function() {
		return hand;
	}

	player.setHand = function (_hand) {
		hand = _hand;
	}

	player.toString = function() {
		return String.format("{0} ({1})", user.toString(), score);
	}
}

module.exports = Player;