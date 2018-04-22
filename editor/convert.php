<?php
	header("Content-Type: text/html; charset=utf-8");
	$json = json_decode(file_get_contents("cards.json"), true);
	$db = new SQLite3("../cards.db");

	// convert calls
	$db->exec("DELETE FROM calls");
	for ($i=0; $i<count($json["calls"]); $i++) {
		$call = $json["calls"][$i];

		$id = substr(hash("sha256", microtime()), 0, 24);
		$text = implode("_", $call["text"]);
		$createdOn = strtotime($call["created_at"]) * 1000;

		//echo "$text\n";
		$db->exec("INSERT INTO calls (`id`, `text`, `deckId`, `createdOn`, `updatedOn`) VALUES ('$id', '" . SQLite3::escapeString(addslashes($text)) . "', '0', '$createdOn', '$createdOn')");
	}

	// convert responses
	$db->exec("DELETE FROM responses");
	for ($i=0; $i<count($json["responses"]); $i++) {
		$response = $json["responses"][$i];

		$id = substr(hash("sha256", microtime()), 0, 24);
		$text = implode("", $response["text"]);
		$createdOn = strtotime($response["created_at"]) * 1000;

		//echo "$text\n";
		$db->exec("INSERT INTO responses (`id`, `text`, `deckId`, `createdOn`, `updatedOn`) VALUES ('$id', '" . SQLite3::escapeString(addslashes($text)) . "', '0', '$createdOn', '$createdOn')");
	}
?>