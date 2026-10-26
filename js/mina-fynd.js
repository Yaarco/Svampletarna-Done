// Logik för mina-fynd.html: visar de sparade svamparna och låter användaren ta bort dem.
// createMushroomElement() och mushroomList kommer från js/script.js.

// Rutan överst i main med antal fynd och knappen "Rensa alla fynd"
const amountText = document.querySelector("main > div > p");
const clearHistoryButton = document.querySelector("main > div > button");

// Init-funktion som hämtar in json-filen, filtrerar efter sparade svampar i localStorage och bygger HTML-element utifrån de sparade svamparnas information.
// Den lyssnar även efter om användaren klickar på antingen "Rensa alla fynd" eller "Ta bort".
// "Rensa alla fynd" tömmer "mushrooms" i localStorage och listan (ul) som svamparna ligger i, och skickar värdet 0 till changeAmount.
// "Ta bort" uppdaterar listan med sparade svampar, raderar li-elementet som svampen ligger i och skickar den nya längden till changeAmount.
async function init() {
    const response = await fetch("json/svampar.json");
    const mushroomsJSON = await response.json();
    const mushrooms = mushroomsJSON.svampar;

    const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

    const foundMushrooms = mushrooms.filter(mushroom => savedMushrooms.includes(mushroom.svenskt_namn));

    changeAmount(foundMushrooms.length);

    foundMushrooms.forEach(mushroom => {
        const mushroomElement = createMushroomElement(mushroom);
        mushroomElement.querySelector("button").addEventListener("click", removeMushroom);
    });

    clearHistoryButton.addEventListener("click", () => {
        localStorage.removeItem("mushrooms");
        mushroomList.innerHTML = "";

        changeAmount(0);
    });
}

// Tar bort svampen vars "Ta bort"-knapp klickades, både från localStorage och från sidan
function removeMushroom(event) {
    const mushroomId = event.currentTarget.dataset.svampId;

    const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

    const updatedMushrooms = savedMushrooms.filter(savedId => savedId !== mushroomId);

    localStorage.setItem("mushrooms", JSON.stringify(updatedMushrooms));

    event.currentTarget.closest("li").remove();

    changeAmount(updatedMushrooms.length);
}

// Uppdaterar antalet hittade svampar och skriver "svamp" vid 1 och "svampar" vid 0 eller fler än 1.
// Döljer även knappen "Rensa alla fynd" när inga svampar är sparade.
function changeAmount(amount) {
    const word = amount === 1 ? "svamp" : "svampar";
    amountText.textContent = "Du har hittat " + amount + " " + word;
    clearHistoryButton.hidden = amount === 0;
}

window.addEventListener("load", init);
