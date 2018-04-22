var BlackCard = function(_id, _text, _deck, _isBlank) {
	var blackCard = this;

	var id = _id,
		raw = _text,
		text = _text.replace(/(\_|\{.[0-9]*\})/g, '<span class="spacer"></span>'),
		deck = _deck,
		pick = -1,
		isBlank = _isBlank;

	blackCard.getID = function() {
		return id;
	}

	blackCard.getText = function() {
		return text;
	}

	blackCard.getDeck = function() {
		return deck;
	}

	blackCard.getPick = function() {
		return (new Set(raw.match(/(\_|\{.[0-9]*\})/g))).size;
	}

	blackCard.clientInfo = function() {
		return {
			id: id,
			raw: raw,
			text: text,
			pick: pick,
			isBlank: isBlank
		}
	}
}

module.exports = BlackCard;