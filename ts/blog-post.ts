// Visar ett enskilt inlägg på blogg-post.html. Vilket inlägg styrs av ?id= i adressen, se getID() i blog.ts.
// idToBlogPost(), showDate(), newElement(), createCommentListItem(), blogPosts och USERNAME kommer från
// blog.ts och auth.js, som laddas före den här filen.

// Tar bort de fyra första tecknen, "?id="
const searchID = location.search.slice(4);

// Listan med kommentarer, och texten som visas i stället när det inte finns några
const commentsList = document.querySelector(".comments ul") as HTMLUListElement;
const noCommentsText = newElement("p", undefined, "Inga kommentarer än.");

// Fyller i inlägget, eller skickar tillbaka användaren till blogg.html om id:t saknas eller inte finns
function init() {
    if (searchID.length < 5) {
        location.href = "./blogg.html";
        return;
    }

    const blogPost = idToBlogPost(searchID);
    if (!blogPost) {
        location.href = "./blogg.html";
        return;
    }

    const postTitleElement = document.querySelector(".main-post > .title") as HTMLHeadingElement;
    const postUserElement = document.querySelector(".main-post > .username") as HTMLParagraphElement;
    const postContentElement = document.querySelector(".main-post > .content") as HTMLParagraphElement;
    const postDateElement = document.querySelector(".main-post > .date") as HTMLTimeElement;

    postTitleElement.textContent = blogPost.title;
    postUserElement.textContent = "@" + blogPost.user;
    postContentElement.textContent = blogPost.content;
    showDate(postDateElement, blogPost.date);

    showComments(blogPost.comments ?? []);
    setUpCommentForm(blogPost);
}

// Lägger in inläggets kommentarer i listan, eller en text om det inte finns några
function showComments(comments: BlogComment[]) {
    if (comments.length < 1) {
        commentsList.before(noCommentsText);
        return;
    }

    comments.forEach(comment => {
        commentsList.append(createCommentListItem(comment));
    });
}

// Inloggade kan skriva kommentarer. För andra byts formuläret mot en länk till inloggningen.
function setUpCommentForm(blogPost: BlogPost) {
    const commentForm = document.querySelector(".comments form") as HTMLFormElement;

    if (localStorage.getItem("username") !== USERNAME) {
        const loginLink = newElement("a", undefined, "Logga in");
        loginLink.href = "./login.html";
        const loginText = newElement("p", undefined, " för att skriva en kommentar.");
        loginText.prepend(loginLink);
        commentForm.replaceWith(loginText);
        return;
    }

    // Sparar kommentaren i inlägget, visar den i listan utan att ladda om sidan och tömmer formuläret
    commentForm.addEventListener("submit", event => {
        event.preventDefault();
        const comment: BlogComment = {
            user: USERNAME,
            content: (document.getElementById("comment") as HTMLInputElement).value,
            date: Date.now(),
        };

        // blogPost är samma objekt som i blogPosts, så hela listan kan sparas direkt
        blogPost.comments = blogPost.comments ?? [];
        blogPost.comments.push(comment);
        localStorage.setItem("posts", JSON.stringify(blogPosts));

        noCommentsText.remove();
        commentsList.append(createCommentListItem(comment));
        commentForm.reset();
    });
}

// Startar sidan när den har laddats, som i de andra skripten
window.onload = init;
