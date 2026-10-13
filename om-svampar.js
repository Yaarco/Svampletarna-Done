// Svampar till varje jämförelse, i samma ordning som i JSON-filen
const jamforelseNamn = [
    ["Kantarell", "Toppig giftspindling"],
    ["Vit champinjon", "Lömsk flugsvamp"],
    ["Karljohansvamp"],
    ["Sandsopp", "Smörsopp"],
    ["Fårticka"],
    ["Blåmusseron"],
    ["Stenmurkla"],
    ["Giftkremla"],
    ["Röd flugsvamp"],
    ["Trattkantarell", "Toppig giftspindling"]
];

const jamforelselista = document.getElementById("jamforelselista");

// Hämtar informationen från JSON-filerna
async function hamtaJamforelser() {
    try {
        const response = await fetch("json/speciellaEgenskaper.json");
        const svampResponse = await fetch("json/svampar.json");

        // Om filen inte kan hämtas skapas ett fel
        if (!response.ok || !svampResponse.ok) {
            throw new Error("Kunde inte hämta informationen");
        }

        // Gör om JSON-innehållet till ett JavaScript-objekt
        const data = await response.json();
        const svampData = await svampResponse.json();

        // Skickar listan med jämförelser till funktionen som visar dem
        visaJamforelser(data.särskiljande_egenskaper, svampData.svampar);

    } catch (error) {
        console.error("Fel:", error);

        // Visar ett meddelande på sidan om något går fel
        document.getElementById("jamforelselista").textContent = "Informationen kunde inte laddas.";
    }
}

// Kopplar rätt svampar till varje jämförelse och visar artiklarna
function visaJamforelser(lista, svampar) {
    // Tömmer innehållet innan jämförelserna läggs till
    jamforelselista.textContent = "";

    lista.forEach((jamforelse, index) => {
        const namnlista = jamforelseNamn[index] || [];

        const bilder = svampar.filter(svamp =>
        namnlista.includes(svamp.svenskt_namn)
        );

        const artikel = skapaArtikel(jamforelse, bilder);
        jamforelselista.appendChild(artikel);
    });
}

// Skapar en artikel med rubrik, risktext, bilder och punktlista
function skapaArtikel(jamforelse, bilder) {
    const artikel = document.createElement("article");
    artikel.className = "jamforelse";

    const rubrik = document.createElement("h3");
    rubrik.textContent = jamforelse.par;

    const risk = document.createElement("p");
    risk.className = "risk";
    risk.textContent = "Risk: " + jamforelse.risk;

    // Samlar bilderna i en div så att de kan placeras med CSS
    const bildcontainer = document.createElement("div");
    bildcontainer.className = "jamforelse-bilder";

    bilder.forEach(svamp => {
        const figur = skapaBild(svamp);
        bildcontainer.appendChild(figur);
    });

    const punktlista = document.createElement("ul");

    // Skapar en listpunkt för varje särskiljande egenskap
    jamforelse.särskiljande.forEach(egenskap => {
        const punkt = document.createElement("li");
        punkt.textContent = egenskap;
        punktlista.appendChild(punkt);
    });

    // Samlar bilder och punktlista för layouten i CSS
    const innehall = document.createElement("div");
    innehall.className = "jamforelse-innehall";
    innehall.append(bildcontainer, punktlista);

    artikel.append(rubrik, risk, innehall);

    return artikel;
}

// Skapar en bild med svampens namn under
function skapaBild(svamp) {
    // figure samlar bilden och bildtexten
    const figur = document.createElement("figure");

    const bild = document.createElement("img");
    bild.src = "img/" + svamp.bild;
    bild.alt = svamp.svenskt_namn;

    const bildtext = document.createElement("figcaption");
    bildtext.textContent = svamp.svenskt_namn;

    figur.append(bild, bildtext);

    return figur;
}

// Hämtar och visar informationen när skriptet körs
hamtaJamforelser();