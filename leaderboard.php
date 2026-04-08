<?php
    session_start();

    // 1. Include our heavy-lifting functions
    require_once 'functions.php';

    // 2. Define allowed filters and grab the current one (default to total_money)
    $allowedFilters = ['total_money', 'current_money', 'play_time', 'total_buildings'];
    $currentFilter = isset($_GET['filter']) && in_array($_GET['filter'], $allowedFilters) ? $_GET['filter'] : 'total_money';

    // 3. Load and Decode the JSON Data
    $jsonPath = 'account/account.json';
    $usersData = [];
    if (file_exists($jsonPath)) {
        $jsonData = file_get_contents($jsonPath);
        $usersData = json_decode($jsonData, true) ?? [];
    }

    $validUsers = [];

    // 4. Process each user
    foreach ($usersData as $username => $userData) {
        // Calculate total buildings and inject it into the user's data array
        $userData['total_buildings'] = calculateTotalBuildings($userData);
        
        // Inject the username so we have it for the table
        $userData['username'] = $username;

        // 5. The Purge: Only keep users who actually have more than "0" in the filtered stat
        // This prevents the server from doing heavy sorting on brand new or empty accounts
        $targetStat = (string)$userData[$currentFilter];
        if ($targetStat !== "0" && $targetStat !== "") {
            $validUsers[] = $userData;
        }
    }

    // 6. The Sort: Use our custom string math function
    usort($validUsers, function($a, $b) use ($currentFilter) {
        return compareLargeNumbers($a[$currentFilter], $b[$currentFilter]);
    });

    // 7. The Cut: Keep only the Top 100
    $top100 = array_slice($validUsers, 0, 100);

    // Helper function for the HTML UI to map filter keys to readable column names
    function getFilterName($filter) {
        switch($filter) {
            case 'current_money': return "Current Money";
            case 'play_time': return "Time Played";
            case 'total_buildings': return "Total Buildings";
            case 'total_money':
            default: return "Lifetime Money";
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Coding Clicker - Leaderboard</title>
    <link rel="stylesheet" href="game/game.css">
    <link rel="stylesheet" href="assets/bootstrap-5.3.8-dist/bootstrap-5.3.8-dist/css/bootstrap.min.css">
    <style>
        /* A little extra terminal flavor */
        .terminal-header { border-bottom: 2px solid #198754; }
        .table-dark { --bs-table-bg: #212529; --bs-table-border-color: #198754; }
        .highlight-col { background-color: rgba(25, 135, 84, 0.1) !important; }
    </style>
</head>
<body class="bg-dark text-white">

    <nav class="navbar navbar-dark bg-dark terminal-header mb-4 px-4">
        <a class="navbar-brand text-success fw-bold" href="game.php">> Coding_Clicker.exe</a>
        <div>
            <a href="game.php" class="btn btn-outline-success btn-sm me-2">Return to Terminal</a>
            <a href="about.php" class="btn btn-outline-success btn-sm">About / Docs</a>
        </div>
    </nav>

    <div class="container mb-5">
        <h1 class="text-success text-center mb-4">> MAIN_FRAME_LEADERBOARD</h1>

        <div class="d-flex justify-content-center mb-4">
            <div class="btn-group" role="group" aria-label="Leaderboard Filters">
                <a href="?filter=total_money" class="btn <?= $currentFilter === 'total_money' ? 'btn-success' : 'btn-outline-success' ?>">Lifetime Money</a>
                <a href="?filter=current_money" class="btn <?= $currentFilter === 'current_money' ? 'btn-success' : 'btn-outline-success' ?>">Current Money</a>
                <a href="?filter=total_buildings" class="btn <?= $currentFilter === 'total_buildings' ? 'btn-success' : 'btn-outline-success' ?>">Total Buildings</a>
                <a href="?filter=play_time" class="btn <?= $currentFilter === 'play_time' ? 'btn-success' : 'btn-outline-success' ?>">Time Played</a>
            </div>
        </div>

        <h4 class="text-secondary mb-3">Sort by: <span class="text-white"><?= getFilterName($currentFilter) ?></span></h4>

        <div class="table-responsive">
            <table class="table table-dark table-striped table-hover border-success align-middle">
                <thead>
                    <tr>
                        <th class="text-success">Rank</th>
                        <th class="text-success">User</th>
                        <th class="<?= $currentFilter === 'total_money' ? 'text-white' : 'text-success' ?>">Lifetime Money</th>
                        <th class="<?= $currentFilter === 'current_money' ? 'text-white' : 'text-success' ?>">Current Money</th>
                        <th class="<?= $currentFilter === 'total_buildings' ? 'text-white' : 'text-success' ?>">Total Buildings</th>
                        <th class="<?= $currentFilter === 'play_time' ? 'text-white' : 'text-success' ?>">Time Played</th>
                    </tr>
                </thead>
                <tbody class="font-monospace">
                    <?php if (count($top100) > 0): ?>
                        <?php foreach ($top100 as $index => $user): ?>
                            <tr>
                                <td>#<?= $index + 1 ?></td>
                                
                                <td><span class="text-success">@</span><?= htmlspecialchars($user['username']) ?></td>
                                
                                <td class="<?= $currentFilter === 'total_money' ? 'highlight-col fw-bold' : '' ?>">
                                    $<?= PHPformatNumber($user['total_money']) ?>
                                </td>
                                
                                <td class="<?= $currentFilter === 'current_money' ? 'highlight-col fw-bold' : '' ?>">
                                    $<?= PHPformatNumber($user['current_money']) ?>
                                </td>
                                
                                <td class="<?= $currentFilter === 'total_buildings' ? 'highlight-col fw-bold' : '' ?>">
                                    <?= PHPformatNumber($user['total_buildings']) ?>
                                </td>
                                
                                <td class="<?= $currentFilter === 'play_time' ? 'highlight-col fw-bold' : '' ?>">
                                    <?= formatTime($user['play_time']) ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="6" class="text-center text-secondary py-4">No data found for this category. Start clicking!</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="assets/bootstrap-5.3.8-dist/bootstrap-5.3.8-dist/js/bootstrap.min.js"></script>
</body>
</html>