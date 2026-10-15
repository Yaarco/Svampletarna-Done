const clearHistoryBtn = document.getElementById('clear-history-btn');

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
        createMushroomElement(mushroom);
    });

    const removeMushroomBtn = document.querySelectorAll('.remove-mushroom-btn');

    removeMushroomBtn.forEach(button => {
        button.addEventListener("click", e => {
            const mushroomId = e.currentTarget.dataset.svampId;

            const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

            const updatedMushrooms = savedMushrooms.filter(savedId =>
                savedId !== mushroomId
            );

            localStorage.setItem("mushrooms", JSON.stringify(updatedMushrooms));

            e.currentTarget.closest("li").remove();

            changeAmount(updatedMushrooms.length);
        });
    });

    clearHistoryBtn.addEventListener("click", e => {
        localStorage.removeItem("mushrooms");
        document.querySelector("ul").innerHTML = "";

        changeAmount(0);
    });
}

function changeAmount(amount) {
    const showAmount = document.getElementById("amount-found");
    const textAmount = document.getElementById("text-amount-found");

    if (amount === 0) {
        clearHistoryBtn.hidden = true;
        textAmount.textContent = "ar";
        showAmount.textContent = amount;
    }
    else {
        textAmount.textContent = "ar";
        showAmount.textContent = amount;

        if (amount === 1) {
            textAmount.textContent = "";
        }

        clearHistoryBtn.hidden = false;
    }
}

window.onload = init;