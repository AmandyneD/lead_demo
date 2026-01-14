from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# ---------- MODELS ----------
class Lead(BaseModel):
    name: str
    source: str
    status: str


# ---------- ROUTES ----------
@app.get("/api/leads")
def get_leads():
    return {
        "leads": [
            {"id": "L-1001", "name": "Ritual Pilates", "source": "LinkedIn", "status": "New"},
            {"id": "L-1002", "name": "Global Group Travel", "source": "Referral", "status": "Qualified"},
            {"id": "L-1003", "name": "Cayuga", "source": "Website", "status": "Contacted"},
        ]
    }


@app.post("/api/score")
def score_lead(lead: Lead):
    score = 50

    if lead.source in ["LinkedIn", "Referral"]:
        score += 20

    if "studio" in lead.name.lower():
        score += 10

    if lead.status == "Qualified":
        score += 15

    return {"score": min(score, 100)}
