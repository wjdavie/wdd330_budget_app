import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const transactionsProcess = {
    key: "transactions",
    tablebody: null,
    list: [],

    init() {
        this.tablebody = document.querySelector(".transactions-table tbody");
        this.list = getLocalStorage(this.key) || [];
        this.render();

        const addBtn = document.querySelector(".btn-add-transaction");
        if (addBtn) addBtn.addEventListener("click", () => this.add());
    },

    render() {
        this.tablebody.innerHTML = "";

        this.list.forEach((txn, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${txn.account}</td>
                <td>${txn.type}</td>
                <td>${txn.date}</td>
                <td>$${Number(txn.amount).toFixed(2)}</td>
                <td><button class="btn-edit" data-index="${index}">Edit</button></td>
                <td><button class="btn-delete" data-index="${index}">Delete</button></td>
                `;

                this.tablebody.appendChild(row);
        });

        this.addRowListeners();
    },

    addRowListeners() {
        this.tablebody.addEventListener("click", (e) => {
            const index = e.target.dataset.index;

            if (e.target.classList.contains("btn-delete")) {
                this.delete(index);
            }

            if (e.target.classList.contains("btn-edit")) {
                this.edit(index);
            }
        });
    },

    add() {
        const account = prompt("Account name:");
        const type = prompt("Transaction type:");
        const date = prompt("Transaction date:");
        const amount = parseFloat(prompt("Transaction amount:"));

        if (!account || !type || !date || isNaN(amount)) return;

        this.list.push({ account, type, date, amount });
        this.save();
    },

    edit(index) {
        const account = this.list[index];

        txn.account = prompt("Account name:", txn.account);
        txn.type = prompt("Transaction type:", txn.type);
        txn.date = prompt("Transaction date:", txn.date);
        txn.amount = parseFloat(prompt("Transaction amount:", txn.amount));

        if(isNaN(txn.amount)) txn.amount = 0;

        this.save();
    },

    delete(index) {
        this.list.splice(index, 1);
        this.save();
    },

    save() {
        setLocalStorage(this.key, this.list);
        this.render();
    },
};

export default transactionsProcess