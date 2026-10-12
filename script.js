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
    beskrivning
}) {
    let mushroomEl = templateEl.cloneNode(true) // skapa en kopia av placeholder elementet som ligger hidden i body
    let children = mushroomEl.children[0].children
    mushroomEl.removeAttribute("id")
    children[0].src = `/img/${svenskt_namn}.jpeg`
    children[0].alt = svenskt_namn
    children[1].textContent = svenskt_namn
    children[2].textContent = latinskt_namn
    children[3].textContent = ätlig
    const lower = ätlig.toLowerCase()
    if (lower.includes("blandad")) {
        children[3].classList.add("yellow")
    } else if (lower.includes("giftig")) {
        children[3].classList.add("red")
    } else if (lower.includes("ätlig")) {
        children[3].classList.add("green")
    }
    children[4].textContent = beskrivning

    // TODO: Hämta fyndplats för varje svamp från localstorage och visa för användare. (inne i mina-fynd)

    mushroomList.appendChild(mushroomEl)
    return mushroomEl
}

async function init() {
    mushroomsJSON = await mushroomsJSON
    let mushrooms = mushroomsJSON.svampar
    mushrooms.forEach(mushroom => { // Laddar in alla svampar (för testsyfte i mina-fynd.html)
        createMushroomElement(mushroom)
    })
}

window.onload = init