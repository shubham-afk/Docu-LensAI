from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Document
from .serializers import DocumentSerializer

from core.services.ai_service import analyze_document, semantic_search
import pdfplumber

from core.services.embedding_service import generate_embedding

from core.services.chroma_service import store_document_embedding

from core.services.search_service import semantic_search


class UploadDocumentView(APIView):

    def post(self, request):

        uploaded_files = request.FILES.getlist("files") 

        results = []

        for uploaded_file in uploaded_files:

            extracted_text = ""

            with pdfplumber.open(uploaded_file) as pdf:

                total_pages = len(pdf.pages)

                for page in pdf.pages:

                    text = page.extract_text()

                    if text:
                        extracted_text += text + "\n"

            ai_analysis = analyze_document(
                extracted_text
            )

            embedding = generate_embedding(
                extracted_text
            )

            document = Document.objects.create(

                file=uploaded_file,

                extracted_text=extracted_text,

                ai_summary=ai_analysis.get(
                    "summary",
                    ""
                ),

                document_type="PDF",

                metadata_json=ai_analysis
            )

            store_document_embedding(

                document.id,

                extracted_text,

                embedding,

                {
                    "file_name": uploaded_file.name,
                    "skills": ai_analysis.get(
                        "important_fields",
                        {}
                    ).get(
                        "skills",
                        []
                    )
                }
            )

            results.append({

                "id": document.id,

                "file_name": uploaded_file.name,

                "skills": ai_analysis.get(
                    "important_fields",
                    {}
                ).get(
                    "skills",
                    []
                ),

                "summary": ai_analysis.get(
                    "summary",
                    ""
                )
            })

        return Response({
            "documents": results
        })


class SemanticSearchView(APIView):

    def post(self, request):

        query = request.data.get("query")

        if not query:

            return Response({"error": "Query is required"}, status=400)

        results = semantic_search(query)

        return Response({"results": results})
