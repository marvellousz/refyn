# refyn

An AI-powered code review platform that provides instant, detailed feedback on your code quality, security, and best practices.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

Refyn revolutionizes the code review process by leveraging AI to provide instant, comprehensive feedback on your code. Whether you're a solo developer looking for feedback or a team seeking to maintain code quality, Refyn analyzes your code for readability, modularity, maintainability, security vulnerabilities, and potential bugs.

**Who it's for:** Developers, development teams, code reviewers, and anyone looking to improve their code quality through AI-powered insights.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Backend**: FastAPI (Python)
- **Database**: MongoDB with async driver (Motor)
- **AI Engine**: Groq API (LLM-powered analysis)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Syntax Highlighting**: react-syntax-highlighter

## Features

- **AI-Powered Analysis**: Leverages Groq's LLM to provide intelligent code reviews
- **Multi-Language Support**: Works with Python, JavaScript, TypeScript, Java, Go, and 40+ programming languages
- **Comprehensive Scoring**: Get detailed scores for readability, modularity, and maintainability (1-10 scale)
- **Security Analysis**: Identifies potential security vulnerabilities in your code
- **Bug Detection**: Spots potential bugs before they reach production
- **Multi-File Upload**: Upload and analyze multiple files simultaneously
- **User Authentication**: Secure account system with JWT-based authentication
- **Dashboard Analytics**: Visualize your code quality trends and statistics
- **Review History**: Access all your past code reviews with timestamps
- **Instant Feedback**: Receive actionable suggestions in seconds

## Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or MongoDB Atlas)
- Groq API key ([Get one here](https://console.groq.com))

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/refyn.git
cd refyn
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/code_review
GROQ_API_KEY=your_groq_api_key_here
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

```bash
# Start the backend server
uvicorn app.main:app --reload
```

Backend will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
# Start the development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Start MongoDB

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env with your Atlas connection string
```

## Usage

### Getting Started

1. **Create an Account**
   - Visit `http://localhost:3000`
   - Click "Get Started" on the homepage
   - Register with your email, username, and password

2. **Login**
   - Enter your credentials to access the platform

### Uploading Code for Review

1. **Navigate to Upload Tab**
   - Click the "Upload" button in the navigation bar
   
2. **Upload Your Code**
   - Drag and drop files or click to browse
   - Supports multiple file uploads
   - Maximum file size: 10MB per file
   
3. **Receive AI Analysis**
   - Refyn automatically detects the programming language
   - AI analyzes your code and provides:
     - **Readability Score** (1-10)
     - **Modularity Score** (1-10)
     - **Maintainability Score** (1-10)
     - **Overall Summary**
     - **Strengths** of your code
     - **Issues** with severity levels (critical, warning, suggestion, info)
     - **Suggestions** for improvement
     - **Potential Bugs**
     - **Security Concerns**

### Using the Dashboard

1. **Navigate to Dashboard Tab**
   - View your code review statistics
   - See language distribution
   - Track average scores across all reviews
   - Monitor recent review activity

### Accessing Review History

1. **Navigate to History Tab**
   - Browse all your past code reviews
   - Click on any review to view full details
   - Filter and search through your reviews

## Deployment

### Backend Deployment (Railway/Render/Heroku)

1. **Prepare for deployment**
   ```bash
   cd backend
   ```

2. **Set environment variables** in your deployment platform:
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   GROQ_API_KEY=your_groq_api_key
   CORS_ORIGINS=https://your-frontend-domain.com
   MAX_FILE_SIZE=10485760
   ```

3. **Deploy**
   - The platform will automatically detect the Python app and install requirements

### Frontend Deployment (Vercel - Recommended)

1. **Connect your GitHub repository** to Vercel

2. **Configure build settings**:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add environment variables** in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

4. **Deploy** - Vercel handles the build automatically

## Contributing

Contributions are welcome! Whether it's bug fixes, new features, or documentation improvements, we appreciate your help.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript strict mode for frontend code
- Write meaningful commit messages
- Test your changes thoroughly before submitting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Email**: pranavmurali024@gmail.com
- **GitHub**: [https://github.com/marvellousz](https://github.com/marvellousz)

## Acknowledgments

- Powered by [Groq](https://groq.com) for ultra-fast LLM inference
- Built with [Next.js](https://nextjs.org) and [FastAPI](https://fastapi.tiangolo.com)
- UI components styled with [Tailwind CSS](https://tailwindcss.com)

---

Built with ❤️ for developers who care about code quality
