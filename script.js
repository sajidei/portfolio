const themeToggle = document.getElementById("themeToggle");
const apkModal = document.getElementById("apkModal");
const closeModal = document.getElementById("closeModal");
const helpButtons = document.querySelectorAll(".help-btn");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "OFF";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    const isLight = document.body.classList.contains("light");
    themeToggle.textContent = isLight ? "OFF" : "ON";
    localStorage.setItem("theme", isLight ? "light" : "dark");
});

helpButtons.forEach((button) => {
    button.addEventListener("click", () => {
        apkModal.classList.add("open");
        apkModal.setAttribute("aria-hidden", "false");
    });
});

closeModal.addEventListener("click", () => {
    apkModal.classList.remove("open");
    apkModal.setAttribute("aria-hidden", "true");
});

apkModal.addEventListener("click", (event) => {
    if (event.target === apkModal) {
        apkModal.classList.remove("open");
        apkModal.setAttribute("aria-hidden", "true");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        apkModal.classList.remove("open");
        apkModal.setAttribute("aria-hidden", "true");
    }
});
