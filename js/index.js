// Startar hämtningen av JSON-filen direkt när skriptet körs, init väntar sedan på svaret
const mushroomsRequest = fetch("./json/svampar.json")
    .then(r => r.json());

// Visar alla svampar och gör att "Markera som hittad" sparar svampen i localStorage.
// Svenska namnet används som id när svampen sparas.
async function init() {
    const mushrooms = (await mushroomsRequest).svampar;

    const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

    // Skapar ett kort för varje svamp och döljer knappen på de som redan är hittade
    mushrooms.forEach(mushroom => {
        const button = createMushroomElement(mushroom).querySelector(".btn-find");

        if (savedMushrooms.includes(mushroom.svenskt_namn)) {
            button.hidden = true;
        }

        // Sparar svampen i localStorage när användaren klickar och döljer sedan knappen.
        // Listan läses om från localStorage ifall den har ändrats i en annan flik.
        button.addEventListener("click", () => {
            const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

            // Lägger bara till svampen om den inte redan finns i listan
            if (!savedMushrooms.includes(mushroom.svenskt_namn)) {
                savedMushrooms.push(mushroom.svenskt_namn);
            }

            localStorage.setItem("mushrooms", JSON.stringify(savedMushrooms));

            button.hidden = true;
        });
    });
}

// Startar sidan när den har laddats
window.onload = init;
