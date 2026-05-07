import crypto from "crypto";
import fs from "fs";
export function hashFile(filePath) {
    const content = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(content).digest("hex");
}
