// Visar ett enskilt inlägg på blogg-post.html. Vilket inlägg styrs av ?id= i adressen, se getID() i blog.ts.
// idToBlogPost() kommer från blog.ts, som laddas före den här filen.

// Tar bort de fyra första tecknen, "?id="
const searchID = location.search.slice(4);

// Fyller i inlägget, eller skickar tillbaka användaren till blogg.html om id:t saknas eller inte finns
function init() {
    if (searchID.length < 5) {
        location.href = "blogg.html";
        return;
    }

    const blogPost = idToBlogPost(searchID);
    if (!blogPost) {
        location.href = "blogg.html";
        return;
    }

    const postTitleElement = document.querySelector(".main-post > .title") as HTMLHeadingElement;
    const postUserElement = document.querySelector(".main-post > .username") as HTMLParagraphElement;
    const postContentElement = document.querySelector(".main-post > .content") as HTMLParagraphElement;
    const postDateElement = document.querySelector(".main-post > .date") as HTMLTimeElement;

    postTitleElement.textContent = blogPost.title;
    postUserElement.textContent = "@" + blogPost.user;
    postContentElement.textContent = blogPost.content;

    // datetime är det maskinläsbara datumet, texten är det som visas
    postDateElement.setAttribute("datetime", new Date(blogPost.date).toISOString());
    postDateElement.textContent = new Date(blogPost.date).toLocaleString("sv-SE", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

// Startar sidan när den har laddats, som i de andra skripten
window.onload = init;
