const fs = require("fs");
const path = require("path");

module.exports = function () {
  const codeDir = path.resolve(__dirname, "../../sample_code");
  const notebooksDir = path.resolve(__dirname, "./notebooks");

  const files = fs.readdirSync(codeDir).filter((f) => {
    const ext = path.extname(f);
    return ext === ".ipynb" || ext === ".py";
  });

  return files.map((filename) => {
    const ext = path.extname(filename);
    const type = ext === ".ipynb" ? "notebook" : "python";
    const fullPath = path.join(codeDir, filename);
    const stat = fs.statSync(fullPath);
    const sizeKb = Math.ceil(stat.size / 1024);

    const slug = filename
      .replace(/\.ipynb$|\.py$/, "")
      .replace(/[\[\]]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    let description = "";
    let cells = [];

    if (type === "notebook") {
      const jsonPath = path.join(notebooksDir, `${slug}.json`);
      if (fs.existsSync(jsonPath)) {
        const nb = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        cells = nb.cells || [];
        const firstMarkdown = cells.find((c) => c.type === "markdown" && c.source.trim());
        if (firstMarkdown) {
          description = firstMarkdown.source
            .replace(/^#+ .+\n?/gm, "")
            .replace(/\*\*/g, "")
            .trim()
            .slice(0, 100);
        }
      }
    } else {
      const src = fs.readFileSync(fullPath, "utf-8");
      const commentMatch = src.match(/^#\s+(.+)/m) || src.match(/^"""([\s\S]+?)"""/m);
      if (commentMatch) description = commentMatch[1].trim().slice(0, 100);
    }

    return {
      filename,
      name: filename,
      slug,
      type,
      size: `${sizeKb} KB`,
      description,
    };
  });
};
