// Gemensam kod för index.html och mina-fynd.html.
// Båda sidorna visar svampkort och har en <template> med ett tomt kort i HTML:en.
// Filen laddas före index.js/mina-fynd.js, som anropar createMushroomElement().

const mushroomTemplate = document.querySelector("template");
const mushroomList = document.querySelector(".svamp-lista ul");

// Skapar ett svampkort från ett objekt i json/svampar.json, lägger det i listan och returnerar <li>-elementet.
// Parametrarna packas upp direkt ur objektet. JSON-nyckeln "ätlig" byter namn till edibility.
function createMushroomElement({ svenskt_namn, latinskt_namn, ätlig: edibility, bild, fyndplats, beskrivning }) {
    // Klonar innehållet i mallen så att varje kort blir ett eget element
    const listElement = mushroomTemplate.content.firstElementChild.cloneNode(true);
    const article = listElement.querySelector("article");

    // Bildsökvägen i JSON är "./filnamn.jpeg", men bilderna ligger i mappen img/
    // Namnet står redan i rubriken bredvid, därför är bilden dekorativ (alt="" i mallen)
    article.querySelector(":scope > img").src = bild.replace("./", "img/");

    // Fälten hittas utifrån ordningen i mallen: rubrik, latinskt namn direkt efter, sedan
    // <details> med ätligheten, beskrivning direkt efter den och fyndplats som sista stycke
    article.querySelector(":scope > h3").textContent = svenskt_namn;
    article.querySelector(":scope > h3 + p").textContent = latinskt_namn;
    article.querySelector(":scope > details + p").textContent = beskrivning;
    article.querySelector(":scope > p:last-of-type").textContent = fyndplats;

    // Bara statusen ("Ätlig", "Giftig" ...) syns, hela texten visas när man öppnar <details>
    const edibilityElement = article.querySelector(":scope > details");
    const edibilityStatus = edibility.split(" – ")[0];
    edibilityElement.querySelector("summary").textContent = edibilityStatus;
    edibilityElement.querySelector("p").textContent = edibility;

    // Färgar statusen gul, grön eller röd, övriga statusar får ingen färg.
    // "oätlig" kontrolleras först eftersom ordet också innehåller "ätlig"
    const status = edibilityStatus.toLowerCase();
    if (status.includes("oätlig")) {
        edibilityElement.classList.add("yellow");
    } else if (status.includes("ätlig")) {
        edibilityElement.classList.add("green");
    } else if (status.includes("giftig")) {
        edibilityElement.classList.add("red");
    }

    // Svenska namnet används som id för svampen i localStorage
    article.querySelector(":scope > button").dataset.svampId = svenskt_namn;

    mushroomList.appendChild(listElement);
    return listElement;
}
