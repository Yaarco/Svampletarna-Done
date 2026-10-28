// Enkel inloggning som laddas på alla sidor.
// OBS: uppgifterna ligger i klartext i koden och är bara till för demonstration, inte riktig säkerhet.
const USERNAME = "Kalle";
const PASSWORD = "qwe123";

// Inloggad användare sparas i localStorage så att den finns kvar mellan sidorna
const storedUser = localStorage.getItem("username");

// Koden nedan gäller bara login.html. Vi letar efter formuläret med lösenordsfält i stället för att
// jämföra sökvägen, så att det fungerar oavsett var sajten ligger (t.ex. i en undermapp eller öppnad från disk).
const loginForm = document.querySelector("form:has(input[type='password'])");

if (loginForm) {
    // I main ligger först rutan med felmeddelande och formulär, sedan välkomstrutan
    const loginBox = document.querySelector("main > div");
    const authedBox = document.querySelector("main > section");
    const errorText = loginBox.querySelector(":scope > p");

    // Visar antingen inloggningsformuläret eller välkomsttexten
    if (storedUser === USERNAME) {
        loginBox.hidden = true;
        authedBox.querySelector("span").textContent = USERNAME;
    } else {
        authedBox.hidden = true;
    }

    // Jämför uppgifterna och skickar användaren till startsidan om de stämmer
    loginForm.addEventListener("submit", event => {
        event.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;
        if (username === USERNAME && password === PASSWORD) {
            localStorage.setItem("username", username);
            location.href = "./index.html";
        } else {
            // Stycket har role="alert" så att skärmläsare läser upp felet direkt
            errorText.textContent = "Fel användarnamn eller lösenord";
        }
    });

    // Loggar ut och laddar om sidan så att formuläret visas igen
    authedBox.querySelector("button").addEventListener("click", () => {
        localStorage.removeItem("username");
        location.reload();
    });
}

// På alla sidor: byter texten "Logga in" i menyn mot användarnamnet och en ikon
if (storedUser === USERNAME) {
    const loginLink = document.querySelector("nav a[href='./login.html']");
    loginLink.textContent = storedUser;

    // Ikonen är dekorativ, namnet står redan i länken. Storleken sätts här eftersom global.css inte har någon regel för den.
    const userIcon = document.createElement("img");
    userIcon.src = "./img/user.svg";
    userIcon.alt = "";
    userIcon.width = 18;
    userIcon.height = 18;
    loginLink.prepend(userIcon);
}
