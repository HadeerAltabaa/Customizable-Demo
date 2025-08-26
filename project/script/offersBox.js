function createAnOffer(sectionId, offerId, content) {
    // Create styled message element
    const msgEl = document.createElement("div");
    msgEl.textContent = content;
    msgEl.classList.add("message-box");
    msgEl.id = offerId

    // Append to target
    const target = document.querySelector(`#previewID-${sectionId}`);
    if (target) {
        target.appendChild(msgEl);
        const p = target.querySelector("p");
        if (p) p.remove();
    }
}