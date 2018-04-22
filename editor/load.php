<?php
	$db = new SQLite3("../cards.db");
	$request = $_GET["q"];

	switch ($request) {
		case "decks":
			$results = $db->query("SELECT * FROM decks ORDER BY createdOn DESC");
			$decks = array();
			while ($row = $results->fetchArray()) {
				array_push($decks, array(
					"id" => $row["id"],
					"name" => str_replace("\\", "", $row["name"]),
					"createdOn" => $row["createdOn"]
				));
			}

			echo json_encode($decks, JSON_PRETTY_PRINT);
			break;
		case "calls":
			$results = $db->query("SELECT * FROM calls ORDER BY createdOn DESC");
			$calls = array();
			while ($row = $results->fetchArray()) {
				array_push($calls, array(
					"id" => $row["id"],
					"text" => str_replace("\\", "", $row["text"]),
					"deckId" => $row["deckId"],
					"createdOn" => $row["createdOn"]
				));
			}

			echo json_encode($calls, JSON_PRETTY_PRINT);
			break;
		case "responses":
			$results = $db->query("SELECT * FROM responses ORDER BY createdOn DESC");
			$responses = array();
			while ($row = $results->fetchArray()) {
				array_push($responses, array(
					"id" => $row["id"],
					"text" => str_replace("\\", "", $row["text"]),
					"deckId" => $row["deckId"],
					"createdOn" => $row["createdOn"]
				));
			}

			echo json_encode($responses, JSON_PRETTY_PRINT);
			break;
		default: break;
	}
?>