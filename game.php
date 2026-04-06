<?php
session_start();

// Redirect if not logged in
if (!isset($_SESSION['username'])) {
    header("Location: index.php");
    exit();
}

$username = $_SESSION['username'];
$filePath = "./account/account.json";
$userData = [];

if (file_exists($filePath)) {
    $allAccounts = json_decode(file_get_contents($filePath), true);
    // Grab only this user's data
    $userData = $allAccounts[$username] ?? [];
}
?>



    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Coding Clicker</title>
    <link rel="stylesheet" href="game/game.css">
    <link rel="stylesheet" href="assets/bootstrap-5.3.8-dist/bootstrap-5.3.8-dist/css/bootstrap.min.css">
</head>
<body class="bg-dark text-white">



    <div class="container-fluid main-container p-0">
        <div class="row h-100 g-0">

            <div class="col-4 border-end border-secondary p-0 d-flex flex-column">
                <div class="p-3 bg-dark text-success border-bottom border-secondary text-center">
                    <h3 class="mb-0">TERMINAL.SYS</h3>
                </div>

                <div class="d-flex flex-column align-items-center mt-5">
                    <h3 class="text-success mb-0 text-center">
                        $<span id="moneyAmount">0</span>
                    </h3>
                    <h3 class="text-success mb-0 text-center">
                        MPS: <span id="mps-display">0</span>
                    </h3>
                    <button class="btn codeButtonContainer"> 
                        <img src="game/assets/keyboard.png" alt="codeButton" id="codeButton" class="codeButton" width="300">
                    </button>
                    <h3 class="text-success mb-0 text-center">
                        <span id="critical-hit-count-down">Critical Hit In 120</span>
                    </h3>
                </div>
            </div>

            <div class="col-4 border-end border-secondary p-0 d-flex flex-column">
                <div class="p-3 bg-dark text-success border-bottom border-secondary text-center">
                    <h3 class="mb-0">TERMINAL.SYS</h3>
                </div>
                <div class="d-flex flex-grow-1 align-items-center justify-content-center">
                    <div class="text-success mb-0 text-center">
                        <a class="btn btn-outline-success text-start py-3" href="leaderboard.php" target="_blank">
                            Leaderboard
                        </a>
                        <br>
                        <br>
                        <button class="btn btn-outline-success text-start py-3" id="save-game-button">
                            Save game
                        </button>
                        <br>
                        <br>
                        <h2>Stats Menu</h2>
                        Life Time Money: <span id="life-time-money">0</span>
                        <br>
                        Time Played Seconds: <span id="total-time-played-seconds">0</span>
                        <br>
                        Total Upgrades: <span id="total-buildings-owned">0</span>
                        <br>
                        Money Per Click: <span id="money-per-click">1</span>
                        <br>
                        <br>
                        <h2>Debug Menu</h2>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-add-money" id="extra-money1" data-id="1">
                            +$100
                        </button>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-add-money" id="extra-money2" data-id="2">
                            +$1000
                        </button>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-add-money" id="extra-money3" data-id="3">
                            +$1000000
                        </button>
                        <br>
                        <br>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-add-mpc" id="click-amount1" data-id="1">
                            1 MPC
                        </button>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-add-mpc" id="click-amount2" data-id="2">
                            50 MPC
                        </button>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-add-mpc" id="click-amount3" data-id="3">
                            250 MPC
                        </button>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-add-mpc" id="click-amount4" data-id="4">
                            750 MPC
                        </button>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-add-mpc" id="click-amount5" data-id="5">
                            1500 MPC
                        </button>
                        <br>
                        <br>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-playtime-increase" id="increase-time-played1" data-id="1">
                            0 Seconds
                        </button>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-playtime-increase" id="increase-time-played2" data-id="2">
                            +100 Seconds
                        </button>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-playtime-increase" id="increase-time-played3" data-id="3">
                            +10000 Seconds
                        </button>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-playtime-increase" id="increase-time-played4" data-id="4">
                            +10000000 Seconds
                        </button>
                        <br>
                        <br>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-force-spawn-powerup" id="force-spawn-powerup">
                            Force Spawn Powerup
                        </button>
                        <button class="btn btn-outline-success text-start py-3 debug-btn-force critical-hit-time-period" id="force-critical-hit">
                            Set Up Critical Hit
                        </button>
                    </div>
                </div>
            </div>

            <aside class="col-4 d-flex flex-column p-0">
                <div class="p-3 bg-dark text-success border-bottom border-secondary text-center">
                    <h3 class="mb-0">RESOURCES.EXE</h3>
                </div>

                <div class="shop-list flex-grow-1 p-3" style="overflow-y: auto;">
                    <div class="d-grid gap-2">

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='1'>
                            <div class="shop-item1"><strong>Item 1</strong></div>
                            <div class="shop-item1-description">Description for item 1</div>
                            <small>Cost: <span class="shop-item1-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item1-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='2'>
                            <div class="shop-item2"><strong>Item 2</strong></div>
                            <div class="shop-item2-description">Description for item 2</div>
                            <small>Cost: <span class="shop-item2-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item2-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='3'>
                            <div class="shop-item3"><strong>Item 3</strong></div>
                            <div class="shop-item3-description">Description for item 3</div>
                            <small>Cost: <span class="shop-item3-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item3-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='4'>
                            <div class="shop-item4"><strong>Item 4</strong></div>
                            <div class="shop-item4-description">Description for item 4</div>
                            <small>Cost: <span class="shop-item4-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item4-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='5'>
                            <div class="shop-item5"><strong>Item 5</strong></div>
                            <div class="shop-item5-description">Description for item 5</div>
                            <small>Cost: <span class="shop-item5-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item5-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='6'>
                            <div class="shop-item6"><strong>Item 6</strong></div>
                            <div class="shop-item6-description">Description for item 6</div>
                            <small>Cost: <span class="shop-item6-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item6-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='7'>
                            <div class="shop-item7"><strong>Item 7</strong></div>
                            <div class="shop-item7-description">Description for item 7</div>
                            <small>Cost: <span class="shop-item7-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item7-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='8'>
                            <div class="shop-item8"><strong>Item 8</strong></div>
                            <div class="shop-item8-description">Description for item 8</div>
                            <small>Cost: <span class="shop-item8-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item8-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='9'>
                            <div class="shop-item9"><strong>Item 9</strong></div>
                            <div class="shop-item9-description">Description for item 9</div>
                            <small>Cost: <span class="shop-item9-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item9-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='10'>
                            <div class="shop-item10"><strong>Item 10</strong></div>
                            <div class="shop-item10-description">Description for item 10</div>
                            <small>Cost: <span class="shop-item10-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item10-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='11'>
                            <div class="shop-item11"><strong>Item 11</strong></div>
                            <div class="shop-item11-description">Description for item 11</div>
                            <small>Cost: <span class="shop-item11-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item11-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='12'>
                            <div class="shop-item12"><strong>Item 12</strong></div>
                            <div class="shop-item12-description">Description for item 12</div>
                            <small>Cost: <span class="shop-item12-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item12-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='13'>
                            <div class="shop-item13"><strong>Item 13</strong></div>
                            <div class="shop-item13-description">Description for item 13</div>
                            <small>Cost: <span class="shop-item13-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item13-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='14'>
                            <div class="shop-item14"><strong>Item 14</strong></div>
                            <div class="shop-item14-description">Description for item 14</div>
                            <small>Cost: <span class="shop-item14-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item14-owned">0</span></small>
                        </button>

                        <button class="btn btn-outline-success text-start py-3 shop-btn" data-id='15'>
                            <div class="shop-item15"><strong>Item 15</strong></div>
                            <div class="shop-item15-description">Description for item 15</div>
                            <small>Cost: <span class="shop-item15-cost">100</span></small><br>
                            <small>Owned: <span class="shop-item15-owned">0</span></small>
                        </button>

                    </div>
                </div>
            </aside>

        </div>
    </div>


  
  <script src="assets/bootstrap-5.3.8-dist/bootstrap-5.3.8-dist/js/bootstrap.min.js"></script>
  
  <script src="game/functions.js" defer></script>
  <script>
    // Use PHP to "echo" the JSON directly into a JS variable
    const serverData = <?php echo json_encode($userData); ?>;
  </script>
  <script src="game/script.js" defer></script>
</body>
</html>