<?php
session_start();

$errorMsg = ""; 
$filePath = "./account/account.json";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Determine if user clicked Log In or Create Account
    $logInOrSignUp = isset($_POST["logIn"]) ? "login" : "signup";
    $username = trim($_POST["username"]);
    $password = $_POST["password"];

    $allAccounts = [];

    // 1. LOAD EXISTING ACCOUNTS
    if (file_exists($filePath)) {
        $jsonContent = file_get_contents($filePath);
        $decoded = json_decode($jsonContent, true);

        if (is_array($decoded)) {
            $allAccounts = $decoded;
        }
    }

    $alreadyExists = isset($allAccounts[$username]);

    // 2. SIGN UP LOGIC
    if ($logInOrSignUp == "signup") {
        if ($alreadyExists) {
            $errorMsg = "Username already taken!";
        } else {
            // Create a fresh user template
            $newUser = [
                "password" => $password,
                "current_money" => 0,
                "total_money" => 0,
                "play_time" => 0,
                "mps" => 0,
                "click_power" => 50,
                "last_save" => (string)(time() * 1000), // 13-digit string format
            ];

            // Initialize buildings 1-15
            for ($i = 1; $i <= 15; $i++) {
                $newUser["building$i"] = 0;
            }

            // Add the new user to the main list (DOES NOT REPLACE OTHERS)
            $allAccounts[$username] = $newUser;

            // Save the entire list back to the file
            file_put_contents($filePath, json_encode($allAccounts, JSON_PRETTY_PRINT));

            $_SESSION['username'] = $username;
            header("Location: game.php");
            exit();
        }
    } 

    // 3. LOG IN LOGIC
    if ($logInOrSignUp == "login") {
        // Fix: Use $allAccounts instead of $account
        if ($alreadyExists && $allAccounts[$username]['password'] === $password) {
            $_SESSION['username'] = $username;
            header("Location: game.php");
            exit();
        } else {
            $errorMsg = "Invalid username or password!";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign Up / Log In</title>
    <link rel="stylesheet" href="assets/styles/index.css">
    <link rel="stylesheet" href="assets/bootstrap-5.3.8-dist/bootstrap-5.3.8-dist/css/bootstrap.min.css">
</head>
<body class="bg-dark text-white">

    <div class="auth-card d-flex justify-content-center align-items-center" style="min-height: 100vh;">
        <div class="card shadow-sm bg-secondary text-white" style="width: 400px;">
            <div class="card-body p-4">
                <h3 class="text-center mb-4">Code Clicker</h3>
                
                <?php if ($errorMsg !== ""): ?>
                    <div class="alert alert-danger p-2 text-center" style="font-size: 0.9rem;">
                        <?php echo $errorMsg; ?>
                    </div>
                <?php endif; ?>
                
                <form action="index.php" method="POST">
                    <div class="mb-3">
                        <label for="usernameInput" class="form-label">Username</label>
                        <input type="text" name="username" class="form-control" id="usernameInput" placeholder="Enter username" required>
                    </div>

                    <div class="mb-3">
                        <label for="passwordInput" class="form-label">Password</label>
                        <input type="password" name="password" class="form-control" id="passwordInput" placeholder="Enter password" required>
                    </div>

                    <div class="d-grid gap-2">
                        <button type="submit" name="logIn" value="login" class="btn btn-primary">Log In</button>
                        <button type="submit" name="createAccount" value="signup" class="btn btn-outline-light">Create Account</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="assets/bootstrap-5.3.8-dist/bootstrap-5.3.8-dist/js/bootstrap.min.js"></script>
</body>
</html>