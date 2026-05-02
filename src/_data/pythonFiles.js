const fs = require("fs");
const path = require("path");
const hljs = require("highlight.js");

module.exports = function () {
  const codeDir = path.resolve(__dirname, "../../sample_code");
  const result = {};

  const pyFiles = fs.readdirSync(codeDir).filter((f) => f.endsWith(".py"));
  for (const file of pyFiles) {
    const slug = file
      .replace(/\.py$/, "")
      .replace(/[\[\]]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    const src = fs.readFileSync(path.join(codeDir, file), "utf-8");
    const highlighted = hljs.highlight(src, { language: "python", ignoreIllegals: true }).value;
    result[slug] = `<pre class="hljs"><code>${highlighted}</code></pre>`;
  }

  return result;
};
