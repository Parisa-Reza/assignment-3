const aboutDescription = document.querySelector(".about-description");

if (aboutDescription) {
    const toggleBtn = aboutDescription.querySelector(".show-more-btn");
    const extraContent = aboutDescription.querySelector(".description-extra");

    if (toggleBtn && extraContent) {
        aboutDescription.classList.add("collapsed");
        extraContent.hidden = true;

        toggleBtn.addEventListener("click", function () {
            const isExpanded = aboutDescription.classList.toggle("expanded");

            aboutDescription.classList.toggle("collapsed", !isExpanded);
            extraContent.hidden = !isExpanded;
            toggleBtn.textContent = isExpanded ? "Show less" : "Show more";
            toggleBtn.setAttribute("aria-expanded", String(isExpanded));
        });
    }
}
