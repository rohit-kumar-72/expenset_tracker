const state = {
    earning: 0,
    expense: 0,
    net: 0,
    transactions: []
};
let isupdate = false;
let tid;
const rendercard = () => {
    const transactioncontainer = document.getElementById("cards");
    const netamountel = document.getElementById("netamount");
    const earningel = document.getElementById("earning");
    const expenseel = document.getElementById("expense");
    const transactions = state.transactions;
    transactioncontainer.innerHTML = "";
    let earning = 0;
    let expense = 0;
    let net = 0;

    transactions.forEach((transaction) => {
        const sign = transaction.type == "credit" ? '+' : '-';
        const typeel = transaction.type == "credit" ? 'C' : 'D';
        const transactionel = `
        <div class="transaction"id=${transaction.id}>
                        <div class="contentt"onclick="showedit(${transaction.id})">
                            <div class="left">
                                <p>${transaction.text}</p>
                                <p>${sign} ${transaction.amount}</p>
                            </div>
                            <div class="right ${transaction.type}">
                                <p>${typeel}</p>
                            </div>
                        </div>
                        <div class="lower">
                            <div class="icon">
                                <img src="icons/pen.svg" alt="edit" onclick="handleedit(${transaction.id})">
                                <img src="icons/trash.svg" alt="delete" onclick="handledelete(${transaction.id})">
                            </div>
                        </div>
                    </div>`

        transactioncontainer.insertAdjacentHTML("afterbegin", transactionel)
        earning += transaction.type == "credit" ? transaction.amount : 0;
        expense += transaction.type == "debit" ? transaction.amount : 0;
        net = earning - expense;
    });
    netamountel.innerHTML = `₹${net}`
    earningel.innerHTML = `₹${earning}`
    expenseel.innerHTML = `₹${expense}`
    state.earning = earning
    state.expense = expense
    state.net = net

}

const formelement = document.getElementById("formelement");
const addtransaction = (e) => {
    e.preventDefault()
    const isearn = e.submitter.id == 'earnbtn' ? true : false;
    const formdata = new FormData(formelement);
    const tdata = {};
    formdata.forEach((value, key) => {
        tdata[key] = value
    });

    const textedit = document.getElementById("text")
    const amountedit = document.getElementById("amount")

    const transaction = {
        id: isupdate ? tid : Math.floor(Math.random() * 10000),
        text: tdata.text,
        amount: +tdata.amount,
        type: isearn ? "credit" : "debit"
    };
    if (isupdate) {
        const tindex = state.transactions.findIndex((t) => t.id == tid)
        state.transactions[tindex] = transaction;
        isupdate = false;
        tid = null;
    } else {
        state.transactions.push(transaction);
    }
    console.log({ state });
    rendercard();
    textedit.value = '';
    amountedit.value = 0;
};
const showedit = (id) => {
    const selectedtransaction = document.getElementById(id)
    const lowerel = selectedtransaction.querySelector(".lower")
    lowerel.classList.toggle("showtransaction")
}
const handleedit = (id) => {
    const transaction = state.transactions.find((t) => t.id == id)
    const { text, amount } = transaction
    const textedit = document.getElementById("text")
    const amountedit = document.getElementById("amount")
    textedit.value = text;
    amountedit.value = amount;
    isupdate = true;
    tid = id;
}
const handledelete = (id) => {
    const filteredtransaction = state.transactions.filter((t) => {
        return t.id != id
    });
    state.transactions = filteredtransaction;
    rendercard();
}
formelement.addEventListener("submit", addtransaction);