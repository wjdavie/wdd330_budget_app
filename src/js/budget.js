import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const budgetProcess = {
    key: "budget",
    incomeBody: null,
    expensesBody: null,
    incomeTotalEl: null,
    expensesTotalEl: null,
    list: { income: [], expense: []},

    init() {
        this.incomeBody = document.querySelector(".budget-table.income tbody");
        this.expensesBody = document.querySelector(".budget-table.expenses tbody");
        this.incomeTotalEl = document.querySelector("#income-total");
        this.expensesTotalEl = document.querySelector("#expenses-total");

        this.list = getLocalStorage(this.key) || { income: [], expenses: [] };
        this.render();

        const addIncomeBtn = document.querySelector(".btn-add-income");
        if (addIncomeBtn) addIncomeBtn.addEventListener("click", () => this.add("income"));

        const addExpenseBtn = document.querySelector(".btn-add-expense");
        if (addExpenseBtn) addExpenseBtn.addEventListener("click", () => this.add("expense"));
    },

    render() {
        this.renderSection("income");
        this.renderSection("expenses");
        this.calculateTotals();
    },

    renderSection(section) {
        const body = section === "income" ? this.incomeBody : this.expensesBody;
        body.innerHTML = "";

        this.list[section].forEach((item, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${Number(item.amount).toFixed(2)}</td>
                <td><button class="btn-edit" data-section="${section}" data-index="${index}">Edit</button></td>
                <td><button class="btn-delete" data-section="${section}" data-index="${index}">Delete</button></td>
            `;

            body.appendChild(row);
        });

        body.addEventListener("click", (e) => {
            const sectionAttr = e.target.dataset.section;
            const index = e.target.dataset.index;

            if (e.target.classList.contains("btn-delete")) {
                this.delete(index);
            }

            if (e.target.classList.contains("btn-edit")) {
                this.edit(index);
            }
        });
    },

    add(section) {
        const name = prompt(`${section === "income" ? "Income" : "Expense"} name:`);
        const amount = parseFloat(prompt("Amount:"));

        if (!name || isNaN(amount)) return;

        this.list[section].push({ name, amount });
        this.save();
    },

    edit(section, index) {
        const item = this.list[section][index];
        item.name = prompt("Name:", item.name);
        item.amount = parseFloat(prompt("Amount:", item.amount));

        if(isNaN(item.amount)) item.amount = 0;

        this.save();
    },

    delete(section, index) {
        this.list[section].splice(index, 1);
        this.save();
    },

    calculateTotals() {
        const incomeTotal = this.list.income.reduce((sum, item) => sum + item.amount, 0);
        const expensesTotal = this.list.expenses.reduce((sum, item) => sum + item.amount, 0);

        if (this.incomeTotalEl) this.incomeTotalEl.textContent = `$${incomeTotal.toFixed(2)}`;
        if (this.expensesTotalEl) this.expensesTotalEl.textContent = `$${expensesTotal.toFixed(2)}`;
    },

    save() {
        setLocalStorage(this.key, this.list);
        this.render();
    },
};

export default budgetProcess;