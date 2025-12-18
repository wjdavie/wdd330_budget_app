import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const accountsProcess = {
    key: "accounts",
    tablebody: null,
    list: [],

    init() {
        this.tablebody = document.querySelector(".accounts-table tbody");
        this.list = getLocalStorage(this.key) || [];
        this.render();

        document
            .querySelector(".btn-add-account")
            .addEventListener("click", () => this.add());
    },

    render() {
        this.tablebody.innerHTML = "";

        this.list.forEach((account, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${account.name}</td>
                <td>$${Number(account.balance).toFixed(2)}</td>
                <td>${account.interest}%</td>
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
        const name = prompt("Account name:");
        const balance = parseFloat(prompt("Balance:"));
        const interest = parseFloat(prompt("Interest rate (%):"));

        if (!name || isNaN(balance) || isNaN(interest)) return;

        this.list.push({ name, balance, interest });
        this.save();
    },

    edit(index) {
        const account = this.list[index];

        account.name = prompt("Account name:", account.name);
        account.balance = parseFloat(prompt("Balance:", account.balance));
        account.interest = parseFloat(prompt("Interest rate:", account.interest));

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

export default accountsProcess