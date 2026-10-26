// Bloggen. Inläggen sparas som JSON i localStorage under nyckeln "posts".
// Filen laddas på blogg.html och blogg-post.html. På blogg.html visas alla inlägg och inloggade kan skriva nya,
// blog-post.ts använder idToBlogPost() för att hitta inlägget som ska visas.

// Ett inlägg och dess kommentarer. Datum sparas som millisekunder (Date.now()).
interface BlogComment {
    user: string;
    content: string;
    date: number;
}

interface BlogPost {
    title: string;
    user: string;
    content: string;
    date: number;
    comments?: BlogComment[];
}

// Definieras globalt i js/auth.js
declare const USERNAME: string;

// Mallen för ett inlägg i listan, finns bara på blogg.html
const template = document.querySelector("template");

// Ett inläggs id är titel och datum ihop, base64-kodat så att det kan stå i adressen (?id=...)
function getID(blogData: BlogPost) {
    return btoa(blogData.title + "|" + blogData.date);
}

// Avkodar ett id från getID() och letar upp inlägget med samma titel och datum
function idToBlogPost(id: string) {
    const decoded = atob(id);
    const date = decoded.split("|").pop();
    const title = decoded.replace("|" + date, "");
    return blogPosts.find(bp => bp.title === title && bp.date === Number(date));
}

// Skapar ett inlägg i listan på blogg.html utifrån mallen
function createBPElement(blogData: BlogPost) {
    const clone = template!.content.querySelector("li")!.cloneNode(true) as HTMLElement;
    const userElement = clone.querySelector(".user") as HTMLParagraphElement;
    const dateElement = clone.querySelector(".date") as HTMLTimeElement;
    const commentsElement = clone.querySelector(".comments span") as HTMLSpanElement;
    const titleElement = clone.querySelector(".title a") as HTMLAnchorElement;
    const idNumber = getID(blogData);

    // Länken går till blogg-post.html, som visar hela inlägget
    titleElement.href = "blogg-post.html?id=" + idNumber;
    titleElement.textContent = blogData.title;
    userElement.textContent = "@" + blogData.user;

    // datetime är det maskinläsbara datumet, texten är det som visas
    dateElement.setAttribute("datetime", new Date(blogData.date).toISOString());
    dateElement.textContent = new Date(blogData.date).toLocaleString("sv-SE", {
        dateStyle: "medium",
        timeStyle: "short",
    });
    // Antal kommentarer, 0 om inlägget saknar kommentarer
    commentsElement.textContent = String(blogData.comments?.length ?? 0);

    const postsList = document.querySelector(".posts ul");
    postsList?.appendChild(clone);
}

// Exempelinlägg som sparas i localStorage första gången sidan laddas
const examplePosts: BlogPost[] = [
    {
        title: "Första kantarellerna för säsongen!",
        user: "Svampkungen",
        content:
            "Var ute i skogen bakom Tyresö i morse och hittade nästan två liter kantareller. Mossig granskog, nära en bäck. Det har regnat mycket senaste veckan så det är full fart nu!",
        date: new Date("2026-08-14T09:32:00").getTime(),
        comments: [
            {
                user: "Kalle",
                content: "Grymt! Tror du det finns kvar till helgen?",
                date: new Date("2026-08-14T12:05:00").getTime(),
            },
            {
                user: "Svampkungen",
                content: "Säkert, det kommer fler efter regnet.",
                date: new Date("2026-08-14T13:47:00").getTime(),
            },
        ],
    },
    {
        title: "Se upp för toppig giftspindling",
        user: "Lisa_i_skogen",
        content:
            "Påminnelse till alla nybörjare: toppig giftspindling kan förväxlas med trattkantarell. Den är extremt giftig och symptomen kan dröja flera dagar. Plocka aldrig något du inte är 100% säker på.",
        date: new Date("2026-09-02T18:10:00").getTime(),
        comments: [
            {
                user: "Anders",
                content: "Viktigt! Tack för att du delar.",
                date: new Date("2026-09-02T19:22:00").getTime(),
            },
        ],
    },
    {
        title: "Recept: Krämig svampstuvning på toast",
        user: "Kalle",
        content:
            "Fräs svampen torrt i en het panna, tillsätt smör och schalottenlök. Häll på grädde, salta och peppra och låt puttra några minuter. Servera på rostat surdegsbröd med lite färsk persilja.",
        date: new Date("2026-09-20T16:45:00").getTime(),
    },
    {
        title: "Karljohan i parken?!",
        user: "Anders",
        content:
            "Hittade tre stora karljohansvampar under en ek i stadsparken idag. Någon som vet om det är okej att plocka där?",
        date: new Date("2026-10-08T11:15:00").getTime(),
        comments: [
            {
                user: "Lisa_i_skogen",
                content: "Allemansrätten gäller, men tänk på att svamp i stadsmiljö kan ta upp tungmetaller.",
                date: new Date("2026-10-08T14:30:00").getTime(),
            },
        ],
    },
];

if (!localStorage.getItem("posts")) {
    localStorage.setItem("posts", JSON.stringify(examplePosts));
}

// Alla inlägg. Läses in efter exempelinläggen ovan, så att de syns redan vid första besöket.
const blogPosts: BlogPost[] = JSON.parse(localStorage.getItem("posts") || "[]");

// Koden nedan gäller bara blogg.html, som har listan med inlägg
const postsSection = document.querySelector(".posts");

if (postsSection) {
    if (blogPosts.length < 1) {
        const emptyText = document.createElement("p");
        emptyText.textContent = "Det finns inga inlägg just nu :(";
        postsSection.append(emptyText);
    } else {
        blogPosts.forEach(blogPost => {
            createBPElement(blogPost);
        });
    }

    // Bara inloggade kan skriva inlägg, för andra döljs formuläret
    if (localStorage.getItem("username") === USERNAME) {
        const blogPostForm = document.querySelector(".post-create form") as HTMLFormElement;

        // Sparar det nya inlägget och lägger till det i listan utan att ladda om sidan
        blogPostForm.addEventListener("submit", event => {
            event.preventDefault();
            const blogPost: BlogPost = {
                user: USERNAME,
                title: (document.getElementById("title") as HTMLInputElement).value,
                content: (document.getElementById("content") as HTMLTextAreaElement).value,
                date: Date.now(),
            };

            blogPosts.push(blogPost);
            localStorage.setItem("posts", JSON.stringify(blogPosts));
            createBPElement(blogPost);
        });
    } else {
        (document.querySelector(".post-create") as HTMLElement).hidden = true;
    }
}
