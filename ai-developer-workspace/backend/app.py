from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ai import ask_ai


app = FastAPI(
    title="AI Developer Workspace",
    description="AI-powered developer assistant using Gemini and Groq.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AIRequest(BaseModel):
    provider: str = "auto"
    action: str
    prompt: str
    code: str = ""
    language: str = "javascript"


@app.get("/")
def root():
    return {
        "message": "AI Developer Workspace API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.post("/api/ai")
def generate_ai_response(request: AIRequest):

    if not request.prompt.strip():
        return {
            "success": False,
            "error": "Please enter a request."
        }

    try:
        result = ask_ai(
            provider=request.provider,
            action=request.action,
            prompt=request.prompt,
            code=request.code,
            language=request.language,
        )

        return {
            "success": True,
            "result": result,
            "provider": request.provider,
            "action": request.action,
        }

    except Exception as error:

        return {
            "success": False,
            "error": str(error)
        }