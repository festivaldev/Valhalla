var WhiteCard = function (_id, _text, _deck, _isBlank) {
	var whiteCard = this;

	var id = _id,
		text = _text,
		deck = _deck;
		isBlank = _isBlank;

	whiteCard.getID = function () {
		return id;
	}

	whiteCard.setID = function (s) {
		if (!isBlank) {
			return;
		}

		id = s;
	}


	whiteCard.getText = function () {
		return text;
	}

	whiteCard.getDeck = function() {
		return deck;
	}

	whiteCard.isBlank = function () {
		return isBlank;
	}

	whiteCard.setText = function(s) {
		if (!isBlank) {
			return;
		}

		text = s;
	}

	whiteCard.clientInfo = function () {
		return {
			id: id,
			text: text,
			isBlank: isBlank
		}
	}
}

module.exports = WhiteCard;