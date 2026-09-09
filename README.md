# AI Developer Workspace

An AI-powered web-based developer workspace for generating, explaining, debugging, improving, converting, and testing code.

## Features

- AI code generation
- Code explanation
- Code debugging
- Code improvement
- Code conversion
- Test generation
- Documentation generation
- Gemini integration
- Groq integration
- Automatic AI provider selection
- Copy generated responses
- Download generated responses
- Modern responsive UI

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Python
- FastAPI

### AI

- Google Gemini API
- Groq API

## Setup

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd ai-developer-workspace
cd backend 
python -m venv venv    
venv\Scripts\activate  
uvicorn app:app --reload       
cd frontend
start index.html