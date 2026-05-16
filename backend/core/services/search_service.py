from core.services.embedding_service import (
    generate_embedding
)

from core.services.chroma_service import (
    collection
)


def semantic_search(query):

    query_embedding = generate_embedding(
        query
    )

    results = collection.query(

        query_embeddings=[query_embedding],

        n_results=5
    )

    return results