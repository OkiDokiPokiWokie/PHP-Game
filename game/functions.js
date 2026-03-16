function formatNumber(num) {
    // Numbers less than or equal to 999 are rounded to the nearest hundredth
    if (num <= 999) {
        return num.toFixed(2);
    }

    // Define suffixes for large numbers, starting from thousands ("k")
    var suffixes = [
        "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc",
        "UnDc", "DuDc", "TrDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc",
        "Vg"
    ];

    // Determine the tier (or index) of the suffix, starting from thousands (1,000)
    var tier = Math.floor(Math.log(num) / Math.log(1000)) - 1;

    // Prevent the tier from exceeding the length of the suffix array
    if (tier >= suffixes.length) {
        tier = suffixes.length - 1;
    }

    // Scale the number down
    var scaled = num / Math.pow(1000, tier + 1);

    // Return the formatted number with the suffix
    return scaled.toFixed(2) + suffixes[tier];
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