window.toggleAside = function () {
    document.getElementById("asside").classList.toggle("active");
};

window.irParaLogin = function () {
    window.location.href = "login.html";
};

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const loginBtn = document.getElementById("loginBtn");

    if (localStorage.getItem("authToken")) {
        logoutBtn.classList.remove("hidden");
        loginBtn.style.display = "none";
    } else {
        loginBtn.style.display = "inline-block";
    }

    logoutBtn.onclick = () => {
        localStorage.removeItem("authToken");
        window.location.href = "login.html";
    };
});
