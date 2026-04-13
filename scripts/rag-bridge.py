#!/usr/bin/env python3
import chromadb, json, sys, uuid

client = chromadb.PersistentClient(path="/root/.mempalace/palace")
collection = client.get_collection("mempalace_drawers")

action = sys.argv[1]  # "search" or "store"

if action == "search":
    query = sys.argv[2]
    limit = int(sys.argv[3]) if len(sys.argv) > 3 else 5
    results = collection.query(query_texts=[query], n_results=limit)
    print(json.dumps({"documents": results["documents"][0], "metadatas": results["metadatas"][0]}))

elif action == "store":
    data = json.loads(sys.stdin.read())
    doc_id = str(uuid.uuid4())
    collection.add(documents=[data["text"]], metadatas=[data.get("metadata", {})], ids=[doc_id])
    print(json.dumps({"id": doc_id, "count": collection.count()}))
