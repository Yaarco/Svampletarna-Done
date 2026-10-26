// Startar hämtningen av information
function init() {
    fetchData();
}

// Hämtar informationen från JSON-filerna
async function fetchData() {
    try {
        const comparisonResponse = await fetch("json/speciellaEgenskaper.json");
        const mushroomsResponse = await fetch("json/svampar.json");

        // Kontrollerar att båda filerna kunde hämtas
        if (!comparisonResponse.ok || !mushroomsResponse.ok) {
            throw new Error("Det gick inte att hämta JSON-filerna");
        }

        // Omvandlar innehållet från JSON till data som JavaScript kan använda
        const comparisonJSON = await comparisonResponse.json();
        const mushroomsJSON = await mushroomsResponse.json();

        // Skickar jämförelserna och svamparna vidare för att visas på sidan
        displayComparisons(comparisonJSON.särskiljande_egenskaper, mushroomsJSON.svampar);
    } catch (error) {
        // Skriver felet i konsolen och visar ett meddelande på sidan
        console.error("Fel:", error);
        document.querySelector("main > section > div").textContent = "Informationen kunde inte laddas.";
    }
}

// Skapar och visar alla jämförelser
function displayComparisons(comparisons, mushrooms) {
    // Den tomma div:en under rubriken och ingressen i om-svampar.html
    const comparisonList = document.querySelector("main > section > div");
    comparisonList.textContent = "";

    // Skapar en artikel för varje jämförelse och lägger till den på sidan
    comparisons.forEach(comparison => {
        const comparisonElement = createComparisonElement(comparison, mushrooms);
        comparisonList.appendChild(comparisonElement);
    });
}

// Skapar en artikel med rubrik, risktext, bilder och punktlista
function createComparisonElement(comparison, mushrooms) {
    const comparisonElement = document.createElement("article");

    const heading = document.createElement("h3");
    heading.textContent = comparison.par;

    // Risken visas som en <details>: kort status i <summary>, hela texten när man öppnar den
    const risk = document.createElement("details");
    const riskSummary = document.createElement("summary");
    const riskText = document.createElement("p");
    riskSummary.textContent = "Risk: " + comparison.risk.split(" – ")[0];
    riskText.textContent = comparison.risk;
    risk.append(riskSummary, riskText);

    // Väljer färg på riskrutan utifrån risktexten
    if (comparison.risk.includes("Låg")) {
        risk.classList.add("green");
    } else if (comparison.risk.includes("Oätlig")) {
        risk.classList.add("yellow");
    } else {
        risk.classList.add("red");
    }

    // Använder funktionerna för att skapa bilderna och punktlistan
    const imageContainer = createMushroomImages(comparison, mushrooms);
    const featureList = createFeatureList(comparison.särskiljande);

    // Samlar bilderna och punktlistan i en gemensam div
    const content = document.createElement("div");
    content.append(imageContainer, featureList);

    // Lägger till allt innehåll i artikeln och returnerar den
    comparisonElement.append(heading, risk, content);

    return comparisonElement;
}

// Hittar svampar som nämns i rubriken och skapar deras bilder
function createMushroomImages(comparison, mushrooms) {
    const imageContainer = document.createElement("div");

    mushrooms.forEach(mushroom => {
        const name = mushroom.svenskt_namn;

        if (comparison.par.includes(name)) {
            const figure = document.createElement("figure");

            // Namnet står i bildtexten, därför är bilden dekorativ
            const image = document.createElement("img");
            // Bildsökvägen i JSON är "./filnamn.jpeg", men bilderna ligger i mappen img/
            image.src = mushroom.bild.replace("./", "img/");
            image.alt = "";

            const caption = document.createElement("figcaption");
            caption.textContent = name;

            figure.append(image, caption);
            imageContainer.appendChild(figure);
        }
    });

    return imageContainer;
}

// Skapar en punktlista med de särskiljande egenskaperna
function createFeatureList(features) {
    const featureList = document.createElement("ul");

    // Skapar en punkt för varje egenskap och lägger till den i listan
    features.forEach(feature => {
        const listItem = document.createElement("li");
        listItem.textContent = feature;

        featureList.appendChild(listItem);
    });

    return featureList;
}

// Startar sidan när den har laddats
window.addEventListener("load", init);
