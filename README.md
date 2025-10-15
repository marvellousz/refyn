# Refyn - AI Code Review Platform

A code review platform that analyzes your code and provides feedback on readability, bugs, and best practices.

## Features

- Upload code files and get reviews on readability, bugs, and best practices
- Supports Python, JavaScript, TypeScript, Go, Java, and more
- Handles large files by breaking them into chunks
- Organized feedback with severity levels
- Dashboard to view review history
- Syntax highlighting for code display

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Syntax Highlighter

### Backend
- FastAPI
- MongoDB
- Groq API
- Pydantic

## Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+
- MongoDB instance (local or Atlas)
- Groq API key

## Quick Start

### Automated Setup (Recommended)

**Linux/macOS:**
```bash
git clone <your-repo>
cd code-review
chmod +x setup.sh
./setup.sh
```

**Windows:**
```bash
git clone <your-repo>
cd code-review
setup.bat
```

### Manual Setup

#### 1. Clone Repository

```bash
git clone <your-repo>
cd code-review
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and Groq API key
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your backend URL
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to use the application!

## How It Works

1. Upload code files
2. System analyzes the code and provides feedback
3. View results in the dashboard

## Project Structure

```
code-review/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI app entry
│   │   ├── models/         # Pydantic models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── requirements.txt
│   └── .env.example
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── .env.example
└── README.md
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/code_review
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deployment

### Backend (Railway/Render)
1. Connect your GitHub repo
2. Set environment variables
3. Deploy from `backend` directory

### Frontend (Vercel)
1. Import project from GitHub
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy

## API Endpoints

- `POST /api/review/upload` - Upload and review a code file
- `GET /api/review/{id}` - Get a specific review
- `GET /api/review/list` - List all reviews
- `GET /api/review/{id}/download` - Download review as PDF/Markdown
- `GET /api/stats` - Get analytics and statistics

## Features to Add

- [ ] Support for multiple file upload
- [ ] Inline code suggestions with diff view
- [ ] Team collaboration features
- [ ] Custom review rules and templates
- [ ] CI/CD integration
- [ ] GitHub/GitLab integration

## License

MIT

## Testing

Upload any code file to test the platform.

## Quick Reference

### Running the Application

**Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Key Commands

```bash
# Backend
pip install -r requirements.txt    # Install dependencies
pytest                              # Run tests
black .                            # Format code

# Frontend
npm install                         # Install dependencies
npm run dev                        # Development server
npm run build                      # Production build
npm run lint                       # Lint code
```

## Contributing

Contributions welcome! Please fork the repository and submit pull requests.

