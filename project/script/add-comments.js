// Add comments to the documents

function onAddCommentButtonClicked(btn) {
    const id = btn.id.split("_")[btn.id.split("_").length - 1]

    const commentInput = document.getElementById(`commentInput_${id}`);
    const commentList = document.getElementById(`commentList_${id}`);

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
            updateCommentTitleVisibility(id, commentList);
            saveCommentsToLocalStorage(id, commentList);
        };

        comment.appendChild(textSpan);
        comment.appendChild(deleteBtn);

        commentList.appendChild(comment);
        saveCommentsToLocalStorage(id, commentList);
        commentInput.value = "";

        updateCommentTitleVisibility(id, commentList);
    }
}


function updateCommentTitleVisibility(id, commentList) {
    const title = document.getElementById(`commentsTitle_${id}`);
    const hasComments = commentList.querySelectorAll(".comment").length > 0;
    title.style.display = hasComments ? "block" : "none";
}

function saveCommentsToLocalStorage(id, commentList) {
    const comments = Array.from(commentList.querySelectorAll(".comment span")).map(span => span.textContent);
    localStorage.setItem(`documentComments-${id}`, JSON.stringify(comments));
}

function loadCommentsFromLocalStorage(section) {
    const id = section.id.split("_")[section.id.split("_").length - 1]
    const savedComments = JSON.parse(localStorage.getItem(`documentComments-${id}`) || "[]");
    const commentList = document.getElementById(`commentList_${id}`);

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
            updateCommentTitleVisibility(id, commentList);
            saveCommentsToLocalStorage(id, commentList);
        };

        comment.appendChild(textSpan);
        comment.appendChild(deleteBtn);

        commentList.appendChild(comment);
    });

    updateCommentTitleVisibility(id, commentList);
}

// window.addEventListener("DOMContentLoaded", loadCommentsFromLocalStorage);