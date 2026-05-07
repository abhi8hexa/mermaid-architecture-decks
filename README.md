# Mermaid Architecture Decks

This repo generates PowerPoint architecture decks from Mermaid diagrams.

## Purpose
- Mermaid = source of truth
- PowerPoint = presentation artifact
- Diagrams are canonical and generated
- Sales edits only overlays and text

## How It Works
1. Mermaid diagrams live in `/diagrams`
2. GitHub Actions generates PPTX on every change
3. PPTX files are published as build artifacts

## For DevOps / Architects
- Edit Mermaid diagrams
- Push changes
- Let CI generate decks

## For Sales / Solution Engineers
- Download PPTX from GitHub Actions
- Edit the "Customer Context" section
- DO NOT edit diagram shapes

## Diagram Rules
✅ Edit text, annotations, highlights  
🚫 Do not ungroup or modify diagram images  

## Local Run (Optional)
docker build -t mermaid-architecture-decks .
docker run --rm -v $(pwd)/output:/app/output mermaid-architecture-decks
=======
# mermaid-architecture-decks
generating ppt using mermaid diagrams

