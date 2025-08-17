# backend/main.py

# backend/main.py

import os
import json
import fitz
import asyncio
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services import gemini_service # Assuming this has the Gemini model instance

app = FastAPI()

# --- CORS Middleware ---
origins = ["http://localhost:3000", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory storage for hackathon ---
db = {}

# --- Helper Functions ---
def create_fallback_analysis(reason: str) -> dict:
    """Creates a single fallback analysis object."""
    return {
        "risk_level": "Gray",
        "plain_english": f"Analysis failed: {reason}",
        "emoji_summary": "⚠️"
    }

async def analyze_chunk(chunk: list[str], max_retries: int = 2) -> list[dict]:
    """Asynchronously analyzes a single chunk of clauses with retry logic."""
    
    # Simple prompt with truncated clauses to avoid being too verbose
    formatted_clauses = "\n".join([f"{i+1}. {clause[:500]}" for i, clause in enumerate(chunk)])
    prompt = f"""
    Analyze EACH of the following {len(chunk)} legal clauses.
    **Clauses:**
    ---
    {formatted_clauses}
    ---
    **CRITICAL:** Return a JSON array with EXACTLY {len(chunk)} objects.
    Each object must have "risk_level" (Red/Orange/Green/Gray), "plain_english" (string), and "emoji_summary" (string).
    """

    for attempt in range(max_retries):
        try:
            # Use generate_content_async for non-blocking API calls
            response = await gemini_service.model.generate_content_async(prompt)
            
            cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
            analysis_list = json.loads(cleaned_response)

            if isinstance(analysis_list, list) and len(analysis_list) == len(chunk):
                return analysis_list
            else:
                # Handle the AI returning a malformed list
                print(f"⚠️  Length mismatch in chunk. Got {len(analysis_list)}, expected {len(chunk)}. Retrying...")
                await asyncio.sleep(1 + attempt) # Wait before retrying a mismatch
        
        except Exception as e:
            error_str = str(e)
            print(f"❌ Attempt {attempt + 1}/{max_retries} failed for chunk: {error_str[:100]}...")
            if "429" in error_str or "quota" in error_str:
                # If rate limited, wait longer before the next attempt
                await asyncio.sleep(5 + (2 ** attempt)) 
            else:
                # For other errors, a short wait is enough
                await asyncio.sleep(1 + attempt)
    
    # If all retries fail, return a list of fallback objects
    print(f"❌ Chunk analysis failed after {max_retries} retries.")
    return [create_fallback_analysis("AI processing error") for _ in chunk]


# --- Main API Endpoint ---
@app.post("/api/upload")
async def upload_and_analyze_document(file: UploadFile = File(...)):
    try:
        full_text = ""
        contents = await file.read()

        if file.content_type == 'application/pdf':
            with fitz.open(stream=contents, filetype="pdf") as doc:
                full_text = "".join(page.get_text() for page in doc) #type: ignore
        elif file.content_type == 'text/plain':
            full_text = contents.decode('utf-8')
        else:
            raise HTTPException(status_code=415, detail="Unsupported file type.")

        # Extract meaningful clauses
        clauses_to_analyze = [
            cleaned for clause in full_text.split('\n') 
            if (cleaned := clause.strip()) and len(cleaned) > 25 and not cleaned.isdigit()
        ]

        if not clauses_to_analyze:
            raise HTTPException(status_code=400, detail="No meaningful clauses found.")
        
        print(f"🔍 Found {len(clauses_to_analyze)} clauses to analyze.")

        # Smart chunking
        chunk_size = 10 # A balanced number for the free tier RPM
        chunks = [clauses_to_analyze[i:i + chunk_size] for i in range(0, len(clauses_to_analyze), chunk_size)]
        print(f"📦 Split into {len(chunks)} chunks of size ~{chunk_size}.")

        # --- High-Performance Asynchronous Processing ---
        # The free tier allows 15 RPM. We'll be conservative and allow 12 concurrent requests.
        semaphore = asyncio.Semaphore(12) 
        
        async def process_with_semaphore(chunk):
            async with semaphore:
                # Add a small delay to distribute requests over the minute
                await asyncio.sleep(1) 
                return await analyze_chunk(chunk)

        # Create and run all analysis tasks concurrently
        tasks = [process_with_semaphore(chunk) for chunk in chunks]
        chunk_results_list = await asyncio.gather(*tasks)

        # Flatten the list of lists into a single list of results
        all_results = [item for sublist in chunk_results_list for item in sublist]

        # Combine results with original text
        analysis_results = []
        for i, clause_text in enumerate(clauses_to_analyze):
            analysis = all_results[i]
            analysis['original_text'] = clause_text
            analysis_results.append(analysis)

        doc_id = "doc_" + os.urandom(4).hex()
        db[doc_id] = {"analysis": analysis_results, "full_text": full_text}

        print(f"✅ Successfully processed document with {len(analysis_results)} clauses.")
        return {"document_id": doc_id, "analysis": analysis_results}

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"💥 Unexpected server error: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

# ... (your /api/chat endpoint remains the same)

@app.post("/api/chat")
async def chat_with_document(request: dict):
    """Endpoint for the Q&A feature."""
    doc_id = request.get('document_id')
    question = request.get('question')

    if not doc_id or not question or doc_id not in db:
        raise HTTPException(status_code=404, detail="Document not found or question missing.")
    
    context = db[doc_id]['full_text']
    answer = gemini_service.get_answer_from_gemini(context, question) #type: ignore
    
    return {"answer": answer}