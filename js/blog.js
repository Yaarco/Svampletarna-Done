"use strict";
// Bloggen. Inläggen sparas som JSON i localStorage under nyckeln "posts".
// Filen laddas på blogg.html och blogg-post.html. På blogg.html visas alla inlägg och inloggade kan skriva nya,
// blog-post.ts använder idToBlogPost() för att hitta inlägget som ska visas.
// Ett inläggs id är titel och datum ihop, base64-kodat så att det kan stå i adressen (?id=...)
function getID(blogData) {
    return btoa(blogData.title + "|" + blogData.date);
}
// Avkodar ett id från getID() och letar upp inlägget med samma titel och datum
function idToBlogPost(id) {
    // decoded = <titel>|datum(unix timestamp)
    const decoded = atob(id);
    const date = decoded.split("|").pop();
    const title = decoded.replace("|" + date, "");
    return blogPosts.find(bp => bp.title === title && bp.date === Number(date));
}
// ---------- Funktioner som bygger HTML för inlägg och kommentarer ----------
// Skapar ett element med valfri klass och text, t.ex. newElement("p", "user", "@Kalle") ger <p class="user">@Kalle</p>
function newElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className)
        element.className = className;
    if (text !== undefined)
        element.textContent = text;
    return element;
}
// Visar ett datum i ett <time>-element. datetime är det maskinläsbara datumet, texten är det som visas.
function showDate(timeElement, date) {
    timeElement.dateTime = new Date(date).toISOString();
    timeElement.textContent = new Date(date).toLocaleString("sv-SE", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}
// Skapar <time class="date"> med ett datum
function newDateElement(date) {
    const timeElement = newElement("time", "date");
    showDate(timeElement, date);
    return timeElement;
}
// Skapar ett inlägg i listan på blogg.html:
// <li><article> rubrik med länk, datum, användare och antal kommentarer </article></li>
function createPostListItem(blogPost) {
    // Rubriken är en länk till blogg-post.html, som visar hela inlägget
    const link = newElement("a", undefined, blogPost.title);
    link.href = "./blogg-post.html?id=" + getID(blogPost);
    const title = newElement("h3", "title");
    title.append(link);
    const date = newDateElement(blogPost.date);
    const user = newElement("p", "user", "@" + blogPost.user);
    // Pratbubbla och antal kommentarer, 0 om inlägget saknar kommentarer
    const commentIcon = newElement("img");
    commentIcon.src = "./img/comment.svg";
    commentIcon.alt = "Kommentarer";
    const commentCount = newElement("span", undefined, String(blogPost.comments?.length ?? 0));
    const comments = newElement("p", "comments");
    comments.append(commentIcon, commentCount);
    const article = newElement("article");
    article.append(title, date, user, comments);
    const listItem = newElement("li");
    listItem.append(article);
    return listItem;
}
// Skapar en kommentar på blogg-post.html: <li> användare, datum och text </li>
function createCommentListItem(comment) {
    const listItem = newElement("li");
    listItem.append(newElement("p", "username", "@" + comment.user), newDateElement(comment.date), newElement("p", "content", comment.content));
    return listItem;
}
// Alla inlägg. Läses in efter exempelinläggen ovan, så att de syns redan vid första besöket.
const blogPosts = JSON.parse(localStorage.getItem("posts") || "[]");
// Koden nedan gäller bara blogg.html, som har listan med inlägg
const postsSection = document.querySelector(".posts");
if (postsSection) {
    const postsList = postsSection.querySelector("ol");
    if (blogPosts.length < 1) {
        postsSection.append(newElement("p", undefined, "Det finns inga inlägg just nu :("));
    }
    else {
        // Nyaste inlägget först. Sorterar en kopia så att ordningen i localStorage inte ändras
        [...blogPosts].sort((a, b) => b.date - a.date).forEach(blogPost => {
            postsList.append(createPostListItem(blogPost));
        });
    }
    // Bara inloggade kan skriva inlägg, för andra döljs formuläret
    if (localStorage.getItem("username") === USERNAME) {
        const blogPostForm = document.querySelector(".post-create form");
        // Sparar det nya inlägget, lägger till det i listan utan att ladda om sidan och tömmer formuläret
        blogPostForm.addEventListener("submit", event => {
            event.preventDefault();
            const blogPost = {
                user: USERNAME,
                title: document.getElementById("title").value,
                content: document.getElementById("content").value,
                date: Date.now(),
            };
            blogPosts.push(blogPost);
            localStorage.setItem("posts", JSON.stringify(blogPosts));
            // Det nya inlägget är nyast och hamnar därför överst
            postsList.prepend(createPostListItem(blogPost));
            document.querySelector(".posts > p")?.remove();
            blogPostForm.reset();
        });
    }
    else {
        document.querySelector(".post-create").hidden = true;
    }
}
