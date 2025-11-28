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
    if (!imagem) return alert("Selecione uma imagem!");

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
    const imagemFile = document.getElementById("imageInput").files[0];
    if (!imagemFile) return alert("Selecione uma imagem!");

    const base64 = await fileToBase64(imagemFile);
    const token = localStorage.getItem("authToken");

    const previewImg = document.getElementById("previewImg");
    previewImg.src = "data:image/png;base64," + base64;
    previewImg.style.display = "block";

    try {
        const resp = await fetch(`${API_URL}/detectar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ image: base64, preview: true })
        });

        if (!resp.ok) throw new Error(`Erro: ${resp.status} - ${resp.statusText}`);

        const data = await resp.json();
        console.log("Resposta da API:", data);

        const objetos = data.response.objects;

        if (objetos && objetos.length > 0) {
            let html = "<h3>Objetos detectados:</h3>";
            objetos.forEach(o => {
                html += `
                    <div class="card">
                        <p><strong>Classe:</strong> ${o.class}</p>
                        <p><strong>Confiança:</strong> ${(o.score * 100).toFixed(2)}%</p>
                        <p><strong>Bounding Box:</strong> [${o.boundingbox.xyxy.join(", ")}]</p>
                    </div>
                `;
            });
            document.getElementById("resultado").innerHTML = html;
        } else {
            document.getElementById("resultado").innerHTML = "<h3>Nenhum objeto detectado.</h3>";
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = "data:image/png;base64," + base64;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            ctx.lineWidth = 3;
            ctx.font = "20px Arial";
            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";

            objetos.forEach(o => {
                const [x1, y1, x2, y2] = o.boundingbox.xyxy;
                const label = `${o.class} (${(o.score*100).toFixed(1)}%)`;
                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                ctx.fillText(label, x1, y1 > 20 ? y1 - 5 : y1 + 20);
            });

            const previewProcessado = document.getElementById("previewProcessado");
            previewProcessado.src = canvas.toDataURL();
            previewProcessado.style.display = "block";
        };

    } catch (error) {
        console.error("Erro na detecção de objetos:", error);
        alert("Ocorreu um erro. Veja o console.");
    }
}
