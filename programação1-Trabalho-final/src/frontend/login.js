const BASE_URL = 'https://api.rodrigoribeiro.net';
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const logoutBtn = document.getElementById("logoutBtn");

window.toggleForm = function () {
    loginForm.classList.toggle("hidden");
    registerForm.classList.toggle("hidden");
};

function setToken(token) {
    localStorage.setItem("authToken", token);
}

document.getElementById("register").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = registerEmail.value;
    const senha = registerPassword.value;

    try {
        const response = await fetch(`${BASE_URL}/registrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, senha: senha })
        });

        const data = await response.json();

        if (data.success) {
            alert(`Registro bem-sucedido! ${data.message}`);
            toggleForm();
        } else {
            alert(`Erro ao registrar: ${data.message || 'Verifique o console para mais detalhes.'}`);
            console.error('Detalhes do Erro:', data);
        }
    } catch (error) {
        alert('Erro de conexão com a API.');
        console.error('Erro de rede/API:', error);
    }
});

document.getElementById("login").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginEmail.value;
    const senha = loginPassword.value;

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, senha: senha })
        });

        const data = await response.json();

        if (data.success && data.response && data.response.token) {
            setToken(data.response.token);
            alert("Login efetuado com sucesso!");
            window.location.href = "hub.html";
        } else {
            alert(`Erro ao fazer login: ${data.message || 'Credenciais inválidas.'}`);
            console.error('Detalhes do Erro:', data);
        }
    } catch (error) {
        alert('Erro de conexão com a API.');
        console.error('Erro de rede/API:', error);
    }
});

if (localStorage.getItem("authToken")) {
    logoutBtn.classList.remove("hidden");
    logoutBtn.onclick = function () {
        localStorage.removeItem("authToken");
        window.location.href = "login.html";
    };
}

window.toggleAside = function () {
    document.getElementById("asside").classList.toggle("active");
};