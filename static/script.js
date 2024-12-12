document.getElementById("start-system").addEventListener("click", startRecognition);
document.getElementById("save-record").addEventListener("click", saveRecord);

let recordedAges = [];  // Array to store the ages recorded

function startRecognition() {
    // Hides the welcome section and shows the camera section
    document.getElementById("welcome-section").classList.add("hidden");
    document.getElementById("camera-section").classList.remove("hidden");

    // Starts the camera and video stream
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            const video = document.getElementById("camera");
            video.srcObject = stream;

            // Set up a timer to capture frames from the camera and analyze the image
            setInterval(captureAndAnalyze, 2000);  // Captures and analyzes every 2 seconds
        })
        .catch((err) => {
            console.error("Error al acceder a la cámara:", err);
            alert("No se pudo acceder a la cámara.");
        });
}

function captureAndAnalyze() {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("snapshot");
    const context = canvas.getContext("2d");

    // Configura el tamaño del canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convierte la imagen en un blob y envíala a la API
    canvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append("image", blob);

        fetch("http://127.0.0.1:5001/analyze", {
            method: "POST",
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert("Error al procesar la imagen");
            } else {
                const detectedAge = data[0]?.age || "Desconocida";
                document.getElementById("age").textContent = detectedAge;
                displayAdvertisement(detectedAge);
            }
        })
        .catch((err) => console.error("Error:", err));
    });
}

function displayAdvertisement(age) {
    let advertisementText = "";
    if (age <= 12) {
        advertisementText = "Anuncio para niños: ¡Compra juguetes!";
    } else if (age <= 18) {
        advertisementText = "Anuncio para jóvenes: ¡Nuevas tendencias de moda!";
    } else if (age <= 60) {
        advertisementText = "Anuncio para adultos: ¡Tecnología de vanguardia!";
    } else {
        advertisementText = "Anuncio para adultos mayores: ¡Cuidado de la salud!";
    }
    document.getElementById("advertisement").textContent = advertisementText;
}

function saveRecord() {
    const detectedAge = document.getElementById("age").textContent;
    if (detectedAge === "Desconocida") {
        alert("No se ha detectado una edad válida.");
    } else {
        recordedAges.push(detectedAge);
        updateSavedRecords();
    }
}

function updateSavedRecords() {
    const savedRecordsList = document.getElementById("saved-records");
    savedRecordsList.innerHTML = "";  // Clear current list
    recordedAges.forEach((age, index) => {
        const li = document.createElement("li");
        li.textContent = `Registro #${index + 1}: Edad detectada: ${age}`;
        savedRecordsList.appendChild(li);
    });
}

