from django.urls import path

from .views import (
    UploadDocumentView,
    SemanticSearchView
)

urlpatterns = [

    path(
        "upload/",
        UploadDocumentView.as_view()
    ),

    path(
        "search/",
        SemanticSearchView.as_view()
    ),
]