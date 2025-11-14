document.addEventListener("DOMContentLoaded", () => {
    const cardsDiv = document.getElementById("cards");
    const logoutBtn = document.getElementById("logoutBtn");
    const loginBtn = document.getElementById("loginBtn");
    
    function carregarLivros() {
        const livros = JSON.parse(localStorage.getItem("livros")) || [];

        cardsDiv.innerHTML = "";

        livros.forEach((livro, index) => {
            cardsDiv.innerHTML += `
                <div class="card">
                    <img src="${livro.image}" alt="Capa">

                    <p class="titulo">${livro.titulo}</p>
                    <p class="autor">Autor: ${livro.autor}</p>
                    <p class="genero">Gênero: ${livro.genero}</p>
                    <p class="ano">Ano: ${livro.ano}</p>

                    <button class="btn-edit" onclick="editar(${index})">Editar</button>
                    <button class="btn-delete" onclick="excluir(${index})">Excluir</button>
                </div>
            `;
        });
    }

    carregarLivros();

    window.excluir = function (i) {
        let livros = JSON.parse(localStorage.getItem("livros")) || [];
        livros.splice(i, 1);
        localStorage.setItem("livros", JSON.stringify(livros));
        carregarLivros();
    };

    window.editar = function (i) {
        localStorage.setItem("editIndex", i);
        window.location.href = "adicao.html";
    };

    window.irParaLogin = function () {
        window.location.href = "login.html";
    };

    const user = localStorage.getItem("isLoggedIn");

    if (user) {
        logoutBtn.classList.remove("hidden");
        loginBtn.style.display = "none";
    } else {
        loginBtn.style.display = "inline-block";
    }

    logoutBtn.onclick = () => {
        localStorage.removeItem("isLoggedIn");
        window.location.reload();
    };

    window.toggleAside = () =>
        document.getElementById("asside").classList.toggle("active");
});
