import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
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