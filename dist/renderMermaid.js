import path from "path";
import fs from "fs";
import { run } from "@mermaid-js/mermaid-cli";
export async function renderMermaid(inputPath) {
    if (!fs.existsSync(inputPath)) {
        throw new Error(`Mermaid file not found: ${inputPath}`);
    }
    if (!fs.existsSync("output")) {
        fs.mkdirSync("output");
    }
    const outputPng = path.join("output", path.basename(inputPath, ".mmd") + ".png");
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
    await run(inputPath, outputPng, {
        puppeteerConfig: {
            executablePath,
            args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"]
        },
        quiet: true,
        outputFormat: "png",
        parseMMDOptions: {
            backgroundColor: "transparent"
        }
    });
    return outputPng;
}
