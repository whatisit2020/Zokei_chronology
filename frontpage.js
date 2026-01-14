document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.querySelector(".frontpage-wrapper");
    const targets = document.querySelectorAll(
        ".zokei-logo, .tittle-container"
    );

    if (trigger) {
        trigger.addEventListener("click", () => {
            targets.forEach(el => el.classList.add("active"));
        });
    }
});