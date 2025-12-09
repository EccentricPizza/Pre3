// ------------------ Location ------------------

function selectLocation(loc) {
  localStorage.setItem("location", loc);
  window.location = "menu.html";
}

window.onload = () => {
  const loc = localStorage.getItem("location");
  if (document.getElementById("location-display") && loc) {
    document.getElementById("location-display").innerText = `Location: ${loc}`;
  }

  loadBasket();
  loadFinalBasket();
  generateTimeslots();
};

// ------------------ Tabs ------------------

function openTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

  event.target.classList.add("active");
  document.getElementById(tab).classList.add("active");
}

// ------------------ Basket Logic ------------------

let basket = JSON.parse(localStorage.getItem("basket") || "[]");

function addItem(name, price, options = null) {
  let selectedOption = null;

  if (options) {
    let optNames = options.map(o => o.name).join("\n");
    let choice = prompt(`Choose option:\n${optNames}\n(or Cancel)`);
    let match = options.find(o => o.name === choice);
    if (match) selectedOption = match;
  }

  basket.push({ name, price, option: selectedOption });
  saveBasket();
  loadBasket();
}

function saveBasket() {
  localStorage.setItem("basket", JSON.stringify(basket));
}

function loadBasket() {
  const list = document.getElementById("basket-list");
  const totalBox = document.getElementById("total");
  if (!list) return;

  list.innerHTML = "";
  let total = 0;

  basket.forEach((item, i) => {
    let extra = item.option ? ` (+£${item.option.price})` : "";
    let li = document.createElement("li");
    li.innerHTML = `${item.name}${extra} — £${item.price + (item.option?.price || 0)}
      <button onclick="removeItem(${i})">X</button>`;
    list.appendChild(li);
    total += item.price + (item.option?.price || 0);
  });

  totalBox.innerText = `Total: £${total.toFixed(2)}`;
}

function removeItem(index) {
  basket.splice(index, 1);
  saveBasket();
  loadBasket();
}

function goToCheckout() {
  window.location = "checkout.html";
}

// ------------------ Final Checkout Page ------------------

function loadFinalBasket() {
  const list = document.getElementById("final-basket");
  const totalBox = document.getElementById("final-total");
  if (!list) return;

  let total = 0;
  list.innerHTML = "";

  basket.forEach(item => {
    let extra = item.option ? ` (+£${item.option.price})` : "";
    let li = document.createElement("li");
    li.innerText = `${item.name}${extra} — £${item.price + (item.option?.price || 0)}`;
    list.appendChild(li);

    total += item.price + (item.option?.price || 0);
  });

  totalBox.innerText = `Total: £${total.toFixed(2)}`;
}

// ------------------ Timeslots ------------------

function generateTimeslots() {
  const timeSelect = document.getElementById("time");
  if (!timeSelect) return;

  const start = 16 * 60 + 10; // 16:10
  const end = 20 * 60 + 50; // 20:50

  for (let m = start; m <= end; m += 10) {
    let hrs = Math.floor(m / 60);
    let mins = (m % 60).toString().padStart(2, "0");
    let t = `${hrs}:${mins}`;
    let opt = document.createElement("option");
    opt.value = t;
    opt.innerText = t;
    timeSelect.appendChild(opt);
  }
}

function validateDate() {
  const dateInput = document.getElementById("date");
  let d = new Date(dateInput.value);
  let day = d.getUTCDay(); // 1 = Monday, 2 = Tuesday

  if (day === 1 || day === 2) {
    alert("We do not operate Mondays or Tuesdays. Please select another date.");
    dateInput.value = "";
  }
}

// ------------------ Submit ------------------

function submitOrder(e) {
  e.preventDefault();
  alert("Order placed! (Backend integration can be added)");
}
