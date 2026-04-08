<?php

function formatTime($secondsStr) {
    // Convert the string to a standard PHP integer
    $totalSeconds = (int)$secondsStr;

    if ($totalSeconds <= 0) {
        return "0s";
    }

    // Calculate time chunks
    $days = floor($totalSeconds / 86400);
    $hours = floor(($totalSeconds % 86400) / 3600);
    $minutes = floor(($totalSeconds % 3600) / 60);
    $seconds = $totalSeconds % 60;

    // Build the output string dynamically (only showing days/hours if they exist)
    $timeString = "";
    if ($days > 0) {
        $timeString .= $days . "d ";
    }
    if ($hours > 0 || $days > 0) {
        $timeString .= $hours . "h ";
    }
    if ($minutes > 0 || $hours > 0 || $days > 0) {
        $timeString .= $minutes . "m ";
    }
    $timeString .= $seconds . "s";

    return trim($timeString);
}







function PHPformatNumber($numStr) {
    // 1. Force to string and remove any decimal points
    // Explode breaks the string at the decimal, and [0] grabs the integer part.
    $parts = explode('.', (string)$numStr);
    $numStr = $parts[0];

    // Catch scientific notation just in case
    if (strpos($numStr, 'E') !== false || strpos($numStr, 'e') !== false) {
        return $numStr;
    }

    $len = strlen($numStr);

    // 2. If it's 3 digits or less (0-999), just return it
    if ($len <= 3) {
        return $numStr;
    }

    // 3. MASSIVE Suffix Array 
    $suffixes = [
        "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc",
        "UnDc", "DuDc", "TrDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc",
        "Vg", "UnVg", "DuVg", "TrVg", "QaVg", "QiVg", "SxVg", "SpVg", "OcVg", "NoVg",
        "Tg", "UnTg", "DuTg", "TrTg", "QaTg", "QiTg", "SxTg", "SpTg", "OcTg", "NoTg",
        "Qd", "UnQd", "DuQd", "TrQd", "QaQd", "QiQd", "SxQd", "SpQd", "OcQd", "NoQd",
        "Qt", "UnQt", "DuQt", "TrQt", "QaQt", "QiQt", "SxQt", "SpQt", "OcQt", "NoQt",
        "St", "UnSt", "DuSt", "TrSt", "QaSt", "QiSt", "SxSt", "SpSt", "OcSt", "NoSt",
        "Sept", "UnSe", "DuSe", "TrSe", "QaSe", "QiSe", "SxSe", "SpSe", "OcSe", "NoSe",
        "Ot", "UnOt", "DuOt", "TrOt", "QaOt", "QiOt", "SxOt", "SpOt", "OcOt", "NoOt",
        "Nt", "UnNt", "DuNt", "TrNt", "QaNt", "QiNt", "SxNt", "SpNt", "OcNt", "NoNt",
        "Ct" 
    ];

    // 4. Determine the tier
    $tier = (int)floor(($len - 1) / 3) - 1;

    // 5. Safety check for suffix array bounds using min()
    $maxIndex = count($suffixes) - 1;
    $tier = min($tier, $maxIndex);

    // 6. Calculate formatting
    $remainder = $len % 3;
    $digitsBeforeDecimal = ($remainder === 0) ? 3 : $remainder;

    // 7. Slice the string
    $intPart = substr($numStr, 0, $digitsBeforeDecimal);
    $fracPart = substr($numStr, $digitsBeforeDecimal, 2);

    // 8. Final Assembly
    return $intPart . "." . $fracPart . $suffixes[$tier];
}













function compareLargeNumbers($a, $b) {
    // Ensure both are strings
    $a = (string)$a;
    $b = (string)$b;

    $lenA = strlen($a);
    $lenB = strlen($b);

    // 1. Compare Lengths First
    // If $a is longer, it's a bigger number. Return -1 to push it to the top.
    if ($lenA > $lenB) {
        return -1;
    } 
    if ($lenA < $lenB) {
        return 1;
    }

    // 2. Compare Character-by-Character
    // If lengths are exactly the same, strcmp takes over perfectly.
    // strcmp returns < 0 if $a is less than $b, > 0 if $a is greater.
    $comparison = strcmp($a, $b);

    if ($comparison > 0) {
        return -1; // $a is greater, move it up
    } elseif ($comparison < 0) {
        return 1;  // $b is greater, move it down
    } else {
        return 0;  // They are exactly equal
    }
}

















// Helper function to add two string numbers safely in PHP
// Helper function to add two string numbers safely in PHP
// Helper function to add two string numbers safely in PHP
function addStringNumbers($num1, $num2) {
    $num1 = (string)$num1;
    $num2 = (string)$num2;
    $res = "";
    $carry = 0;

    $i = strlen($num1) - 1;
    $j = strlen($num2) - 1;

    // Loop from right to left, adding single digits together
    while ($i >= 0 || $j >= 0 || $carry > 0) {
        $digit1 = $i >= 0 ? (int)$num1[$i--] : 0;
        $digit2 = $j >= 0 ? (int)$num2[$j--] : 0;

        $sum = $digit1 + $digit2 + $carry;
        $carry = $sum > 9 ? 1 : 0;
        $res = ($sum % 10) . $res;
    }

    // Remove leading zeros. If the string is empty afterward, return "0"
    $cleaned = ltrim($res, '0');
    return $cleaned === "" ? "0" : $cleaned;
}

// Function to calculate total buildings
function calculateTotalBuildings($userArray) {
    $total = "0";

    // Loop through building1 to building15
    for ($i = 1; $i <= 15; $i++) {
        $buildingKey = 'building' . $i;

        // Check if the building exists in the user's save data
        if (isset($userArray[$buildingKey])) {
            $amount = (string)$userArray[$buildingKey];
            // Add the current building amount to our running total using string math
            $total = addStringNumbers($total, $amount);
        }
    }

    return $total;
}





















