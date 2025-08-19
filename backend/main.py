# backend/main.py - Fixed Version

import os
import json
import fitz
import asyncio
import base64
import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from services import gemini_service
from datetime import datetime, timezone

# Fix for Vercel Blob import
try:
    from vercel_blob import put
    VERCEL_BLOB_AVAILABLE = True
except ImportError:
    print("⚠️ Vercel Blob not available - file uploads will work without blob storage")
    VERCEL_BLOB_AVAILABLE = False

# --- Enhanced Firebase Initialization ---
def initialize_firebase():
    """Initialize Firebase with comprehensive error handling."""
    try:
        # Check if already initialized
        if firebase_admin._apps:
            print("ℹ️ Firebase already initialized")
            return firestore.client()

        # Check if the Base64 env var exists (for Vercel deployment)
        firebase_key_b64 = os.getenv('FIREBASE_SERVICE_ACCOUNT_BASE64')
        if firebase_key_b64:
            print("🔑 Using Firebase credentials from environment variable")
            key_json = base64.b64decode(firebase_key_b64).decode('utf-8')
            cred_dict = json.loads(key_json)
            cred = credentials.Certificate(cred_dict)
        else:
            # Fallback to local file for local development
            print("🔑 Using Firebase credentials from local file")
            if not os.path.exists("serviceAccountKey.json"):
                raise FileNotFoundError("serviceAccountKey.json not found")
            cred = credentials.Certificate("serviceAccountKey.json")

        firebase_admin.initialize_app(cred)
        
        # Test Firestore connection
        db = firestore.client()
        # Simple test query to verify API is enabled
        db.collection('test').limit(1).get()
        print("✅ Firebase and Firestore initialized successfully")
        return db
    
    except Exception as e:
        error_msg = str(e)
        if "SERVICE_DISABLED" in error_msg or "has not been used" in error_msg:
            print("❌ Firestore API is not enabled. Please enable it in Google Cloud Console:")
            print("   https://console.developers.google.com/apis/api/firestore.googleapis.com/overview")
        elif "serviceAccountKey.json" in error_msg:
            print("❌ Firebase service account file not found")
        else:
            print(f"❌ Firebase initialization error: {error_msg}")
        return None

# Initialize Firebase and get Firestore client
firestore_db = initialize_firebase()

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

# --- In-memory storage fallback ---
memory_db = {}

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
            response = await gemini_service.model.generate_content_async(prompt)
            cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
            analysis_list = json.loads(cleaned_response)

            if isinstance(analysis_list, list) and len(analysis_list) == len(chunk):
                return analysis_list
            else:
                print(f"⚠️  Length mismatch in chunk. Got {len(analysis_list)}, expected {len(chunk)}. Retrying...")
                await asyncio.sleep(1 + attempt)
        
        except Exception as e:
            error_str = str(e)
            print(f"❌ Attempt {attempt + 1}/{max_retries} failed for chunk: {error_str[:100]}...")
            if "429" in error_str or "quota" in error_str:
                await asyncio.sleep(5 + (2 ** attempt))
            else:
                await asyncio.sleep(1 + attempt)
    
    print(f"❌ Chunk analysis failed after {max_retries} retries.")
    return [create_fallback_analysis("AI processing error") for _ in chunk]

# --- Storage Helper Functions ---
def save_document_to_firestore(document_data: dict) -> str | None:
    """Save document to Firestore and return document ID."""
    try:
        if firestore_db:
            doc_ref = firestore_db.collection('documents').add(document_data)
            doc_id = doc_ref[1].id
            print(f"✅ Document {doc_id} saved to Firestore")
            return doc_id
        return None
    except Exception as e:
        error_msg = str(e)
        if "SERVICE_DISABLED" in error_msg:
            print("⚠️ Firestore API not enabled - using memory storage")
        else:
            print(f"⚠️ Failed to save to Firestore: {e}")
        return None

def get_documents_from_firestore(user_id: str) -> list:
    """Get user documents from Firestore."""
    try:
        if firestore_db:
            # Fixed query using filter() method to avoid deprecation warning
            docs_ref = (firestore_db.collection('documents')
                       .where(filter=firestore.FieldFilter('userId', '==', user_id)) # type: ignore
                       .order_by('createdAt', direction=firestore.Query.DESCENDING) # type: ignore
                       .stream())
            
            documents = []
            for doc in docs_ref:
                doc_data = doc.to_dict()
                doc_data['id'] = doc.id
                documents.append(doc_data)
            
            return documents
    except Exception as e:
        error_msg = str(e)
        if "SERVICE_DISABLED" in error_msg:
            print("⚠️ Firestore API not enabled")
        else:
            print(f"⚠️ Failed to fetch from Firestore: {e}")
    return []

def get_document_from_firestore(doc_id: str) -> dict | None:
    """Get document from Firestore."""
    try:
        if firestore_db:
            doc_ref = firestore_db.collection('documents').document(doc_id)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
    except Exception as e:
        print(f"⚠️ Failed to retrieve from Firestore: {e}")
    return None

def upload_to_blob(file_name: str, contents: bytes) -> str | None:
    """Upload file to Vercel Blob with proper error handling."""
    if not VERCEL_BLOB_AVAILABLE:
        print("⚠️ Vercel Blob not available")
        return None
    
    try:
        # Fixed: Remove the 'access' parameter that's causing issues
        blob_result = put(file_name, contents)
        blob_url = blob_result['url']
        print(f"✅ File uploaded to blob: {blob_url}")
        return blob_url
    except Exception as e:
        print(f"⚠️ Vercel Blob upload failed: {e}")
        return None

# --- NEW: Endpoint to fetch document history ---
@app.get("/api/documents")
async def get_documents(userId: str = Query(..., description="User ID to fetch documents for")):
    try:
        # Try Firestore first
        documents = get_documents_from_firestore(userId)
        
        # If Firestore fails, return memory documents for this user
        if not documents:
            documents = [
                {**doc_data, 'id': doc_id} 
                for doc_id, doc_data in memory_db.items() 
                if doc_data.get('userId') == userId
            ]
            # Sort by creation date
            documents.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
        
        return {"documents": documents}
    except Exception as e:
        print(f"❌ Error in get_documents endpoint: {e}")
        # Return empty list instead of error for better UX
        return {"documents": []}

# --- NEW: Endpoint to fetch a single document's full analysis ---
@app.get("/api/document/{doc_id}")
async def get_document_details(doc_id: str):
    # Try Firestore first
    document_data = get_document_from_firestore(doc_id)
    
    # Fallback to memory if Firestore fails
    if not document_data and doc_id in memory_db:
        document_data = memory_db[doc_id]
    
    if not document_data:
        raise HTTPException(status_code=404, detail="Document not found.")
    
    return document_data

# --- ENHANCED: Upload endpoint with proper error handling ---
@app.post("/api/upload")
async def upload_and_analyze_document(userId: str = Query(...), file: UploadFile = File(...)):
    if not userId:
        raise HTTPException(status_code=400, detail="User ID is required.")
        
    try:
        contents = await file.read()
        file_name = file.filename or "uploaded_document.pdf"

        # 1. Upload file to Vercel Blob (with proper error handling)
        blob_url = upload_to_blob(file_name, contents)

        # 2. Extract text from document
        full_text = ""
        if file.content_type == 'application/pdf':
            with fitz.open(stream=contents, filetype="pdf") as doc:
                full_text = "".join(page.get_text() for page in doc) # type: ignore
        elif file.content_type == 'text/plain':
            full_text = contents.decode('utf-8')
        else:
            raise HTTPException(status_code=415, detail="Unsupported file type.")

        # 3. Extract meaningful clauses
        clauses_to_analyze = [
            cleaned for clause in full_text.split('\n') 
            if (cleaned := clause.strip()) and len(cleaned) > 25 and not cleaned.isdigit()
        ]

        if not clauses_to_analyze:
            raise HTTPException(status_code=400, detail="No meaningful clauses found.")
        
        print(f"🔍 Found {len(clauses_to_analyze)} clauses to analyze.")

        # 4. Perform analysis using async logic
        chunk_size = 10
        chunks = [clauses_to_analyze[i:i + chunk_size] for i in range(0, len(clauses_to_analyze), chunk_size)]
        print(f"📦 Split into {len(chunks)} chunks of size ~{chunk_size}.")

        semaphore = asyncio.Semaphore(12)
        
        async def process_with_semaphore(chunk):
            async with semaphore:
                await asyncio.sleep(1)
                return await analyze_chunk(chunk)

        tasks = [process_with_semaphore(chunk) for chunk in chunks]
        chunk_results_list = await asyncio.gather(*tasks)

        # Flatten results
        all_results = [item for sublist in chunk_results_list for item in sublist]

        # Combine results with original text
        analysis_results = []
        for i, clause_text in enumerate(clauses_to_analyze):
            analysis = all_results[i]
            analysis['original_text'] = clause_text
            analysis_results.append(analysis)

        # 5. Generate summary and risk counts
        red_count = sum(1 for r in analysis_results if r.get('risk_level') == 'Red')
        orange_count = sum(1 for r in analysis_results if r.get('risk_level') == 'Orange')
        green_count = sum(1 for r in analysis_results if r.get('risk_level') == 'Green')
        
        # Generate a brief summary using Gemini
        try:
            summary_prompt = f"Summarize the following legal document's purpose in one friendly sentence: {full_text[:2000]}"
            response = await gemini_service.model.generate_content_async(summary_prompt)
            brief_summary = response.text.strip()
        except Exception as e:
            print(f"⚠️ Summary generation failed: {e}")
            brief_summary = f"Legal document analysis for {file_name}"

        # 6. Prepare document data
        document_data = {
            "userId": userId,
            "fileName": file_name,
            "blobUrl": blob_url,
            "createdAt": datetime.now(timezone.utc),
            "summary": brief_summary,
            "riskCounts": {
                "red": red_count,
                "orange": orange_count,
                "green": green_count,
                "total": len(analysis_results)
            },
            "fullAnalysis": analysis_results,
            "fullText": full_text
        }

        # 7. Save to Firestore (with fallback)
        doc_id = save_document_to_firestore(document_data)
        
        if not doc_id:
            # Fallback to memory storage
            doc_id = "doc_" + os.urandom(4).hex()
            memory_db[doc_id] = document_data
            print(f"✅ Document {doc_id} saved to memory (fallback)")

        print(f"✅ Successfully processed document with {len(analysis_results)} clauses.")
        return {"document_id": doc_id, "analysis": analysis_results}

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"💥 Unexpected server error: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

# --- Enhanced Chat Endpoint ---
@app.post("/api/chat")
async def chat_with_document(request: dict):
    """Endpoint for the Q&A feature."""
    doc_id = request.get('document_id')
    question = request.get('question')

    if not doc_id or not question:
        raise HTTPException(status_code=400, detail="Document ID and question are required.")
    
    # Try Firestore first, then fallback to memory
    document_data = get_document_from_firestore(doc_id)
    if not document_data and doc_id in memory_db:
        document_data = memory_db[doc_id]
    
    if not document_data:
        raise HTTPException(status_code=404, detail="Document not found.")
    
    context = document_data.get('fullText', '')
    if not context:
        raise HTTPException(status_code=400, detail="Document text not available for Q&A.")
    
    try:
        # Use the synchronous method if async is not available
        answer = gemini_service.get_answer_from_gemini(context, question)
        return {"answer": answer}
    except Exception as e:
        print(f"❌ Chat error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate answer.")

# --- Health check endpoint ---
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "firebase_connected": firestore_db is not None,
        "storage_type": "firestore" if firestore_db else "memory",
        "services": {
            "firestore": firestore_db is not None,
            "vercel_blob": VERCEL_BLOB_AVAILABLE and os.getenv('BLOB_READ_WRITE_TOKEN') is not None
        }
    }

# --- Root endpoint ---
@app.get("/")
async def root():
    return {"message": "Legal Document Analysis API is running"}