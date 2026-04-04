const moneyAmount = document.getElementById('moneyAmount');
const mps_display = document.getElementById('mps-display');
const codeButton = document.getElementById('codeButton');
const life_time_money = document.getElementById('life-time-money');
const total_time_played_seconds = document.getElementById('total-time-played-seconds');
const total_buildings_owned = document.getElementById('total-buildings-owned');
const money_per_click = document.getElementById('money-per-click');
const save_game_button = document.getElementById('save-game-button')





let mps = serverData.mps || "0";
let totalMoney = serverData.total_money || "0";
let currentMoney = serverData.current_money || "0";
let click = "50";
let clickMultiplier = "1";
let playTime = serverData.play_time || "0";
let cps = [];



//debug add money
const debugButtonMoney = document.querySelectorAll('.debug-btn-add-money');
debugButtonMoney.forEach(button => {
  button.addEventListener('click', function() {
    const itemId = this.dataset.id;

    if (itemId == 1) {
      currentMoney = stringMath(currentMoney, "100", "+");
      totalMoney = stringMath(totalMoney, "100", "+");
    } else if (itemId == 2) {
      currentMoney = stringMath(currentMoney, "1000", "+");
      totalMoney = stringMath(totalMoney, "1000", "+");
    } else if (itemId == 3) {
      currentMoney = stringMath(currentMoney, "1000000", "+");
      totalMoney = stringMath(totalMoney, "1000000", "+");
    }
    moneyAmount.innerText = formatNumber(currentMoney);
    life_time_money.innerText = formatNumber(totalMoney);
  });
});
//debug add money per click
const debugButtonMPC = document.querySelectorAll('.debug-btn-add-mpc');
debugButtonMPC.forEach(button => {
  button.addEventListener('click', function() {
    const itemId = this.dataset.id;

    if (itemId == 1) {
      click = stringMath(click, "1", "+");
    } else if (itemId == 2) {
      click = stringMath(click, "50", "+");
    } else if (itemId == 3) {
      click = stringMath(click, "250", "+");
    } else if (itemId == 4) {
      click = stringMath(click, "750", "+");
    } else if (itemId == 5) {
      click = stringMath(click, "1500", "+");
    }
    money_per_click.innerText = formatNumber(click);
  });
});
//debug add time
const debugButtonIncreasePlaytime = document.querySelectorAll('.debug-btn-playtime-increase');
debugButtonIncreasePlaytime.forEach(button => {
  button.addEventListener('click', function() {
    const itemId = this.dataset.id;

    if (itemId == 1) {
      playTime = 0;
    } else if (itemId == 2) {
      playTime = stringMath(playTime, "100", "+");
    } else if (itemId == 3) {
      playTime = stringMath(playTime, "10000", "+");
    } else if (itemId == 4) {
      playTime = stringMath(playTime, "10000000", "+");
    }
    total_time_played_seconds.innerText = playTime;
  });
});



// //force buttons    debug-btn-force-spawn-powerup          uncomment later on
// const debugButtonForceSpawnPowerup = document.querySelectorAll('.debug-btn-force-spawn-powerup');
// debugButtonForceSpawnPowerup.addEventListener('click', function() {
//   //spawnPowerup();
// });
// //force buttons    debug-btn-force critical-hit-time-period
// const debugButtonForceCriticalHitTimePeriod = document.querySelectorAll('.debug-btn-force-critical-hit-time-period');
// debugButtonForceCriticalHitTimePeriod.addEventListener('click', function() {
//   //criticalHitTimePeriod();
// });
                                                       
//save game button





moneyAmount.innerText = formatNumber(currentMoney);
mps_display.innerText = formatNumber(mps);
life_time_money.innerText = formatNumber(totalMoney);
total_time_played_seconds.innerText = playTime;
money_per_click.innerText = formatNumber(click);


let shop = [
  {
    name: "CPU",
    cost: "50",
    code: "1",
    description: "Gives you more CPU power to process more code",
    id: 1,
    owned: "0"
  },
  {
    name: "GPU",
    cost: "200",
    code: "2",
    description: "Boosts parallel processing for faster rendering",
    id: 2,
    owned: "0"
  },
  {
    name: "RAM",
    cost: "400",
    code: "8",
    description: "More memory to handle bigger projects",
    id: 3,
    owned: "0"
  },
  {
    name: "Storage SSD",
    cost: "800",
    code: "32",
    description: "Faster storage for quicker file access",
    id: 4,
    owned: "0"
  },
  {
    name: "Motherboard",
    cost: "1600",
    code: "128",
    description: "Connects all your components efficiently",
    id: 5,
    owned: "0"
  },
  {
    name: "Cooling System",
    cost: "3200",
    code: "512",
    description: "Prevents your CPU from overheating",
    id: 6,
    owned: "0"
  },
  {
    name: "Power Supply",
    cost: "6400",
    code: "2048",
    description: "Keeps all components powered reliably",
    id: 7,
    owned: "0"
  },
  {
    name: "Network Card",
    cost: "12800",
    code: "8192",
    description: "Faster network connections for online coding",
    id: 8,
    owned: "0"
  },
  {
    name: "Monitor",
    cost: "25600",
    code: "32768",
    description: "See all your code clearly",
    id: 9,
    owned: "0"
  },
  {
    name: "Mechanical Keyboard",
    cost: "51200",
    code: "131072",
    description: "Type faster and more accurately",
    id: 10,
    owned: "0"
  },
  {
    name: "Mouse",
    cost: "102400",
    code: "524288",
    description: "Precise control for your interface",
    id: 11,
    owned: "0"
  },
  {
    name: "AI Assistant",
    cost: "204800",
    code: "2097152",
    description: "Helps automate coding tasks",
    id: 12,
    owned: "0"
  },
  {
    name: "Virtual Server",
    cost: "409600",
    code: "8388608",
    description: "Run your projects in the cloud",
    id: 13,
    owned: "0"
  },
  {
    name: "Database Server",
    cost: "819200",
    code: "33554432",
    description: "Stores huge amounts of data efficiently",
    id: 14,
    owned: "0"
  },
  {
    name: "Employee: Junior Coder",
    cost: "1638400",
    code: "134217728",
    description: "Writes basic code automatically",
    id: 15,
    owned: "0"
  }
];



function purcahseItem(itemId) {
      let item = shop.find(item => item.id == itemId)
      if (currentMoney >= item.cost) {
        currentMoney -= item.cost;
        item.owned = stringMath(item.owned, "1", "+");
        if (item.id == 1) {
          click = stringMath(click, "1", "+");;
        } else if (item.id == 5) {
          click = stringMath(click, "50", "+");
        } else if (item.id == 10) {
          click = stringMath(click, "100", "+");
        } else if (item.id == 11) {
          click = stringMath(click, "1000", "+");
        } else {
          mps = stringMath(mps, item.code, "+");
        }

        item.cost = stringMath(item.cost, "1.15", "*")
        updateUI(shop);
        return(item.code);
      }
  return("0");
}


// Level 2: Collaborative - Attaching listeners to multiple shop buttons
const shopButtons = document.querySelectorAll('.shop-btn');
//initial buildings owned update
let totalOwned = "0";
function updateBuildingsOwned() {
  totalOwned = "0";
  shop.forEach(item => {
    totalOwned = stringMath(totalOwned, item.owned, "+");
  });
  console.log(totalOwned)
  total_buildings_owned.innerText = formatNumber(totalOwned);
}

// Loop through each button found in the NodeList
shopButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 'this' refers to the specific button that was clicked
      const itemId = this.dataset.id;

      mps = stringMath(mps, purcahseItem(itemId), "+");
      moneyAmount.innerText = formatNumber(currentMoney);
      mps_display.innerText = formatNumber(mps);
      // Iterate through every object in the shop array
      totalOwned = "0";
      updateBuildingsOwned();
      
    });
});


shop.forEach((item, index) => {
    let buildingKey = "building" + item.id;

    // 1. Get how many the user owns from the server data (as a string)
    item.owned = serverData[buildingKey] || "0";

    // 2. Scale the cost using the string-safe exponent logic
    if (item.owned !== "0") {
        // We calculate: BaseCost * (1.15 ** owned)

        // First, get the growth multiplier (e.g., 1.15 to the power of 500)
        let growthMultiplier = stringMath("1.15", item.owned, "**");

        // Second, multiply the base cost by that growth factor
        item.cost = stringMath(item.cost, growthMultiplier, "*");
    }
});




updateUI(shop);
updateBuildingsOwned();




function codeButtonClick() {
  let tempCurrentMoney = stringMath(click, clickMultiplier, "*");
  currentMoney = stringMath(currentMoney, tempCurrentMoney, "+");
  let tempTotalMoney = stringMath(click, clickMultiplier, "*");
  totalMoney = stringMath(totalMoney, tempTotalMoney, "+");

  moneyAmount.innerText = formatNumber(currentMoney);
  cps.push(Date.now());
}


codeButton.addEventListener('click', () => {
    codeButtonClick();
});

// Level 1 - Snippets and Explanation: Functional spacebar listener.
window.addEventListener('keydown', function(event) {
    if (event.key === " ") {
        // Prevents the window from jumping down when space is pressed
        event.preventDefault();

        codeButtonClick();
    }
});



save_game_button.addEventListener('click', () => {
  saveGameJS(currentMoney, totalMoney, playTime, mps, click, shop, String(Date.now()));
});

let saveTime = "0";
setInterval(function() {
  //game logic updates
  currentMoney = stringMath(currentMoney, mps, "+");
  totalMoney = stringMath(totalMoney, mps, "+");
  playTime = stringMath(playTime, "1", "+");

  //visual updates
  moneyAmount.innerText = formatNumber(currentMoney);
  life_time_money.innerText = formatNumber(totalMoney);
  total_time_played_seconds.innerText = playTime;
  money_per_click.innerText = formatNumber(click);


  //save game
  saveTime = stringMath(saveTime, "1", "+");
  if (saveTime == "30" || saveTime == "31") {
    saveGameJS(currentMoney, totalMoney, playTime, mps, click, shop, String(Date.now()));
    saveTime = "0";
  }



  //clean up cps array
  for (let i = cps.length - 1; i >= 0; i--) {
      if (cps[i] < Date.now() - 1000) {
          cps.splice(i, 1);
      }
  }
  console.log("CPS: " + cps);

  //critical hit calculation
  if (cps.length >= 5){
    clickMultiplier = "1.2";
    console.log("FAST CLICK| Current CPS: " + cps.length);
  } else {
    clickMultiplier = "1";
    console.log("standard click");
  }






  


}, 1000)




