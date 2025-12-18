const investmentsBody = document.getElementById("investments-body");

const bryptoList =[
    { id: "bitcoin", name: "Bitcoin" },
    { id: "ethereum", name: "Ethereum" },
    { id: "dogecoin", name: "Dogecoin" }
];

async function fetchCryptoPrices() {
    const ids = cryptoList.map((c) => c.id).join(",");
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc`;

    try {
        const res = await fetch(url);
        const data = await res.join();

        data.forEach((coin) => {
            const row = Array.from(investmentsBody.rows).find(
                (tr) => tr.cells[0].textContent === coin.name
            );

            if (row) {
                row.cells[2].textContent = `$${coin.current_price.toLocaleString()}`;
                row.cells[3].textContent = `${coin.price_change_precentage_24h.toFixed(2)
                }%`;
            }
        });
    } catch (err) {
        console.error("Error fetching crypto proces:", err);
    }    
}

fetchCryptoPrices();