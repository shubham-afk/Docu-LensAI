import chromadb


client = chromadb.Client()


collection = client.get_or_create_collection(
    name="documents"
)


def store_document_embedding(

    document_id,

    text,

    embedding,

    metadata
):

    collection.add(

        ids=[str(document_id)],

        documents=[text],

        embeddings=[embedding],

        metadatas=[metadata]
    )