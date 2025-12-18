import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const investmentsProcess = {
  key: "investments",
  tableBody: null,
  list: [],
  cryptoList: [
    { id: "bitcoin", name: "Bitcoin" },
    { id: "ethereum", name: "Ethereum" },
    { id: "dogecoin", name: "Dogecoin" }
  ],

  init() {
    this.tableBody = document.getElementById("investments-body");
    this.list = getLocalStorage(this.key) || [];

    this.render();

    // Add button for manual entries
    const addBtn = document.querySelector(".btn-add-investment");
    if (addBtn) addBtn.addEventListener("click", () => this.add());

    // Fetch crypto prices after initial render
    this.fetchCryptoPrices();
  },

  render() {
    if (!this.tableBody) return;
    this.tableBody.innerHTML = "";

    this.list.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.type}</td>
        <td>${item.value !== undefined ? `$${Number(item.value).toLocaleString()}` : ""}</td>
        <td>${item.change !== undefined ? `${item.change.toFixed(2)}%` : ""}</td>
        <td><button class="btn-edit" data-index="${index}">Edit</button></td>
        <td><button class="btn-delete" data-index="${index}">Delete</button></td>
      `;
      this.tableBody.appendChild(row);
    });

    // Event delegation for edit/delete
    this.tableBody.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      if (e.target.classList.contains("btn-delete")) this.delete(index);
      if (e.target.classList.contains("btn-edit")) this.edit(index);
    });
  },

  add() {
    const name = prompt("Investment Name:");
    const type = prompt("Investment Type (e.g., Stock, Crypto, ETF):");
    const value = parseFloat(prompt("Current Value:"));
    const change = parseFloat(prompt("Change (%):"));

    if (!name || !type || isNaN(value) || isNaN(change)) return;

    this.list.push({ name, type, value, change });
    this.save();
  },

  edit(index) {
    const item = this.list[index];
    item.name = prompt("Investment Name:", item.name);
    item.type = prompt("Investment Type:", item.type);
    item.value = parseFloat(prompt("Current Value:", item.value));
    item.change = parseFloat(prompt("Change (%):", item.change));

    if (isNaN(item.value)) item.value = 0;
    if (isNaN(item.change)) item.change = 0;

    this.save();
  },

  delete(index) {
    this.list.splice(index, 1);
    this.save();
  },

  save() {
    setLocalStorage(this.key, this.list);
    this.render();
    this.fetchCryptoPrices(); // Update crypto values after any change
  },

  async fetchCryptoPrices() {
    const cryptoIds = this.cryptoList.map(c => c.id).join(",");
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds}&order=market_cap_desc`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      data.forEach((coin) => {
        const row = Array.from(this.tableBody.rows).find(
          tr => tr.cells[0].textContent === coin.name
        );

        if (row) {
          row.cells[2].textContent = `$${coin.current_price.toLocaleString()}`;
          row.cells[3].textContent = `${coin.price_change_percentage_24h.toFixed(2)}%`;
        }
      });
    } catch (err) {
      console.error("Error fetching crypto prices:", err);
    }
  },
};

export default investmentsProcess;
