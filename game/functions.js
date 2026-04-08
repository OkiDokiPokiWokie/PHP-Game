function formatNumber(numStr) {
    // 1. Force to string and remove any decimal points
    // Since your stringMath sometimes returns whole numbers as strings, 
    // we ensure we only look at the integer part.
    numStr = numStr.toString().split('.')[0];

    let len = numStr.length;

    // 2. If it's 3 digits or less (0-999), just return it
    if (len <= 3) {
        return numStr;
    }

    // 3. MASSIVE Suffix Array 
    // This list now goes from Thousand (k) to Centillion (Ct)
    var suffixes = [
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
    let tier = Math.floor((len - 1) / 3) - 1;

    // FIX: Safety check for suffix array bounds
    // Instead of 'if (tier >= suffixes.length) tier = suffixes.length - 1;'
    // We use Math.min to ensure we never grab an undefined index.
    let maxIndex = suffixes.length - 1;
    if (tier > maxIndex) {
        tier = maxIndex;
    }

    // 5. Calculate formatting
    let remainder = len % 3;
    let digitsBeforeDecimal = remainder === 0 ? 3 : remainder;

    // 6. Slice the string
    let intPart = numStr.slice(0, digitsBeforeDecimal);
    let fracPart = numStr.slice(digitsBeforeDecimal, digitsBeforeDecimal + 2);

    // 7. Final Assembly (e.g., "1.23Vg")
    return intPart + "." + fracPart + suffixes[tier];
}



function updateUI(shopList) {
    shopList.forEach((item) => {
        let nameEl = document.querySelector(`.shop-item${item.id}`);
        let descEl = document.querySelector(`.shop-item${item.id}-description`);
        let costEl = document.querySelector(`.shop-item${item.id}-cost`);
        let ownedEl = document.querySelector(`.shop-item${item.id}-owned`);

        if (nameEl) nameEl.innerHTML = `<strong>${item.name}</strong>`;
        if (descEl) descEl.innerText = item.description;

        // Use your custom formatter here instead of toLocaleString
        if (costEl) costEl.innerText = formatNumber(item.cost);

        // Using it here too, just in case 'owned' gets huge!
        if (ownedEl) ownedEl.innerText = formatNumber(item.owned);
    });
}




function saveGameJS(currentMoney, totalMoney, playTime, mps, clickValue, shopArray, timestamp) {
    const buildingSales = {};
    shopArray.forEach(item => {
        buildingSales["building" + item.id] = item.owned;
    });

    const saveData = {
        current_money: currentMoney,
        total_money: totalMoney,
        play_time: playTime,
        mps: mps,
        click_power: clickValue,
        last_save: timestamp,
        ...buildingSales
    };

    console.log("Auto-saving timestamp:", timestamp);

    fetch('game/save_game.php', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
    })
    .then(response => response.text())
    .then(result => {
        console.log("Server:", result);
    })
    .catch(error => {
        console.error("Save Error:", error);
    });
}






function stringMath(num1, num2, operator) {
    num1 = String(num1);
    num2 = String(num2);

    // 1. GLOBAL DECIMAL HANDLING (Strips decimals to make whole numbers)
    let decPlaces = 0;

    if (num1.includes('.')) {
        decPlaces += num1.length - num1.indexOf('.') - 1;
        num1 = num1.replace('.', '');
    }
    if (num2.includes('.')) {
        decPlaces += num2.length - num2.indexOf('.') - 1;
        num2 = num2.replace('.', '');
    }

    // --- INTERNAL HELPER: Pure String Multiplication ---
    function multiplyStrings(n1, n2) {
        if (n1 === "0" || n2 === "0") return "0";
        let resArray = new Array(n1.length + n2.length).fill(0);

        for (let i = n1.length - 1; i >= 0; i--) {
            for (let j = n2.length - 1; j >= 0; j--) {
                let d1 = n1.charCodeAt(i) - 48;
                let d2 = n2.charCodeAt(j) - 48;
                let mul = (d1 * d2) + resArray[i + j + 1];

                resArray[i + j + 1] = mul % 10;
                resArray[i + j] += Math.floor(mul / 10);
            }
        }
        let res = resArray.join('').replace(/^0+/, '');
        return res === "" ? "0" : res;
    }

    // 2. ADDITION
    if (operator === "+") {
        let res = "";
        let carry = 0;
        let i = num1.length - 1, j = num2.length - 1;

        while (i >= 0 || j >= 0 || carry > 0) {
            let digit1 = i >= 0 ? num1.charCodeAt(i--) - 48 : 0;
            let digit2 = j >= 0 ? num2.charCodeAt(j--) - 48 : 0;
            let sum = digit1 + digit2 + carry;
            carry = sum > 9 ? 1 : 0;
            res = (sum % 10) + res;
        }

        if (decPlaces > 0 && decPlaces < res.length) res = res.slice(0, -decPlaces);
        res = res === "" ? "0" : res;
        console.log(res);
        return res;
    }

    // 3. SUBTRACTION (Optimized with "-9" Sentinel Value)
    if (operator === "-") {
        // Check if num2 (cost) is strictly greater than num1 (money)
        if (num2.length > num1.length || (num1.length === num2.length && num2 > num1)) {
            console.log("-9"); 
            return "-9"; // Immediately return the sentinel value and skip the math!
        }

        let res = "";
        let borrow = 0;
        let i = num1.length - 1, j = num2.length - 1;

        while (i >= 0) {
            let digit1 = num1.charCodeAt(i--) - 48 - borrow;
            let digit2 = j >= 0 ? num2.charCodeAt(j--) - 48 : 0;
            if (digit1 < digit2) { digit1 += 10; borrow = 1; } else { borrow = 0; }
            res = (digit1 - digit2) + res;
        }

        res = res.replace(/^0+/, '');
        if (decPlaces > 0 && decPlaces < res.length) res = res.slice(0, -decPlaces);
        res = res === "" ? "0" : res;
        console.log(res);
        return res;
    }

    // 4. MULTIPLICATION
    if (operator === "*") {
        let res = multiplyStrings(num1, num2);

        if (decPlaces > 0) {
            if (decPlaces >= res.length) { console.log("0"); return "0"; }
            res = res.slice(0, -decPlaces);
        }
        console.log(res);
        return res;
    }

    // 5. EXPONENTIATION (**) WITH MASSIVE STRINGS
    if (operator === "**") {
        let base = num1; 
        let exp = num2; // No parseInt! Exponent is a full string.

        if (exp === "0") { console.log("1"); return "1"; }

        // --- INTERNAL HELPER: Divide a string by 2 ---
        function divideStringBy2(str) {
            let res = "";
            let carry = 0;
            for (let i = 0; i < str.length; i++) {
                let current = carry * 10 + (str.charCodeAt(i) - 48);
                res += Math.floor(current / 2);
                carry = current % 2;
            }
            return res.replace(/^0+/, '') || "0";
        }

        let result = "1";
        let currentBase = base;
        let currentExp = exp;

        // Binary Exponentiation Loop
        while (currentExp !== "0") {
            let lastDigit = currentExp.charCodeAt(currentExp.length - 1) - 48;

            // If the current exponent string is odd
            if (lastDigit % 2 !== 0) {
                result = multiplyStrings(result, currentBase);
            }

            // Square the base and divide exponent string by 2
            currentBase = multiplyStrings(currentBase, currentBase);
            currentExp = divideStringBy2(currentExp);
        }

        // Calculate total decimal places as a massive string
        let totalDecPlacesStr = multiplyStrings(String(decPlaces), exp);

        if (totalDecPlacesStr !== "0") {
            // Memory check: A JS string length is an integer. 
            // If the decimals to drop are larger than the string length, it's 0.
            if (totalDecPlacesStr.length > result.length || 
               (totalDecPlacesStr.length === result.length && totalDecPlacesStr >= result)) {
                console.log("0");
                return "0";
            }
            // Safe to parse only the slice count, because actual string length in RAM cannot exceed int bounds
            result = result.slice(0, -parseInt(totalDecPlacesStr));
        }

        console.log(result);
        return result;
    }

    console.log("0");
    return "0";
}

let one = "645365436345600";
let two = "70646456645645634564564564560";
let three = "-";

stringMath(one, two, three); // This will now log and return "-9"








