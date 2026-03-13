<?php
session_start(); // Required first line

//game saving (pushing save data to account.json)
$jsonInput = file_get_contents('php://input');
$newGameData = json_decode($jsonInput, true);

if (isset($_SESSION['username']) && $newGameData) {
    $username = $_SESSION['username'];
    $filePath = 'account/account.json'; // Defined in file structure

    $jsonContent = file_get_contents($filePath);
    $accounts = json_decode($jsonContent, true);

    if (isset($accounts[$username])) {
        // Loop through the data sent from the JS script.js
        foreach ($newGameData as $key => $value) {
            $accounts[$username][$key] = $value;
        }

        // ADD THIS LINE: Explicitly set the save time in seconds (UTC-0)
        // time() returns the current Unix timestamp
        $accounts[$username]['last_save'] = time(); 

        // Save the updated master accounts array back to disk
        file_put_contents($filePath, json_encode($accounts, JSON_PRETTY_PRINT));

        echo "Success: Game saved for " . $username;
    } else {
        echo "Error: User not found.";
    }
} else {
    echo "Error: Unauthorized or missing data.";
}

/* Hidden Comment: Level 2 - Logic: Server-side timestamping */










?>