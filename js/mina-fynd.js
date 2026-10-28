// Knappen "Rensa alla fynd"
const clearHistoryBtn = document.getElementById("clear-history-btn");

// Visar de svampar som är sparade i localStorage (svenska namnet är id) och kopplar knapparna
// "Ta bort" och "Rensa alla fynd"
async function init() {
    const response = await fetch("./json/svampar.json");
    const mushroomsJSON = await response.json();
    const mushrooms = mushroomsJSON.svampar;

    const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

    const foundMushrooms = mushrooms.filter(mushroom =>
        savedMushrooms.includes(mushroom.svenskt_namn)
    );

    changeAmount(foundMushrooms.length);

    foundMushrooms.forEach(mushroom => {
        const listElement = createMushroomElement(mushroom);

        // "Ta bort" tar bort svampen ur localStorage och kortet ur listan
        listElement.querySelector(".remove-mushroom-btn").addEventListener("click", () => {
            const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

            const updatedMushrooms = savedMushrooms.filter(savedId =>
                savedId !== mushroom.svenskt_namn
            );

            localStorage.setItem("mushrooms", JSON.stringify(updatedMushrooms));
            listElement.remove();
            changeAmount(mushroomList.children.length);
        });
    });

    // "Rensa alla fynd" tömmer localStorage och listan
    clearHistoryBtn.addEventListener("click", () => {
        localStorage.removeItem("mushrooms");
        mushroomList.replaceChildren();
        changeAmount(0);
    });
}

// Visar antalet hittade svampar, "1 svamp" men "0 svampar" och "2 svampar".
// "Rensa alla fynd" döljs när det inte finns några fynd.
function changeAmount(amount) {
    document.getElementById("amount-found").textContent = amount;
    document.getElementById("text-amount-found").textContent = amount === 1 ? "" : "ar";
    clearHistoryBtn.hidden = amount === 0;
}

// Startar sidan när den har laddats
window.onload = init;
