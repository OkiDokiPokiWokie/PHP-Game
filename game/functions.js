function formatNumber(numStr) {
    // 1. Force to string and remove any decimal points if they exist
    // (Your stringMath multiplication sometimes leaves them at the end)
    numStr = numStr.toString().split('.')[0];

    let len = numStr.length;

    // 2. If it's 3 digits or less (0-999), just return it
    if (len <= 3) {
        return numStr;
    }

    var suffixes = [
        "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc",
        "UnDc", "DuDc", "TrDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc",
        "Vg"
    ];

    // 3. Determine the tier
    // Length 4,5,6 = tier 0 (k)
    // Length 7,8,9 = tier 1 (M)
    let tier = Math.floor((len - 1) / 3) - 1;

    // Safety check for suffix array bounds
    if (tier >= suffixes.length) tier = suffixes.length - 1;

    // 4. Find where the decimal point goes
    // This calculates how many digits are "in front" of the decimal.
    // Example: "10000" (len 5). 5 % 3 is 2. So "10.00k"
    // If len % 3 is 0, it means there are 3 digits in front (e.g., 100k)
    let remainder = len % 3;
    let digitsBeforeDecimal = remainder === 0 ? 3 : remainder;

    // 5. Slice the string
    let intPart = numStr.slice(0, digitsBeforeDecimal);
    let fracPart = numStr.slice(digitsBeforeDecimal, digitsBeforeDecimal + 2);

    // 6. Final Assembly
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

    // 3. SUBTRACTION
    if (operator === "-") {
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








