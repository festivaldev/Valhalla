<?php
	$data = json_decode(file_get_contents('php://input'), true);
	
	$category = $_GET["c"];
	$request = $_GET["q"];

	$db = new SQLite3("../cards.db");

	switch ($category) {
		case "decks": 
			switch ($request) {
				case "add":
					$data["id"] = substr(hash("sha256", microtime()), 0, 24);
					$query = $db->exec("INSERT INTO decks (`id`, `name`, `createdOn`, `updatedOn`) VALUES ('$data[id]', '" . SQLite3::escapeString($data["name"]) . "', '$data[createdOn]', '$data[updatedOn]')");
					break;
				case "update":
					$query = $db->exec("UPDATE decks SET 
						`name` = '" . SQLite3::escapeString($data["name"]) . "',
						`updatedOn` = '$data[updatedOn]'
						WHERE `decks`.`id` = '$data[id]'");
					break;
				case "delete":
					$db->exec("DELETE FROM decks WHERE decks.id = '$_GET[i]'");
					$db->exec("UPDATE calls SET calls.deckId = '' WHERE calls.deckId = '$_GET[i]'");
					break;
				default: break;
			}

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
			switch ($request) {
				case "add":
					$data["id"] = substr(hash("sha256", microtime()), 0, 24);
					$db->exec("INSERT INTO calls (`id`, `text`, `deckId`, `createdOn`, `updatedOn`) VALUES ('$data[id]', '" . SQLite3::escapeString($data["text"]) . "', '$data[deckId]', '$data[createdOn]', '$data[updatedOn]')");
					break;
				case "update":
					$db->exec("UPDATE calls SET
					`text` = '" . SQLite3::escapeString($data["text"]) . "',
					`deckId` = '$data[deckId]',
					`updatedOn` = '$data[updatedOn]'
					WHERE calls.id = '$data[id]'");

					break;
				case "delete":
					$db->exec("DELETE FROM calls WHERE calls.id = '$_GET[i]'");

					break;
				default: break;
			}

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
			switch ($request) {
				case "add":
					$data["id"] = substr(hash("sha256", microtime()), 0, 24);
					$db->exec("INSERT INTO responses (`id`, `text`, `deckId`, `createdOn`, `updatedOn`) VALUES ('$data[id]', '" . SQLite3::escapeString($data["text"]) . "', '$data[deckId]', '$data[createdOn]', '$data[updatedOn]')");
					break;
				case "update":
					$db->exec("UPDATE responses SET
					`text` = '" . SQLite3::escapeString($data["text"]) . "',
					`deckId` = '$data[deckId]',
					`updatedOn` = '$data[updatedOn]'
					WHERE responses.id = '$data[id]'");

					break;
				case "delete":
					$db->exec("DELETE FROM responses WHERE responses.id = '$_GET[i]'");

					break;
				default: break;
			}

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
	
	/*$db = new SQLite3("../cards.db");

	$query = $db->exec("INSERT INTO decks (`id`, `name`) VALUES ('$request[id]', '$request[name]')");*/
?>