// Logik för index.html: visar alla svampar och sparar dem användaren markerar som hittade.
// createMushroomElement() kommer från js/script.js.

// Hämtar alla svampar och skapar ett kort för varje
async function init() {
    const response = await fetch("json/svampar.json");
    const mushroomsJSON = await response.json();
    const mushrooms = mushroomsJSON.svampar;

    // Namnen på svampar som redan är sparade, lagras som en JSON-array i localStorage
    const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

    mushrooms.forEach(mushroom => {
        const mushroomElement = createMushroomElement(mushroom);
        const button = mushroomElement.querySelector("button");

        // En svamp som redan finns i fynden kan inte markeras igen
        if (savedMushrooms.includes(mushroom.svenskt_namn)) {
            button.hidden = true;
        }

        button.addEventListener("click", saveMushroom);
    });
}

// Sparar svampen vars knapp klickades i localStorage och döljer knappen
function saveMushroom(event) {
    const button = event.currentTarget;
    const mushroomId = button.dataset.svampId;

    // Läser in listan på nytt ifall den har ändrats sedan sidan laddades
    const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

    if (!savedMushrooms.includes(mushroomId)) {
        savedMushrooms.push(mushroomId);
    }

    localStorage.setItem("mushrooms", JSON.stringify(savedMushrooms));

    button.hidden = true;
}

window.addEventListener("load", init);
