let mushroomsJSON = fetch("./json/svampar.json")
    .then(r => r.json())

let specialPropertiesJSON = fetch("./json/speciellaEgenskaper.json")
    .then(r => r.json())

const templateEl = document.getElementById("placeholder")

const mushroomList = document.querySelector("ul")
mushroomList.removeChild(templateEl)

function createMushroomElement({
    svenskt_namn,
    latinskt_namn,
    ätlig,
    bild,
    fyndplats,
    beskrivning
}) {
    let mushroomEl = templateEl.cloneNode(true) // skapa en kopia av placeholder elementet som ligger hidden i body
    let children = mushroomEl.children[0].children
    mushroomEl.removeAttribute("id")
    children[0].src = `/img/${bild.replace("./", "")}`
    children[0].alt = svenskt_namn
    children[1].textContent = svenskt_namn
    children[2].textContent = latinskt_namn
    children[3].textContent = ätlig

    const ätbarStatus = ätlig.toLowerCase().split(" – ")[0]
    if (ätbarStatus.includes("blandad")) {
        children[3].classList.add("yellow")
    } else if (ätbarStatus.includes("ätlig")) {
        children[3].classList.add("green")
    } else if (ätbarStatus.includes("giftig")) {
        children[3].classList.add("red")
    }
    children[4].textContent = beskrivning
    children[5].textContent = fyndplats

    mushroomList.appendChild(mushroomEl)
    return mushroomEl
}

async function init() {
    mushroomsJSON = await mushroomsJSON
    let mushrooms = mushroomsJSON.svampar
    /* EXEMPELKOD: HITTA KANTARELL FRÅN NAMNET
    const name = "Kantarell"
    const obj = mushrooms.find(mushroom => mushroom.svenskt_namn === "Kantarell")
    createMushroomElement(obj)
    */

}

window.onload = init