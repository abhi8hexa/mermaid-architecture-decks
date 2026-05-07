# Docker Setup for Mermaid Architecture Decks

This project can now be containerized and run using Docker, making it easy to build PowerPoint presentations from Mermaid diagrams without needing to install dependencies locally.

## Prerequisites

- Docker installed on your system ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose (optional, for easier management)

## Building the Docker Image

```bash
docker build -t mermaid-deck-builder .
```

## Running with Docker

### Option 1: Using Docker Run (Manual)

To build a single diagram:

```bash
docker run --rm \
  -v $(pwd)/diagrams:/app/diagrams \
  -v $(pwd)/output:/app/output \
  mermaid-deck-builder diagrams/cicd.mmd output/cicd.pptx
```

On Windows (PowerShell):
```powershell
docker run --rm `
  -v ${PWD}/diagrams:/app/diagrams `
  -v ${PWD}/output:/app/output `
  mermaid-deck-builder diagrams/cicd.mmd output/cicd.pptx
```

### Option 2: Using Docker Compose (Easier)

Simple one-liner to build with docker-compose:

```bash
docker-compose run --rm mermaid-deck diagrams/cicd.mmd output/cicd.pptx
```

To build multiple diagrams:

```bash
docker-compose run --rm mermaid-deck diagrams/cicd.mmd output/cicd.pptx
docker-compose run --rm mermaid-deck diagrams/agentic-iac.mmd output/agentic-iac.pptx
```

## How It Works

1. **Volume Mounts**: The `-v` flag mounts your local `diagrams` and `output` directories into the container
   - `/app/diagrams` - Where your `.mmd` files are located
   - `/app/output` - Where the generated `.pptx` files will be saved

2. **Entry Point**: The container automatically runs `npm run build:pptx` with the arguments you provide

3. **Cleanup**: The `--rm` flag automatically removes the container after execution to save disk space

## File Structure

```
mermaid-architecture-decks/
├── Dockerfile                 # Container configuration
├── docker-compose.yml         # Docker Compose configuration
├── diagrams/
│   ├── cicd.mmd
│   └── agentic-iac.mmd
├── output/                    # Generated PPTX files (created by Docker)
├── src/
├── package.json
└── README.md
```

## Examples

### Build CI/CD presentation:
```bash
docker-compose run --rm mermaid-deck diagrams/cicd.mmd output/cicd.pptx
```

### Build Agentic IAC presentation:
```bash
docker-compose run --rm mermaid-deck diagrams/agentic-iac.mmd output/agentic-iac.pptx
```

### Build with custom input/output paths:
```bash
docker-compose run --rm mermaid-deck diagrams/custom.mmd output/custom.pptx
```

## Troubleshooting

### Permission Denied on Output Files

If you can't access the output files on Linux, it might be a permissions issue:

```bash
sudo chown -R $USER:$USER output/
```

### Container won't start

Make sure Docker daemon is running:
```bash
docker ps  # Should list running containers
```

### Need to rebuild the image

If you make changes to package.json or src files:
```bash
docker build --no-cache -t mermaid-deck-builder .
```

## Benefits of Docker

✅ **No Local Dependencies**: No need to install Node.js, system libraries, or Puppeteer  
✅ **Consistent Environment**: Works the same on any machine (Windows, Mac, Linux)  
✅ **Easy Distribution**: Share the Docker image with team members  
✅ **Isolated**: Container doesn't affect your system  
✅ **Scalable**: Can run in CI/CD pipelines or cloud environments  

## Production Use

For production deployments or CI/CD pipelines, you can push the image to a registry:

```bash
docker build -t myregistry/mermaid-deck-builder:latest .
docker push myregistry/mermaid-deck-builder:latest
```

Then pull and use it anywhere:
```bash
docker pull myregistry/mermaid-deck-builder:latest
docker run --rm -v $(pwd)/diagrams:/app/diagrams -v $(pwd)/output:/app/output myregistry/mermaid-deck-builder:latest diagrams/cicd.mmd output/cicd.pptx
```
