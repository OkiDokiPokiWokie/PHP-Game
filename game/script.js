const moneyAmount = document.getElementById('moneyAmount');
const mps_display = document.getElementById('mps-display');
const codeButton = document.getElementById('codeButton');
const life_time_money = document.getElementById('life-time-money');
const total_time_played_seconds = document.getElementById('total-time-played-seconds');
const total_buildings_owned = document.getElementById('total-buildings-owned');
const money_per_click = document.getElementById('money-per-click');

// Level 2: Collaborative - Attaching listeners to multiple shop buttons
const shopButtons = document.querySelectorAll('.shop-btn');



let mps = serverData.mps || 0;
let totalMoney = serverData.total_money || 0;
let currentMoney = serverData.current_money || 0;
let click = 50;
let clickMultiplier = 1;
let playTime = serverData.play_time || 0;


moneyAmount.innerText = formatNumber(currentMoney);

let shop = [
  {
    name: "CPU",
    cost: 50,
    code: 1,
    description: "Gives you more CPU power to process more code",
    id: 1,
    owned: 0
  },
  {
    name: "GPU",
    cost: 200,
    code: 2,
    description: "Boosts parallel processing for faster rendering",
    id: 2,
    owned: 0
  },
  {
    name: "RAM",
    cost: 400,
    code: 8,
    description: "More memory to handle bigger projects",
    id: 3,
    owned: 0
  },
  {
    name: "Storage SSD",
    cost: 800,
    code: 32,
    description: "Faster storage for quicker file access",
    id: 4,
    owned: 0
  },
  {
    name: "Motherboard",
    cost: 1600,
    code: 128,
    description: "Connects all your components efficiently",
    id: 5,
    owned: 0
  },
  {
    name: "Cooling System",
    cost: 3200,
    code: 512,
    description: "Prevents your CPU from overheating",
    id: 6,
    owned: 0
  },
  {
    name: "Power Supply",
    cost: 6400,
    code: 2048,
    description: "Keeps all components powered reliably",
    id: 7,
    owned: 0
  },
  {
    name: "Network Card",
    cost: 12800,
    code: 8192,
    description: "Faster network connections for online coding",
    id: 8,
    owned: 0
  },
  {
    name: "Monitor",
    cost: 25600,
    code: 32768,
    description: "See all your code clearly",
    id: 9,
    owned: 0
  },
  {
    name: "Mechanical Keyboard",
    cost: 51200,
    code: 131072,
    description: "Type faster and more accurately",
    id: 10,
    owned: 0
  },
  {
    name: "Mouse",
    cost: 102400,
    code: 524288,
    description: "Precise control for your interface",
    id: 11,
    owned: 0
  },
  {
    name: "AI Assistant",
    cost: 204800,
    code: 2097152,
    description: "Helps automate coding tasks",
    id: 12,
    owned: 0
  },
  {
    name: "Virtual Server",
    cost: 409600,
    code: 8388608,
    description: "Run your projects in the cloud",
    id: 13,
    owned: 0
  },
  {
    name: "Database Server",
    cost: 819200,
    code: 33554432,
    description: "Stores huge amounts of data efficiently",
    id: 14,
    owned: 0
  },
  {
    name: "Employee: Junior Coder",
    cost: 1638400,
    code: 134217728,
    description: "Writes basic code automatically",
    id: 15,
    owned: 0
  }
];



function purcahseItem(itemId) {
      let item = shop.find(item => item.id == itemId)
      if (currentMoney >= item.cost) {
        currentMoney -= item.cost;
        item.owned += 1;
        if (item.id == 1) {
          click += 1
        } else if (item.id == 5) {
          click += 50
        } else if (item.id == 10) {
          click += 100
        } else if (item.id == 11) {
          click += 1000
        } else {
          mps += item.code;
        }

        item.cost = Math.floor(item.cost * 1.15)
        updateUI(shop);
        return(item.code);
      }
  return(0);
}


// Loop through each button found in the NodeList
shopButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 'this' refers to the specific button that was clicked
      const itemId = this.dataset.id;

      mps += purcahseItem(itemId);
      moneyAmount.innerText = formatNumber(currentMoney);
      mps_display.innerText = formatNumber(mps);
      // Iterate through every object in the shop array
      let totalOwned = 0;
      shop.forEach(item => {
          // Increment the counter by the amount owned of this specific item
          totalOwned += item.owned;
      });
      total_buildings_owned.innerText = formatNumber(totalOwned);
    });
});


shop.forEach((item, index) => {
  let buildingKey = "building" + item.id;
  item.owned = serverData[buildingKey] || 0;

  if (item.owned > 0) {
      item.cost = Math.floor(item.cost * (1.15 ** item.owned));
  }
});


updateUI(shop);




function codeButtonClick() {
  currentMoney += click * clickMultiplier;
  totalMoney += click * clickMultiplier;

  moneyAmount.innerText = formatNumber(currentMoney);
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





setInterval(function() {
  //game logic updates
  currentMoney += mps;
  totalMoney += mps;playTime += 1;

  //visual updates
  moneyAmount.innerText = formatNumber(currentMoney);
  life_time_money.innerText = formatNumber(totalMoney);
  total_time_played_seconds.innerText = playTime;
  money_per_click.innerText = formatNumber(click);
}, 1000)




