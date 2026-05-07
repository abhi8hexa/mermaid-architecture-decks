FROM node:20-slim

# Install system dependencies required for Puppeteer and mermaid-cli
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxfont2 \
    libxft2 \
    libxi6 \
    libxinerama1 \
    libxrandr2 \
    libxrender1 \
    libgbm1 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libpixman-1-0 \
    libdrm2 \
    libxkbcommon-x11-0 \
    libxkbcommon0 \
    libfontconfig1 \
    libnss3 \
    p11-kit \
    fonts-dejavu-core \
    chromium \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY tsconfig.json .

# Install dependencies
RUN npm ci

# Copy source files
COPY src ./src

# Copy diagrams folder
COPY diagrams ./diagrams

# Compile TypeScript to JavaScript
RUN npx tsc

# Create output directory
RUN mkdir -p output

# Add non-root user for safer Puppeteer execution
RUN groupadd appuser && \
    useradd -g appuser -m -s /bin/sh appuser && \
    chown -R appuser:appuser /app

# Set environment variables for Puppeteer in Docker
ENV MMDC_EXTRA_FLAGS="--no-sandbox --disable-gpu --disable-dev-shm-usage"
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"

# Copy entrypoint script
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

USER appuser

# Set the entrypoint
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["diagrams/cicd.mmd", "output/cicd.pptx"]