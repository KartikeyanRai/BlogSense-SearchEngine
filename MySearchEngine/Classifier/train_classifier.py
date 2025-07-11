# train_classifier.py
from transformers import DistilBertTokenizer, DistilBertModel
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report
import torch
import pandas as pd
import json
from tqdm import tqdm

# Load and prepare data
with open('blog_samples.json', 'r', encoding='utf-8') as f:
    samples = json.load(f)

texts = [s['title'] + ' ' + s['content'][:500] for s in samples]
labels = [s['label'] for s in samples]

# Load tokenizer and model
tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
model = DistilBertModel.from_pretrained("distilbert-base-uncased")
model.eval()

def get_bert_embeddings(texts):
    embeddings = []
    for text in tqdm(texts, desc="Generating BERT embeddings"):
        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        with torch.no_grad():
            outputs = model(**inputs)
            cls_embedding = outputs.last_hidden_state[:, 0, :].squeeze().numpy()  # [CLS] token
            embeddings.append(cls_embedding)
    return embeddings

X = get_bert_embeddings(texts)
y = labels

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Train a simple classifier
clf = LogisticRegression()
clf.fit(X_train, y_train)

# Evaluate
preds = clf.predict(X_test)
print(classification_report(y_test, preds))

# Save model
import pickle
with open("classifier.pkl", "wb") as f:
    pickle.dump(clf, f)
