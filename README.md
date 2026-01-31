#  Real-Time Collaborative Docs (Next.js + CRDTs)

A high-performance, Google Docs-style collaborative editor built to master **Distributed Systems** and **Conflict-Free Replicated Data Types (CRDTs)**. 

Unlike standard CRUD apps, this project handles real-time synchronization, offline support, and binary state persistence using a custom WebSocket engine.

## 🏗 The Architecture

This isn't just a text editor; it's a sync engine. 

* **State Management:** Uses **Y.js** (CRDTs) to handle conflict resolution mathematically. If User A types "A" and User B types "B" simultaneously, both users eventually converge to the same state without data loss.
* **Transport Layer:** A custom **Node.js + Hocuspocus** WebSocket server handles ephemeral connections and broadcasts updates.
* **Persistence:** Document state is **not** stored as strings. It is stored as **Binary Vectors (Uint8Array)** in a **PostgreSQL** database using the `Bytes` type.

### System Flow
```mermaid
graph TD
    ClientA[Client A (Tiptap)] -->|Binary Diff| WS[WebSocket Server]
    ClientB[Client B (Tiptap)] -->|Binary Diff| WS
    WS -->|Broadcast| ClientA
    WS -->|Broadcast| ClientB
    WS -->|Debounced Save (Buffer)| DB[(PostgreSQL)]