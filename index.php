<?php
session_start();

$errorMsg = ""; // Create an empty variable to hold errors

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $logInOrSignUp = isset($_POST["logIn"]) ? "login" : "signup";
    $username = $_POST["username"];
    $password = $_POST["password"];

    $filePath = "./account/account.json";
    $account = [];
    if (file_exists($filePath)) {
        $jsonContent = file_get_contents($filePath);
        $account = json_decode($jsonContent, true);
        if ($account === null) { $account = []; }
    }

    $alreadyExists = isset($account[$username]);

    if ($logInOrSignUp == "signup") {
        if ($alreadyExists) {
            $errorMsg = "Username already taken!"; // Store the error
        } else {
            $newUser = [
                "password" => $password,
                "mps" => 0,
                "total_mps" => 0,
                "current_mps" => 0,
                "last_save" => time(),
            ];
            for ($i = 1; $i <=15; $i++) {
                $newUser["building$i"] = 0;
            }
            $account[$username] = $newUser;
            file_put_contents($filePath, json_encode($account, JSON_PRETTY_PRINT));

            $_SESSION['username'] = $username;
            header("Location: game.php");
            exit();
        }
    } 

    if ($logInOrSignUp == "login") {
        if ($alreadyExists && $account[$username]['password'] === $password) {
            $_SESSION['username'] = $username;
            header("Location: game.php");
            exit();
        } else {
            $errorMsg = "Invalid username or password!"; // Store the error
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

    <div class="auth-card">
        <div class="card shadow-sm">
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
                        <button type="submit" name="createAccount" value="signup" class="btn btn-outline-secondary">Create Account</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="assets/bootstrap-5.3.8-dist/bootstrap-5.3.8-dist/js/bootstrap.min.js"></script>
</body>
</html>