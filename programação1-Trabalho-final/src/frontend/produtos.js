const BASE_URL = 'https://api.rodrigoribeiro.net';

function getToken() {
    return localStorage.getItem("authToken");
}

async function carregarProdutos() {
    const cardsDiv = document.getElementById("cards");
    const token = getToken();

    try {
        const response = await fetch(`${BASE_URL}/produtos`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        cardsDiv.innerHTML = "";

        if (!data.success) {
            cardsDiv.innerHTML = `<p class="error-message">Erro ao carregar produtos: ${data.message}</p>`;
            if (data.status_code === 401) {
                alert("Sessão expirada!");
                localStorage.removeItem("authToken");
                window.location.href = "login.html";
            }
            return;
        }

        const produtos = data.response;

        if (!produtos || produtos.length === 0) {
            cardsDiv.innerHTML = `<p class="no-products">Nenhum produto cadastrado ainda.</p>`;
            return;
        }
        produtos.forEach(produto => {
            
            cardsDiv.innerHTML += `
                <div class="card">
                    <p class="descricao"><strong>${produto.descricao}</strong></p>
                    <p class="valor">Valor: R$ ${produto.valor.toFixed(2)}</p>
                    <p class="id">ID: ${produto.idproduto}</p>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
        cardsDiv.innerHTML = `<p class="error-message">Erro ao conectar à API.</p>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const loginBtn = document.getElementById("loginBtn");
    const token = getToken();

    if (token) {
        logoutBtn.classList.remove("hidden");
        loginBtn.style.display = "none";
        carregarProdutos();
    } else {
        loginBtn.style.display = "inline-block";
        document.getElementById("cards").innerHTML = `<p class="no-products">Faça login para ver os produtos.</p>`;
    }

    logoutBtn.onclick = () => {
        localStorage.removeItem("authToken");
        window.location.reload();
    };

    window.toggleAside = () =>
        document.getElementById("asside").classList.toggle("active");

    window.irParaLogin = () => {
        window.location.href = "login.html";
    };
});
