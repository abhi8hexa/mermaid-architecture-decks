import PptxGenJS from "pptxgenjs";
import { renderMermaid } from "./renderMermaid.js";
import path from "path";
import fs from "fs";
function calculateImageDimensions(imagePath, maxWidth = 9.0, maxHeight = 4.0) {
    // Use a simple approach: assume most mermaid diagrams are wide
    // We can parse PNG dimensions if needed, but default to sensible values
    const aspectRatio = 3.5; // Most mermaid flowcharts are wider than tall
    // Calculate dimensions that fit within maxWidth/maxHeight while maintaining aspect ratio
    let newWidth = maxWidth;
    let newHeight = newWidth / aspectRatio;
    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
    }
    return { width: newWidth, height: newHeight };
}
async function buildPptx(input, output) {
    const imagePath = await renderMermaid(input);
    const absoluteImagePath = path.resolve(imagePath);
    // Verify the image file exists
    if (!fs.existsSync(absoluteImagePath)) {
        throw new Error(`Generated image file not found: ${absoluteImagePath}`);
    }
    const PptxGenJSClass = PptxGenJS;
    const pptx = new PptxGenJSClass();
    pptx.layout = "LAYOUT_16x9";
    const slide = pptx.addSlide();
    // Title
    slide.addText("CI/CD Reference Architecture", {
        x: 0.5,
        y: 0.3,
        fontSize: 20,
        bold: true
    });
    // Calculate appropriate dimensions for the diagram
    const { width, height } = calculateImageDimensions(absoluteImagePath);
    // Diagram (canonical, image) - Using calculated dimensions to maintain aspect ratio
    slide.addImage({
        path: absoluteImagePath,
        x: 0.5,
        y: 1.1,
        w: width,
        h: height
    });
    // Editable overlay section
    slide.addText("Customer Context (Editable)", {
        x: 9.2,
        y: 1.1,
        fontSize: 14,
        bold: true
    });
    slide.addText("• CI/CD Tool:\n• Cloud:\n• Security:\n• Notes:", {
        x: 9.2,
        y: 1.7,
        w: 3,
        h: 4,
        fontSize: 12
    });
    // Canonical footer
    slide.addText("Reference Architecture (Generated) – Do not modify structure", {
        x: 5.5,
        y: 6.8,
        fontSize: 8,
        color: "666666"
    });
    await pptx.writeFile({ fileName: output });
}
// CLI
const [, , input, output] = process.argv;
if (!input || !output) {
    console.error("Usage: buildPptx <input.mmd> <output.pptx>");
    process.exit(1);
}
buildPptx(input, output).catch((error) => {
    console.error("Error building presentation:", error);
    process.exit(1);
});
