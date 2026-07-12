import json
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import google.generativeai as genai

# Configure Gemini once at startup using environment-provided credentials.
genai.configure(api_key=os.getenv("AIzaSyDYhZhb38JlkNCb8DZ2LAD9onm3nXUHKekY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def parse_prompt_with_gemini(prompt_text: str) -> list[int]:
    """Parse user intent into COCO class IDs using Gemini 1.5 Flash.

    Returns an empty list when the model output is not valid JSON.
    """
    model = genai.GenerativeModel("gemini-1.5-flash")
    system_instruction = (
        "You are a traffic analysis AI. The user will ask you to count specific "
        "vehicles. Map their request to these specific COCO dataset IDs: "
        "Car=2, Motorcycle=3, Bus=5, Truck=7. You must return ONLY a valid JSON "
        "array of these integers (e.g., [2, 5]). Do not include markdown "
        "formatting, backticks, or any other conversational text."
    )

    try:
        response = model.generate_content(f"{system_instruction}\n\nUser request: {prompt_text}")
        raw_text = (response.text or "").strip()
        parsed = json.loads(raw_text)

        # Accept only integer arrays for downstream robustness.
        if isinstance(parsed, list) and all(isinstance(item, int) for item in parsed):
            return parsed
        return []
    except (json.JSONDecodeError, TypeError, ValueError, AttributeError):
        return []


@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "AI Traffic Backend is running"}


@app.get("/download/report")
async def download_report():
    return FileResponse(
        "static/reports/traffic_report.pdf",
        media_type="application/pdf",
        filename="Traffic_Report.pdf",
    )
