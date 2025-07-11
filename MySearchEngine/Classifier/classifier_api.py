from flask import Flask, request, jsonify
import pickle
from transformers import DistilBertTokenizer, DistilBertModel
import torch
import numpy as np

app = Flask(__name__)

# Load model and tokenizer
with open('classifier.pkl', 'rb') as f:
    clf = pickle.load(f)

tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
bert = DistilBertModel.from_pretrained("distilbert-base-uncased")
bert.eval()

def get_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = bert(**inputs)
        return outputs.last_hidden_state[:, 0, :].squeeze().numpy()

@app.route('/classify', methods=['POST'])
def classify():
    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        embedding = get_embedding(text).reshape(1, -1)
        prediction = clf.predict(embedding)[0]
        proba = clf.predict_proba(embedding)[0]
        confidence = float(max(proba))

        print(f"[INFO] Predicted label: {prediction}, Confidence: {confidence:.4f}")

        return jsonify({
            "label": int(prediction),
            "confidence": confidence
        })
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({"error": "Classification failed"}), 500

if __name__ == '__main__':
    app.run(port=5000)

