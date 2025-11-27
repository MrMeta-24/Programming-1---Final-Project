const BASE_URL = 'https://api.rodrigoribeiro.net';
const cardsDiv = document.getElementById("cards");
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");

function getToken() {
    return localStorage.getItem("authToken");
}

async function carregarLivros() {
    const token = getToken();

    try {
        const response = await fetch(`${BASE_URL}/livros`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        cardsDiv.innerHTML = "";

        if (!data.success) {
            cardsDiv.innerHTML = `<p class="error-message">Erro ao carregar livros: ${data.message || 'Token inválido ou expirado.'}</p>`;
            if (data.status_code === 401) {
                alert('Sessão expirada. Faça login novamente.');
                localStorage.removeItem("authToken");
                window.location.href = "login.html";
            }
            return;
        }

        const livros = data.response;

        if (livros.length === 0) {
            cardsDiv.innerHTML = `<p class="no-books">Nenhum livro cadastrado. Adicione um!</p>`;
            return;
        }

        livros.forEach((livro) => {
            cardsDiv.innerHTML += `
                <div class="card">
                    <img src="${livro.capa || 'https://via.placeholder.com/150'}" alt="Capa">

                    <p class="titulo">${livro.titulo}</p>
                    <p class="resumo">Resumo: ${livro.resumo.substring(0, 100)}...</p>
                    <p class="valor">Valor: R$ ${livro.valor.toFixed(2)}</p>
                    <p class="id">ID: ${livro.idlivro}</p>
                    
                    <button class="btn-edit" onclick="editar(${livro.idlivro})" disabled>Editar</button>
                    <button class="btn-delete" onclick="excluir(${livro.idlivro})" disabled>Excluir</button>
                </div>
            `;
        });
    } catch (error) {
        cardsDiv.innerHTML = `<p class="error-message">Erro de conexão: Não foi possível carregar os livros.</p>`;
        console.error('Erro de rede/API:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const token = getToken();
    
    if (token) {
        logoutBtn.classList.remove("hidden");
        loginBtn.style.display = "none";
        carregarLivros();
    } else {
        loginBtn.style.display = "inline-block";
        cardsDiv.innerHTML = `<p class="no-books">Faça login para visualizar a biblioteca.</p>`;
    }

    window.excluir = function (id) {
        alert(`A API não fornece um endpoint DELETE para livros. Tentativa de excluir ID: ${id}`);
    };

    window.editar = function (id) {

        alert(`A API não fornece um endpoint PUT para livros. Tentativa de editar ID: ${id}`);
    };

    window.irParaLogin = function () {
        window.location.href = "login.html";
    };

    logoutBtn.onclick = () => {
        localStorage.removeItem("authToken");
        window.location.reload();
    };

    window.toggleAside = () =>
        document.getElementById("asside").classList.toggle("active");
});