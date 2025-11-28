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
    }

    logoutBtn.onclick = () => {
        localStorage.removeItem("authToken");
        window.location.href = "login.html";
    };
});

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]); 
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const API_URL = "https://api.rodrigoribeiro.net";

async function classificarImagem() {
    const imagem = document.getElementById("imageInput").files[0];
    if (!imagem) { alert("Selecione uma imagem!"); return; }

    const base64 = await fileToBase64(imagem);
    document.getElementById("previewImg").src = "data:image/png;base64," + base64;
    document.getElementById("previewImg").style.display = "block";

    const token = localStorage.getItem("authToken");

    const resp = await fetch(`${API_URL}/classificar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ image: base64 })
    });

    const data = await resp.json();

    document.getElementById("resultado").innerHTML = `
        <div class="card">
            <h3>Classificação:</h3>
            <p><strong>Classe:</strong> ${data.response.class}</p>
            <p><strong>Confiança:</strong> ${(data.response.score * 100).toFixed(2)}%</p>
        </div>
    `;
}

async function detectarObjetos() {
    const imagem = document.getElementById("imageInput").files[0];
    if (!imagem) { alert("Selecione uma imagem!"); return; }

    const base64 = await fileToBase64(imagem);
    document.getElementById("previewImg").src = "data:image/png;base64," + base64;
    document.getElementById("previewImg").style.display = "block";

    const token = localStorage.getItem("authToken");

    try {
        const resp = await fetch(`${API_URL}/detectar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ image: base64, preview: true })
        });

        if (!resp.ok) throw new Error(`Erro ao detectar objetos: ${resp.statusText}`);

        const data = await resp.json();

        if (data.objects && data.objects.length > 0) {
            let lista = "<h3>Objetos detectados:</h3>";

            data.objects.forEach(o => {
                lista += `
                    <div class="card">
                        <p><strong>Classe:</strong> ${o.class}</p>
                        <p><strong>Confiança:</strong> ${(o.score * 100).toFixed(2)}%</p>
                        <p><strong>Caixa:</strong> [${o.boundingbox.xyxy.join(", ")}]</p>
                    </div>
                `;
            });

            document.getElementById("resultado").innerHTML = lista;

            document.getElementById("previewProcessado").src = "data:image/png;base64," + data.preview_img;
            document.getElementById("previewProcessado").style.display = "block";
        } else {
            document.getElementById("resultado").innerHTML = "<h3>Nenhum objeto detectado.</h3>";
        }

    } catch (error) {
        console.error('Erro na detecção de objetos:', error);
        alert("Ocorreu um erro ao detectar objetos. Verifique o console.");
    }
}
