document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const logoutBtn = document.getElementById("logoutBtn");

    window.toggleForm = function () {
        loginForm.classList.toggle("hidden");
        registerForm.classList.toggle("hidden");
    };

    document.getElementById("register").addEventListener("submit", (e) => {
        e.preventDefault();

        const user = {
            username: registerUsername.value,
            email: registerEmail.value,
            password: registerPassword.value
        };

        let users = JSON.parse(localStorage.getItem("usuarios")) || [];

        if (users.find(u => u.email === user.email)) {
            alert("Esse email já está cadastrado!");
            return;
        }

        users.push(user);
        localStorage.setItem("usuarios", JSON.stringify(users));

        alert("Usuário registrado!");
        toggleForm();
    });

    document.getElementById("login").addEventListener("submit", (e) => {
        e.preventDefault();

        let users = JSON.parse(localStorage.getItem("usuarios")) || [];

        const user = users.find(u =>
            u.email === loginEmail.value &&
            u.password === loginPassword.value
        );

        if (!user) return alert("Email ou senha inválidos!");

        localStorage.setItem("isLoggedIn", JSON.stringify(user));

        window.location.href = "biblioteca.html";
    });

    window.toggleAside = function () {
        document.getElementById("asside").classList.toggle("active");
    };

    if (localStorage.getItem("isLoggedIn")) {
        logoutBtn.classList.remove("hidden");
        logoutBtn.onclick = function () {
            localStorage.removeItem("isLoggedIn");
            window.location.href = "login.html";
        };
    }
});
