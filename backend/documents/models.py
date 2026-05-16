from django.db import models


class Document(models.Model):

    file = models.FileField(
        upload_to="documents/"
    )

    extracted_text = models.TextField()

    ai_summary = models.TextField(
        blank=True,
        null=True
    )

    document_type = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    metadata_json = models.JSONField(
        blank=True,
        null=True
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.file.name