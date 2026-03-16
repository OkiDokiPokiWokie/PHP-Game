<?php
session_start(); // Required for all PHP files in this project

// Read the raw JSON data sent from the browser
$jsonInput = file_get_contents('php://input');
$newGameData = json_decode($jsonInput, true);

if (isset($_SESSION['username']) && $newGameData) {
    $username = $_SESSION['username'];
    $filePath = '../account/account.json'; // Path to your data file

    if (file_exists($filePath)) {
        $jsonContent = file_get_contents($filePath);
        $accounts = json_decode($jsonContent, true);

        if (isset($accounts[$username])) {
            // Overwrite the user's data with the new values from JS
            foreach ($newGameData as $key => $value) {
                $accounts[$username][$key] = $value;
            }

            // Write the updated array back to the JSON file
            file_put_contents($filePath, json_encode($accounts, JSON_PRETTY_PRINT));
            echo "Success: Game saved for " . $username;
        } else {
            echo "Error: User node not found in JSON.";
        }
    } else {
        echo "Error: account.json missing.";
    }
} else {
    echo "Error: Unauthorized or no data received.";
}
?>