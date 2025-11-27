const API = "https://api.rodrigoribeiro.net";
const TOKEN = "SEU_TOKEN_AQUI";

function toggleMenu() {
    document.getElementById("sideMenu").classList.toggle("active");
}

function selectTool(tool) {
    document.getElementById("classify-box").classList.add("hidden");
    document.getElementById("detect-box").classList.add("hidden");

    if (tool === "classify") {
        document.getElementById("classify-box").classList.remove("hidden");
    } else {
        document.getElementById("detect-box").classList.remove("hidden");
    }

    toggleMenu();
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

async function classifyImage() {
    const file = document.getElementById("classifyInput").files[0];
    if (!file) return alert("Selecione uma imagem!");

    const base64 = await toBase64(file);

    document.getElementById("classifyPreview").src = URL.createObjectURL(file);
    document.getElementById("classifyPreview").classList.remove("hidden");
    document.getElementById("classifyResult").innerHTML = "Processando...";

    const resp = await fetch(API + "/classificar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN
        },
        body: JSON.stringify({ image: base64 })
    });

    const data = await resp.json();

    document.getElementById("classifyResult").innerHTML =
        `<p><strong>Classe:</strong> ${data.class}</p>
         <p><strong>Confiança:</strong> ${(data.score * 100).toFixed(2)}%</p>`;
}

async function detectImage() {
    const file = document.getElementById("detectInput").files[0];
    if (!file) return alert("Selecione uma imagem!");

    const base64 = await toBase64(file);

    document.getElementById("detectPreview").src = URL.createObjectURL(file);
    document.getElementById("detectPreview").classList.remove("hidden");
    document.getElementById("detectResult").innerHTML = "Processando...";

    const resp = await fetch(API + "/detectar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN
        },
        body: JSON.stringify({
            image: base64,
            preview: true
        })
    });

    const data = await resp.json();

    let list = "<h3>Objetos Detectados:</h3>";

    data.objects.forEach(obj => {
        list += `<p>• <strong>${obj.class}</strong> (${(obj.score * 100).toFixed(1)}%)</p>`;
    });

    document.getElementById("detectResult").innerHTML = list;

    document.getElementById("detectPreview").src =
        "data:image/png;base64," + data.preview_img;
}
