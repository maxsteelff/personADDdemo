from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import json

# Configura la aplicación Flask
app = Flask(__name__)
CORS(app)  # Habilita CORS para evitar problemas entre frontend y backend

# Token de la API de Luxand
API_TOKEN = "ae583f7f61f248bd98fd8dce2498cac4"
headers = {
    "token": API_TOKEN
}

# Endpoint para analizar imágenes
@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files['image']
    url = "https://api.luxand.cloud/photo/detect"
    headers = {"token": API_TOKEN}
    files = {"photo": image}

    # Realiza la solicitud a la API de Luxand
    response = requests.post(url, headers=headers, files=files)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to process image", "details": response.text}), response.status_code

# Ruta para servir el archivo index.html
@app.route('/')
def home():
    return render_template('index.html')  # Esto busca index.html dentro de la carpeta templates

# Inicia el servidor
if __name__ == '__main__':
    app.run(debug=True, port=5001)

