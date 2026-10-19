import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const DOCS_DIR = path.join(ROOT, "public", "docs")
const OUT_FILE = path.join(ROOT, "src", "data", "docs-paths.json")

const IGNORE_DIRS = ["图"]

const walk = async (dir, baseDir) => {
    const results = []
    let entries;
    try {
        entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
        return results
    }

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            if(IGNORE_DIRS.includes(entry.name.toLowerCase())){
                continue
            }
            results.push(...(await walk(fullPath, baseDir)))
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
            const relPath = path.relative(baseDir, fullPath).split(path.sep).join("/")
            results.push(relPath)
        }
    }
    return results
}

const main = async () => {
    try {
        await fs.access(DOCS_DIR)
    } catch {
        console.error(`[scan-docs] 目录不存在: ${DOCS_DIR}`);
        process.exit(1)
    }

    const paths = await walk(DOCS_DIR, DOCS_DIR)
    paths.sort();

    await fs.mkdir(path.dirname(OUT_FILE), { recursive: true })
    await fs.writeFile(OUT_FILE, JSON.stringify(paths, null, 2) + "\n", "utf-8")

    console.log(`[scan-docs] 输出: ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch(err => {
    console.error("[scan-docs] 出错了：", err);
    process.exit(1);
})