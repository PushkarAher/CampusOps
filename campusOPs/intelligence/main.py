from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import numpy as np
import os
import uvicorn

app = FastAPI(title="CampusOps Intelligence Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "CampusOps Intelligence Microservice",
        "status": "online",
        "health": "/health"
    }

# Load model for semantic similarity (small and fast for CPU)
model = SentenceTransformer('all-MiniLM-L6-v2')

class TextRequest(BaseModel):
    text: str

class TextsRequest(BaseModel):
    texts: list[str]

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/embed")
def get_embedding(req: TextRequest):
    embedding = model.encode(req.text)
    return {"embedding": embedding.tolist()}

@app.post("/similarity")
def get_similarity(req: TextsRequest):
    if len(req.texts) != 2:
        return {"error": "Need exactly 2 texts"}
    
    embeddings = model.encode(req.texts)
    # Cosine similarity
    similarity = np.dot(embeddings[0], embeddings[1]) / (np.linalg.norm(embeddings[0]) * np.linalg.norm(embeddings[1]))
    
    return {"similarity": float(similarity)}

@app.post("/analyze")
def analyze_text(req: TextRequest):
    text = req.text.lower()
    
    # Deterministic scoring for Safety Hazard based on keywords
    high_hazard_keywords = ["fire", "smoke", "electric", "shock", "spark", "gas", "chemical", "spill", "blood", "injury", "danger"]
    medium_hazard_keywords = ["broken", "leak", "water", "slip", "trip", "fall", "sharp", "glass"]
    
    safety_hazard = 0.1
    for kw in high_hazard_keywords:
        if kw in text:
            safety_hazard = 0.95
            break
    if safety_hazard == 0.1:
        for kw in medium_hazard_keywords:
            if kw in text:
                safety_hazard = 0.65
                break
                
    # Deterministic scoring for Facility Criticality
    high_crit_keywords = ["lab", "server", "data center", "exam", "auditorium", "main hall", "generator"]
    medium_crit_keywords = ["classroom", "library", "cafeteria", "office", "restroom"]
    
    facility_criticality = 0.2
    for kw in high_crit_keywords:
        if kw in text:
            facility_criticality = 0.90
            break
    if facility_criticality == 0.2:
        for kw in medium_crit_keywords:
            if kw in text:
                facility_criticality = 0.50
                break

    return {
        "safety_hazard": safety_hazard,
        "facility_criticality": facility_criticality
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
