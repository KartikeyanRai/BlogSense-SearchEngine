
---

## 🧠 Personal Blog Search Engine

A custom search engine that filters out generic, SEO-driven content and highlights high-quality personal blogs and articles — built with React, Express, MongoDB, and powered by a BERT-based AI classifier.

---

### 📌 Features

* 🔍 **Search UI** built in React for querying authentic blogs.
* 🤖 **AI Classification** using a lightweight DistilBERT model to distinguish personal blogs from promotional or SEO-heavy content.
* 🕸️ **Web Crawler** (BFS-based) that scrapes blogs from seed URLs and follows internal links.
* 🧹 **Smart Filtering** of results based on classifier confidence and content relevance.
* 💾 Data stored in **MongoDB**, served via an **Express.js API**.

---

### 🧱 Tech Stack

* **Frontend**: React, Tailwind CSS
* **Backend API**: Express.js + MongoDB
* **Crawler**: Node.js + Cheerio + Axios
* **AI Model**: DistilBERT (via Transformers), scikit-learn, PyTorch
* **Classifier API**: Flask

---

### 🛠️ Installation & Setup

#### 1. Clone the repo

```bash
git clone https://github.com/your-username/personal-blog-search.git
cd personal-blog-search
```

#### 2. Backend Setup (Node + Express)

```bash
cd Backend
npm install
# Make sure MongoDB is running locally
npm start
```

#### 3. Crawler Setup

```bash
# Still in /Backend
node crawler.js
```

#### 4. Classifier Setup (Python + Flask)

```bash
cd classifier
python -m venv venv
venv\Scripts\activate  # on Windows
pip install -r requirements.txt
python train_classifier.py   # trains and saves model as classifier.pkl
python classifier_api.py     # starts Flask API at localhost:5000
```

#### 5. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

### 🔍 How It Works

1. **Crawling**: The crawler visits a list of seed URLs, extracts links, and uses BFS to follow related blog pages.
2. **Filtering**: Each page is passed to the classifier API which returns whether it's personal or generic based on content.
3. **Storage**: Only personal, high-quality blogs are saved in MongoDB.
4. **Search**: The user can search these curated articles from the React frontend.

---

### 📦 Folder Structure

```
MySearchEngine/Backend            → Express API + crawler.js
MySearchEngine/                   → React UI
MySearchEngine/classifier         → Python model + Flask API
```

---

### 🧪 Example Queries

Try searching for:

* `"how I became a product manager"`
* `"my journey into programming"`
* `"from engineer to founder"`

---

### 🚀 Future Improvements

* Add pagination in frontend
* Add summaries or tags using LLMs
* Improve classifier accuracy with larger dataset
* Deploy as full-stack app on Render / Vercel

---

### 🙌 Credits

* [HuggingFace Transformers](https://huggingface.co/)
* [Cheerio](https://cheerio.js.org/)
* Inspired by developers who share their real journeys ✨


