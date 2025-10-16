# refyn

Code review platform that analyzes your code and provides feedback on readability, bugs, and best practices.

## Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your MongoDB URI and Groq API key to .env
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
# Add your backend URL to .env.local
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

**Backend (.env):**
```
MONGODB_URI=mongodb://localhost:27017/code_review
GROQ_API_KEY=your_groq_api_key_here
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Tech Stack

- Next.js, TypeScript, Tailwind CSS
- FastAPI, MongoDB, Groq API

