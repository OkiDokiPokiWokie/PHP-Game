<?php
// Every PHP file must start with this to access user data
session_start();

// 1. Get the raw JSON data sent by the Fetch API
$jsonInput = file_get_contents('php://input');
$newGameData = json_decode($jsonInput, true);

// 2. Check if we have a valid session and valid data
if (isset($_SESSION['username']) && $newGameData) {
    $username = $_SESSION['username'];
    $filePath = '../account/account.json'; // Path from file_structure.jpg

    // 3. Load the existing accounts
    $jsonContent = file_get_contents($filePath);
    $accounts = json_decode($jsonContent, true);

    // 4. Update ONLY this specific user's data while keeping their account info
    if (isset($accounts[$username])) {
        // We merge the new game stats into the existing user node
        // This ensures things like 'playerPassword' stay safe [cite: 73]
        foreach ($newGameData as $key => $value) {
            $accounts[$username][$key] = $value;
        }

        // 5. Write the updated array back to the JSON file
        file_put_contents($filePath, json_encode($accounts, JSON_PRETTY_PRINT));
        echo "Success: Game saved for " . $username;
    } else {
        echo "Error: User not found in database.";
    }
} else {
    echo "Error: Not logged in or no data received.";
}