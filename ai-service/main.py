"""
MindField AI Microservice
FastAPI-based recommendation engine and chatbot

Installation:
    pip install fastapi uvicorn scikit-learn numpy

Run:
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np

app = FastAPI(
    title="MindField AI Service",
    description="AI-powered career recommendation and chatbot API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://mindfield.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================
# Data Models
# =====================

class QuizAnswers(BaseModel):
    answers: List[int]  # List of answer indices (0-3) for each question

class ChatMessage(BaseModel):
    message: str

class RecommendationResponse(BaseModel):
    field: str
    confidence: float
    explanation: str

# =====================
# Career Field Data
# =====================

CAREER_FIELDS = {
    "cs": {
        "name": "Computer Science & Software Engineering",
        "icon": "💻",
        "description": "Design and build software, apps, websites, and AI systems.",
        "salary": "PKR 80,000 – 500,000+/month",
        "growth": "Very High",
    },
    "medical": {
        "name": "Medical & Healthcare",
        "icon": "🩺",
        "description": "Become a doctor, surgeon, dentist, or healthcare professional.",
        "salary": "PKR 100,000 – 1,000,000+/month",
        "growth": "High",
    },
    "engineering": {
        "name": "Engineering",
        "icon": "⚙️",
        "description": "Civil, Mechanical, Electrical & Industrial engineering.",
        "salary": "PKR 70,000 – 400,000+/month",
        "growth": "High",
    },
    "business": {
        "name": "Business & Commerce",
        "icon": "📊",
        "description": "Management, accounting, finance, and entrepreneurship.",
        "salary": "PKR 60,000 – 600,000+/month",
        "growth": "Moderate-High",
    },
    "arts": {
        "name": "Arts, Design & Creative Fields",
        "icon": "🎨",
        "description": "Graphic design, fine arts, architecture, and media.",
        "salary": "PKR 40,000 – 300,000+/month",
        "growth": "Moderate",
    },
}

# Scoring matrix: each quiz question has weights per field
# Shape: (num_questions, 4_options, 5_fields)
# Fields: cs, medical, engineering, business, arts (in that order)
SCORING_MATRIX = [
    # Q1: Subject preference
    [[3, 0, 2, 0, 0], [0, 3, 0, 0, 0], [0, 0, 0, 3, 0], [0, 0, 0, 0, 3]],
    # Q2: Problem type preference
    [[3, 0, 0, 0, 0], [0, 3, 0, 0, 0], [0, 0, 0, 3, 0], [0, 0, 0, 0, 3]],
    # Q3: Free time activity
    [[3, 0, 0, 0, 0], [0, 3, 0, 0, 0], [0, 0, 0, 3, 0], [0, 0, 0, 0, 3]],
    # Q4: Work environment
    [[3, 0, 0, 0, 0], [0, 3, 0, 0, 0], [0, 0, 0, 3, 0], [0, 0, 0, 0, 3]],
    # Q5: Team work style
    [[2, 0, 1, 0, 0], [0, 3, 0, 0, 0], [0, 0, 0, 3, 0], [0, 0, 0, 0, 3]],
    # Q6: Natural skills
    [[3, 0, 2, 0, 0], [0, 3, 0, 0, 0], [0, 0, 0, 3, 0], [0, 0, 0, 0, 3]],
    # Q7: Best subject in school
    [[0, 0, 3, 0, 0], [0, 3, 0, 0, 0], [2, 0, 1, 1, 0], [0, 0, 0, 0, 3]],
    # Q8: Ideal workday
    [[3, 0, 0, 0, 0], [0, 3, 0, 0, 0], [0, 0, 0, 3, 0], [0, 0, 0, 0, 3]],
    # Q9: Career priority
    [[3, 0, 0, 0, 0], [0, 3, 0, 0, 0], [0, 0, 0, 3, 0], [0, 0, 0, 0, 3]],
    # Q10: Professional to shadow
    [[3, 0, 0, 0, 0], [0, 3, 0, 0, 0], [0, 0, 0, 3, 0], [0, 0, 0, 0, 3]],
]

FIELD_NAMES = ["cs", "medical", "engineering", "business", "arts"]

def generate_explanation(field: str, confidence: float) -> str:
    """Generate personalized explanation based on field and confidence score."""
    explanations = {
        "cs": f"Your answers reveal a strong affinity for logical thinking, technology, and problem-solving — core traits of successful software engineers. With a {confidence:.0f}% match, a career in CS could lead you to become an AI engineer, full-stack developer, or data scientist.",
        "medical": f"Your responses show a deep interest in biology, human health, and helping others. With a {confidence:.0f}% match, the medical field — including MBBS, BDS, or Pharmacy — aligns well with your values and skillset.",
        "engineering": f"Your strong mathematical aptitude and analytical mindset are hallmarks of great engineers. With a {confidence:.0f}% match, fields like Civil, Mechanical, or Electrical Engineering could be very rewarding for you.",
        "business": f"Your leadership instincts and interest in strategy, finance, and management suggest natural business acumen. With a {confidence:.0f}% match, BBA, MBA, or entrepreneurship could be your ideal path.",
        "arts": f"Your creative expression and visual thinking are rare and valuable traits. With a {confidence:.0f}% match, careers in Graphic Design, UI/UX, Architecture, or Fine Arts could let you thrive and earn well.",
    }
    return explanations.get(field, f"This field matches your profile with {confidence:.0f}% confidence.")

# =====================
# API Endpoints
# =====================

@app.get("/")
def root():
    return {"message": "MindField AI Service is running 🧠", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/recommend")
def recommend(data: QuizAnswers):
    """
    Calculate career field recommendations based on quiz answers.
    
    Args:
        answers: List of answer indices (0-3) for 10 questions
    
    Returns:
        Top 3 career recommendations with confidence scores
    """
    if len(data.answers) == 0:
        raise HTTPException(status_code=400, detail="Answers array cannot be empty")
    
    # Calculate raw scores
    scores = np.zeros(5)  # [cs, medical, engineering, business, arts]
    
    for q_idx, answer_idx in enumerate(data.answers):
        if q_idx < len(SCORING_MATRIX) and 0 <= answer_idx < 4:
            question_scores = SCORING_MATRIX[q_idx][answer_idx]
            scores += np.array(question_scores)
    
    # Normalize to confidence percentages
    max_score = scores.max()
    if max_score == 0:
        confidences = np.ones(5) * 20
    else:
        confidences = (scores / max_score) * 100
    
    # Sort and get top 3
    sorted_indices = np.argsort(confidences)[::-1][:3]
    
    recommendations = []
    for idx in sorted_indices:
        field = FIELD_NAMES[idx]
        confidence = float(confidences[idx])
        field_data = CAREER_FIELDS[field]
        
        recommendations.append({
            "field": field,
            "fieldData": field_data,
            "confidence": round(confidence),
            "explanation": generate_explanation(field, confidence),
            "score": float(scores[idx]),
        })
    
    return {
        "recommendations": recommendations,
        "topField": recommendations[0]["field"] if recommendations else "cs",
    }

@app.post("/chat")
def chat(data: ChatMessage):
    """
    Simple AI chatbot for career guidance queries.
    Returns rule-based responses for common career questions.
    """
    message = data.message.lower().strip()
    
    # Response logic (same as the Next.js API but in Python)
    if any(g in message for g in ["hi", "hello", "salam", "hey"]):
        response = "Assalam-o-Alaikum! 👋 I'm MindBot. How can I help you with your career guidance today?"
    elif "matric" in message or "after matric" in message:
        response = "After Matric, you can choose:\n• FSc Pre-Medical → Medicine\n• FSc Pre-Engineering → Engineering\n• ICS → Computer Science\n• ICOM → Business\n• FA → Arts & Design"
    elif "computer" in message or "software" in message or "cs" in message:
        response = "Computer Science is one of the highest-demand fields in Pakistan! 🚀\n\nRequirements: ICS or FSc Pre-Engineering\nTop Universities: FAST, NUST, LUMS, UET\nStarting Salary: PKR 80,000–150,000/month"
    elif "medical" in message or "doctor" in message or "mbbs" in message:
        response = "Medical field in Pakistan:\n\n✅ Requirements: FSc Pre-Medical\n🎓 Top: AIMC, AKU, KMU\n⏱️ Duration: 5 years + 1 year house job\n💰 Salary: PKR 100K–300K/month (specialists earn much more)"
    elif "engineer" in message:
        response = "Engineering in Pakistan:\n\n✅ Requirements: FSc Pre-Engineering\n🎓 Top: UET, NUST, GIKI, NED\n💰 Starting: PKR 70K–150K/month\nEntry Test: ECAT"
    else:
        response = "I can help with:\n• Fields after Matric/Inter\n• University information\n• Subject requirements\n• Career salaries\n\nWhat would you like to know?"
    
    return {"response": response}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
