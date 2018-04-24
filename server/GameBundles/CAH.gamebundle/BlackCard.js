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
		var underscores = raw.match(/\_/g) || [];
		var interpolations = (new Set(raw.match(/\{.[0-9]*\}/g))).size || 0;
		return Math.max(underscores.length + interpolations, 1);
	}

	blackCard.clientInfo = function() {
		var underscores = raw.match(/\_/g) || [];
		var interpolations = (new Set(raw.match(/\{.[0-9]*\}/g))).size || 0;

		return {
			id: id,
			raw: raw,
			text: text,
			deck: deck,
			pick: blackCard.getPick(),
			isBlank: isBlank,
			append: underscores.length + interpolations == 0
		}
	}
}

module.exports = BlackCard;