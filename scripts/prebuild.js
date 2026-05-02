const fs = require("fs");
const path = require("path");

const SAMPLE_CODE_DIR = path.resolve(__dirname, "../sample_code");
const DATA_DIR = path.resolve(__dirname, "../src/_data");
const NOTEBOOKS_DIR = path.join(DATA_DIR, "notebooks");
const SEARCH_INDEX_PATH = path.join(DATA_DIR, "searchIndex.json");
const TIL_DIR = path.resolve(__dirname, "../til");

// notebooks ディレクトリを作成
if (!fs.existsSync(NOTEBOOKS_DIR)) fs.mkdirSync(NOTEBOOKS_DIR, { recursive: true });

// ===== ipynb パース =====
const ipynbFiles = fs
  .readdirSync(SAMPLE_CODE_DIR)
  .filter((f) => f.endsWith(".ipynb"));

for (const file of ipynbFiles) {
  const raw = fs.readFileSync(path.join(SAMPLE_CODE_DIR, file), "utf-8");
  let nb;
  try {
    nb = JSON.parse(raw);
  } catch (e) {
    console.warn(`[prebuild] Failed to parse ${file}: ${e.message}`);
    continue;
  }

  const cells = (nb.cells || []).map((cell) => ({
    type: cell.cell_type,
    source: Array.isArray(cell.source) ? cell.source.join("") : cell.source || "",
  }));

  const slug = file
    .replace(".ipynb", "")
    .replace(/[\[\]]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  const out = { name: file, slug, cells };
  fs.writeFileSync(
    path.join(NOTEBOOKS_DIR, `${slug}.json`),
    JSON.stringify(out, null, 2)
  );
  console.log(`[prebuild] Parsed notebook: ${file} → ${slug}.json`);
}

// ===== 検索インデックス生成 =====
const searchDocs = [];

// TIL ドキュメント
const tilFiles = fs
  .readdirSync(TIL_DIR)
  .filter((f) => /^2026-\d{2}-\d{2}\.md$/.test(f))
  .sort();

for (const filename of tilFiles) {
  const date = filename.replace(".md", "");
  const content = fs.readFileSync(path.join(TIL_DIR, filename), "utf-8");
  const text = content.replace(/^#+ .+$/gm, "").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
  searchDocs.push({
    id: `til-${date}`,
    type: "til",
    title: `TIL ${date}`,
    url: `/til/${date}/`,
    body: text.slice(0, 1000),
  });
}

// Sample Code ドキュメント
const codeFiles = fs.readdirSync(SAMPLE_CODE_DIR);
for (const file of codeFiles) {
  const ext = path.extname(file);
  if (ext !== ".py" && ext !== ".ipynb") continue;

  const slug = file
    .replace(/\.ipynb$|\.py$/, "")
    .replace(/[\[\]]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  let body = "";
  if (ext === ".ipynb") {
    try {
      const nb = JSON.parse(fs.readFileSync(path.join(SAMPLE_CODE_DIR, file), "utf-8"));
      body = (nb.cells || [])
        .map((c) => (Array.isArray(c.source) ? c.source.join("") : c.source || ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .slice(0, 1000);
    } catch (_) {}
  } else {
    body = fs.readFileSync(path.join(SAMPLE_CODE_DIR, file), "utf-8").slice(0, 1000);
  }

  searchDocs.push({
    id: `code-${slug}`,
    type: "code",
    title: file,
    url: `/code/${slug}/`,
    body,
  });
}

fs.writeFileSync(SEARCH_INDEX_PATH, JSON.stringify(searchDocs, null, 2));
console.log(`[prebuild] Search index: ${searchDocs.length} documents → searchIndex.json`);
