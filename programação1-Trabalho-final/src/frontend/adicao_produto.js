const BASE_URL = "https://api.rodrigoribeiro.net";

function getToken() {
    return localStorage.getItem("authToken");
}

function checkLogin() {
    const token = getToken();
    if (!token) {
        alert("Você precisa estar logado para adicionar produtos.");
        window.location.href = "login.html";
    }
    return token;
}

document.addEventListener("DOMContentLoaded", () => {
    const descricaoInput = document.getElementById("descricao");
    const valorInput = document.getElementById("valor");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const token = checkLogin();

    window.salvar = async () => {
        const descricao = descricaoInput.value;
        const valor = parseFloat(valorInput.value);

        if (!descricao || isNaN(valor)) {
            alert("Preencha a descrição e o valor corretamente.");
            return;
        }

        const novoProduto = {
            descricao: descricao,
            valor: valor
        };

        try {
            const response = await fetch(`${BASE_URL}/produto/cadastrar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(novoProduto)
            });

            const data = await response.json();

            if (data.success) {
                alert(`Produto cadastrado com sucesso!`);
                descricaoInput.value = "";
                valorInput.value = "";

                window.location.href = "produtos.html";
            } else {
                alert(`Erro ao cadastrar: ${data.message || "Token inválido."}`);

                if (data.status_code === 401) {
                    localStorage.removeItem("authToken");
                    window.location.href = "login.html";
                }
            }

        } catch (error) {
            console.error("Erro:", error);
            alert("Erro de conexão com a API.");
        }
    };

    if (token) {
        logoutBtn.classList.remove("hidden");
        loginBtn.style.display = "none";
    } else {
        loginBtn.style.display = "inline-block";
    }

    logoutBtn.onclick = () => {
        localStorage.removeItem("authToken");
        window.location.href = "login.html";
    };

    window.irParaLogin = () => {
        window.location.href = "login.html";
    };

    window.toggleAside = () =>
        document.getElementById("asside").classList.toggle("active");
});
