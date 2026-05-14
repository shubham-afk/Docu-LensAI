from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Document
from .serializers import DocumentSerializer

import pdfplumber


class UploadDocumentView(APIView):

    def post(self, request):

        uploaded_file = request.FILES.get("file")

        if not uploaded_file:

            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        extracted_text = ""

        try:

            with pdfplumber.open(uploaded_file) as pdf:

                for page in pdf.pages:

                    text = page.extract_text()

                    if text:
                        extracted_text += text

            document = Document.objects.create(
                file=uploaded_file,
                extracted_text=extracted_text
            )

            serializer = DocumentSerializer(document)

            return Response({
                "message": "File processed successfully",
                "document": serializer.data,
                "text": extracted_text[:3000]
            })

        except Exception as e:

            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )