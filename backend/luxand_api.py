import requests
import json

API_TOKEN = "ae583f7f61f248bd98fd8dce2498cac4"

def detect(image):
    url = "https://api.luxand.cloud/photo/detect"
    headers = {"token": API_TOKEN}

    files = {"photo": image}
    response = requests.post(url, headers=headers, files=files)

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.text}