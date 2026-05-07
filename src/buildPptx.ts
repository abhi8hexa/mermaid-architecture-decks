import PptxGenJS from "pptxgenjs";
import { renderMermaid } from "./renderMermaid.js";
import path from "path";
import fs from "fs";
<<<<<<< HEAD

function calculateImageDimensions(imagePath: string, maxWidth: number = 9.0, maxHeight: number = 4.0) {
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
=======
import { createReadStream } from "fs";

// Function to read PNG dimensions from file header
function getPNGDimensions(filePath: string): { width: number; height: number } {
  const buffer = fs.readFileSync(filePath);
  
  // PNG signature is 8 bytes, IHDR chunk starts at byte 8
  // Width is at bytes 16-19, Height is at bytes 20-23 (big-endian)
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  
  return { width, height };
}

function calculateImageDimensions(imagePath: string, maxWidth: number = 9.0, maxHeight: number = 4.0) {
  try {
    // Get actual image dimensions from PNG file
    const { width: pngWidth, height: pngHeight } = getPNGDimensions(imagePath);
    const actualAspectRatio = pngWidth / pngHeight;

    // Calculate dimensions that fit within maxWidth/maxHeight while maintaining aspect ratio
    let newWidth = maxWidth;
    let newHeight = newWidth / actualAspectRatio;

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * actualAspectRatio;
    }

    return { width: newWidth, height: newHeight };
  } catch (error) {
    // Fallback to default if we can't read PNG dimensions
    console.warn("Could not read PNG dimensions, using default aspect ratio");
    const aspectRatio = 3.5;
    let newWidth = maxWidth;
    let newHeight = newWidth / aspectRatio;

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * aspectRatio;
    }

    return { width: newWidth, height: newHeight };
  }
>>>>>>> f409932 (adding unpushed changes)
}

async function buildPptx(input: string, output: string) {
  const imagePath = await renderMermaid(input);
  const absoluteImagePath = path.resolve(imagePath);

  // Verify the image file exists
  if (!fs.existsSync(absoluteImagePath)) {
    throw new Error(`Generated image file not found: ${absoluteImagePath}`);
  }

  const PptxGenJSClass = PptxGenJS as unknown as new () => any;
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

<<<<<<< HEAD
  // Calculate appropriate dimensions for the diagram
  const { width, height } = calculateImageDimensions(absoluteImagePath);

  // Diagram (canonical, image) - Using calculated dimensions to maintain aspect ratio
=======
  // Calculate appropriate dimensions for the diagram based on actual PNG dimensions
  const { width, height } = calculateImageDimensions(absoluteImagePath);

  // Diagram (canonical, image) - Using actual image aspect ratio to prevent squeezing
>>>>>>> f409932 (adding unpushed changes)
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

  slide.addText(
    "• CI/CD Tool:\n• Cloud:\n• Security:\n• Notes:",
    {
      x: 9.2,
      y: 1.7,
      w: 3,
      h: 4,
      fontSize: 12
    }
  );

  // Canonical footer
  slide.addText(
    "Reference Architecture (Generated) – Do not modify structure",
    {
      x: 5.5,
      y: 6.8,
      fontSize: 8,
      color: "666666"
    }
  );

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