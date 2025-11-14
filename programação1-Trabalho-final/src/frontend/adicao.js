document.addEventListener("DOMContentLoaded", () => {
    const titulo = document.getElementById("titulo");
    const autor = document.getElementById("autor");
    const genero = document.getElementById("genero");
    const ano = document.getElementById("ano");
    const imagem = document.getElementById("imagem");

    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const editIndex = localStorage.getItem("editIndex");

    if (editIndex !== null) {
        const livros = JSON.parse(localStorage.getItem("livros")) || [];
        const livro = livros[editIndex];

        document.getElementById("tituloPagina").textContent = "Editar Livro";

        titulo.value = livro.titulo;
        autor.value = livro.autor;
        genero.value = livro.genero;
        ano.value = livro.ano;
        imagem.value = livro.image;
    }

    window.salvar = () => {
        let livros = JSON.parse(localStorage.getItem("livros")) || [];

        const novoLivro = {
            titulo: titulo.value,
            autor: autor.value,
            genero: genero.value,
            ano: ano.value,
            image: imagem.value
        };

        if (editIndex !== null) {
            livros[editIndex] = novoLivro;
            localStorage.removeItem("editIndex");
        } else {
            livros.push(novoLivro);
        }

        localStorage.setItem("livros", JSON.stringify(livros));
        window.location.href = "biblioteca.html";
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
        window.location.href = "login.html";
    };

    window.irParaLogin = function () {
        window.location.href = "login.html";
    };

    window.toggleAside = () =>
        document.getElementById("asside").classList.toggle("active");
});
