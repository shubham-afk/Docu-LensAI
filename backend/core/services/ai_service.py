import json

from openai import OpenAI
from django.conf import settings
from documents.models import Document

client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)


def analyze_document(text):

    prompt = f"""
You are a document intelligence system.

Analyze the document and return ONLY valid JSON.

Do not return explanations.
Do not use markdown.
Do not wrap in ```json.

Return this exact structure:

{{
  "document_type": "",
  "summary": "",
  "important_fields": {{
    "name": "",
    "email": "",
    "phone": "",
    "skills": [],
    "organizations": [],
    "projects": []
  }},
  "sensitive_information": []
}}

Document:
{text[:6000]}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.1
    )

    result = response.choices[0].message.content.strip()

    # Remove accidental markdown formatting
    result = result.replace("```json", "").replace("```", "").strip()

    try:
        parsed_json = json.loads(result)
        return parsed_json

    except json.JSONDecodeError:

        return {
            "document_type": "Unknown",
            "summary": "Failed to parse AI response",
            "important_fields": {},
            "sensitive_information": [],
            "raw_response": result
        }


def semantic_search(query):
    """
    Perform semantic search on documents using AI to find relevant matches.
    """
    from django.db.models import Q
    
    if not query or not query.strip():
        return []
    
    # Search documents by extracted text
    documents = Document.objects.filter(
        Q(extracted_text__icontains=query)
    ).values('id', 'file', 'extracted_text')[:10]
    
    results = []
    for doc in documents:
        results.append({
            "id": doc['id'],
            "file": doc['file'],
            "snippet": doc['extracted_text'][:500]
        })
    
    return results