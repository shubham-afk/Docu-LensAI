from rest_framework.views import APIView
from rest_framework.response import Response
import pdfplumber

class UploadDocumentView(APIView):

    def post(self, request):

        uploaded_file = request.FILES.get("file")

        extracted_text = ""

        with pdfplumber.open(uploaded_file) as pdf:
            for page in pdf.pages:
                text = page.extract_text()

                if text:
                    extracted_text += text

        return Response({
            "message": "File processed",
            "text": extracted_text[:3000]
        })