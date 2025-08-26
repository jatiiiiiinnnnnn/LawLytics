import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))  #type: ignore

# Use Gemini 1.5 Flash for speed and cost-effectiveness
model = genai.GenerativeModel('gemini-1.5-flash') #type: ignore

def analyze_clauses_batch(clauses: list[str]) -> list[dict]:
    """
    Analyzes a batch of legal clauses in a single API call.
    """
    formatted_clauses = "\n".join([f"{i+1}. {clause}" for i, clause in enumerate(clauses)])

    prompt = f"""
    You are a legal analyst AI called LawLytic.
    Analyze EACH of the following legal clauses and provide a risk assessment for every one.

    **Clauses to Analyze:**
    ---
    {formatted_clauses}
    ---

    **Instructions:**
    For each clause, provide:
    1.  **Risk Level:** 'Red' (High Risk), 'Orange' (Moderate Risk), or 'Green' (Standard/Safe).
    2.  **Plain English Explanation:** A simple, friendly one-sentence explanation.
    3.  **Emoji Summary:** 1-3 emojis summarizing the point.

    **CRITICAL RULE:** You MUST return an analysis for every single clause. If you cannot determine the risk, return an object for it with a "risk_level" of "Gray" and an explanation.

    **IMPORTANT:** Return your response ONLY as a single valid JSON array (a list of objects) with exactly {len(clauses)} objects.
    """
    try:
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        analysis_list = json.loads(cleaned_response)
        
        if isinstance(analysis_list, list) and len(analysis_list) == len(clauses):
            return analysis_list
        else:
            print(f"Warning: AI response length mismatch. AI returned {len(analysis_list)} items, expected {len(clauses)}.")
            return [] # Return empty list to trigger error handling in main.py
            
    except Exception as e:
        print(f"Error parsing Gemini batch response: {e}")
        return [] # Return empty list to trigger error handling

def get_answer_from_gemini(context: str, question: str) -> str:
    """
    Answers a user's question based on the document's context.
    """
    prompt = f"""
    You are a helpful AI assistant for LawLytic. Answer the user's question based *only* on the provided context from a legal document. Be friendly and clear.

    If the answer is not in the text, state that the document does not seem to provide that information.

    **Document Context:**
    ---
    {context}
    ---

    **User's Question:** "{question}"

    **Answer:**
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error getting chat answer from Gemini: {e}")
        return "Sorry, I encountered an error while trying to find an answer."


def generate_timeline_from_text(full_text: str) -> list[dict]:
    """
    Uses the Gemini model as an AI agent to extract key events and generate a timeline.
    """
    prompt = f"""
    You are an AI agent specializing in legal case analysis. Your task is to read the following document text and extract key events to build a case timeline.

    Identify significant events such as:
    - Filing dates
    - Hearings
    - Motions filed
    - Evidence submission
    - Client communications
    - Key deadlines
    - Contract signings
    - Incidents or disputes

    For each event, extract the date, a concise description of the event, and the parties involved if mentioned.

    **Document Text:**
    ---
    {full_text[:15000]} 
    ---

    **Instructions:**
    Return your response ONLY as a single valid JSON array of objects. Each object must have the following keys: "date", "event", and "parties".
    The "date" should be as specific as possible (e.g., "2024-08-15"). If a date is ambiguous, use your best judgment.
    The "event" should be a brief, clear description.
    The "parties" should be a short string listing the key people or groups involved (e.g., "Plaintiff, Defendant").

    **Example Response Format:**
    [
      {{
        "date": "2023-01-20",
        "event": "Initial complaint filed with the High Court.",
        "parties": "InnovateTech vs. Quantum Corp"
      }},
      {{
        "date": "2023-03-05",
        "event": "Defendant filed a motion to dismiss.",
        "parties": "Quantum Corp"
      }}
    ]
    """
    try:
        # Using the regular model instance from your file
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        timeline_data = json.loads(cleaned_response)
        
        # Sort the events by date for chronological order
        if isinstance(timeline_data, list):
            timeline_data.sort(key=lambda x: x.get('date', ''))
            return timeline_data
        return []
    except Exception as e:
        print(f"Error generating timeline: {e}")
        return []