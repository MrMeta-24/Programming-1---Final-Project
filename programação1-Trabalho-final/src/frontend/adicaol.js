const BASE_URL = 'https://api.rodrigoribeiro.net';

function getToken() {
    return localStorage.getItem("authToken");
}

function checkLogin() {
    const token = getToken();
    if (!token) {
        alert("Você precisa estar logado para adicionar livros.");
        window.location.href = "login.html";
    }
    return token;
}

document.addEventListener("DOMContentLoaded", () => {
    const tituloInput = document.getElementById("titulo");
    const imagemInput = document.getElementById("capa");
    const resumoInput = document.getElementById("resumo"); 
    const valorInput = document.getElementById("valor"); 
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const editIndex = localStorage.getItem("editIndex");

    const token = checkLogin(); 


    window.salvar = async () => {
        const titulo = tituloInput.value;
        const resumo = resumoInput.value;
        const valor = parseFloat(valorInput.value);
        const capa = imagemInput.value;

        if (!titulo || !resumo || isNaN(valor) || !capa) {
            alert("Preencha titulo, resumo , Valor e capa  corretamente.");
            return;
        }

        const novoLivro = {
            titulo: titulo,
            resumo: resumo,
            capa: capa,
            valor: valor
        };
        
        try {
            const response = await fetch(`${BASE_URL}/livro/cadastrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(novoLivro)
            });

            const data = await response.json();

            if (data.success) {
                alert(`Livro cadastrado com sucesso! ${data.message}`);
                tituloInput.value = '';
                resumoInput.value = '';
                valorInput.value = '';
                imagemInput.value = '';
                
                window.location.href = "biblioteca.html"; 
            } else {
                alert(`Erro ao cadastrar: ${data.message || 'Verifique o token.'}`);
                console.error('Detalhes do Erro:', data);
                if (data.status_code === 401) {
                    localStorage.removeItem("authToken");
                    window.location.href = "login.html";
                }
            }
        } catch (error) {
            alert('Erro de conexão com a API.');
            console.error('Erro de rede/API:', error);
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

    window.irParaLogin = function () {
        window.location.href = "login.html";
    };

    window.toggleAside = () =>
        document.getElementById("asside").classList.toggle("active");
});