const jamforelselista = document.getElementById("jamforelselista");

// Hämtar informationen från JSON-filen
async function hamtaJamforelser() {
    try {
        const response = await fetch("speciellaEgenskaper.json");

        // Om filen inte kunde hämtas skapas ett fel
        if (!response.ok) {
            throw new Error("Kunde inte hämta informationen");
        }

        // Gör om JSON-innehållet till ett javascript-objekt
        const data = await response.json();

        // Skickar listan med jämförelser till funktionen som visar dem
        visaJamforelser(data.särskiljande_egenskaper);
    
    } catch (error) {
        // Skriver ut eventuella fel i konsolen
        console.error("Fel:", error);

        jamforelselista.textContent = "Informationen kunde inte laddas.";
    }
}
function visaJamforelser(lista) {
    //jamforelselista.textContent = "",//

    lista.forEach(jamforelse => {
        const artikel = skapaArtikel(jamforelse);
        jamforelselista.appendChild(artikel);
    });
}

function skapaArtikel(jamforelse) {
    const artikel = document.createElement("article");

    const rubrik = document.createElement("h3");
    rubrik.textContent = jamforelse.par;

    const risk = document.createElement("p");
    risk.textContent = "Risk: " + jamforelse.risk; 

    artikel.appendChild(rubrik);
    artikel.appendChild(risk);
    artikel.appendChild(skapaPunktlista(jamforelse.särskiljande));

    return artikel;
}
