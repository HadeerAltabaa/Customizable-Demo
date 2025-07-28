// Add comments to the documents
const commentInput = document.getElementById("commentInput");
const addCommentBtn = document.getElementById("addCommentBtn");
const commentList = document.getElementById("commentList");

addCommentBtn.addEventListener("click", () => {
    const commentText = commentInput.value.trim();

    if (commentText !== "") {
        const comment = document.createElement("div");
        comment.className = "comment";

        const textSpan = document.createElement("span");
        textSpan.textContent = commentText;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "\u00D7"; // x code
        deleteBtn.className = "delete-comment-btn";
        deleteBtn.title = "Delete this Comment";
        deleteBtn.onclick = () => {
            comment.remove();
            updateCommentTitleVisibility();
            saveCommentsToLocalStorage();
        };

        comment.appendChild(textSpan);
        comment.appendChild(deleteBtn);

        commentList.appendChild(comment);
        saveCommentsToLocalStorage();
        commentInput.value = "";

        updateCommentTitleVisibility();
    }
});

function updateCommentTitleVisibility() {
    const title = document.getElementById("commentsTitle");
    const hasComments = commentList.querySelectorAll(".comment").length > 0;
    title.style.display = hasComments ? "block" : "none";
}

function saveCommentsToLocalStorage() {
    const comments = Array.from(commentList.querySelectorAll(".comment span")).map(span => span.textContent);
    localStorage.setItem("documentComments", JSON.stringify(comments));
}

function loadCommentsFromLocalStorage() {
    const savedComments = JSON.parse(localStorage.getItem("documentComments") || "[]");

    commentList.innerHTML = "";

    savedComments.forEach(commentText => {
        const comment = document.createElement("div");
        comment.className = "comment";

        const textSpan = document.createElement("span");
        textSpan.textContent = commentText;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "\u00D7";
        deleteBtn.className = "delete-comment-btn";
        deleteBtn.title = "Delete this Comment";
        deleteBtn.onclick = () => {
            comment.remove();
            updateCommentTitleVisibility();
            saveCommentsToLocalStorage();
        };

        comment.appendChild(textSpan);
        comment.appendChild(deleteBtn);

        commentList.appendChild(comment);
    });

    updateCommentTitleVisibility();
}

window.addEventListener("DOMContentLoaded", loadCommentsFromLocalStorage);