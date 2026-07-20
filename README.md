# J.A.R.V.I.S. — Personal AI Assistant

A full-stack AI chat assistant with a React frontend and an Express backend powered by Groq's `llama-3.3-70b` model.

## ✨ Features

- ⚡ Fast, low-latency responses via [Groq](https://groq.com/)
- 🧠 Powered by `llama-3.3-70b-versatile`
- 🌐 REST API backend built with Express
- ⚛️ React 19 frontend
- 🔒 CORS-protected API with configurable origins
- 📝 Request logging middleware
- 🩺 Health check endpoint

## 🏗️ Tech Stack

**Backend**
- Node.js + Express
- Groq SDK
- dotenv, cors

**Frontend**
- React 19
- React Router DOM 7

## 📁 Project Structure

```
jarvis/
├── backend/
│   ├── routes/
│   │   └── chat.js
│   ├── index.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    ├── package.json
    └── README.md
```

> Adjust the tree above to match your actual repo layout (e.g. if backend and frontend live in separate top-level folders or separate repos).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- A free [Groq API key](https://console.groq.com/keys)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your Groq API key:

```
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
NODE_ENV=development
```

Start the backend:

```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start
```

The API will be available at `http://localhost:5000`.

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

The app will be available at `http://localhost:3000`.

## 📡 API Endpoints

| Method | Endpoint      | Description                  |
|--------|---------------|-------------------------------|
| GET    | `/`           | API status and info           |
| POST   | `/api/chat`   | Send a message to the assistant |
| GET    | `/api/health` | Health check                  |

### Example request

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, JARVIS"}'
```

## 🔐 Environment Variables

| Variable         | Description                        | Required |
|------------------|-------------------------------------|----------|
| `GROQ_API_KEY`   | Your Groq API key                   | ✅       |
| `PORT`           | Port the backend runs on (default 5000) | ❌   |
| `NODE_ENV`       | `development` or `production`       | ❌       |

Never commit your real `.env` file — only `.env.example` should be tracked in git.

## 🛠️ Available Scripts

**Backend**
- `npm start` – run the server
- `npm run dev` – run with nodemon for hot-reload

**Frontend**
- `npm start` – run in development mode
- `npm run build` – build for production
- `npm test` – run tests

## 🗺️ Roadmap

- [ ] Voice input/output
- [ ] Conversation history / memory
- [ ] Streaming responses
- [ ] Deployment guide (Render / Vercel / Railway)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

## 📄 License

This project is licensed under the MIT License — feel free to use and modify it.



