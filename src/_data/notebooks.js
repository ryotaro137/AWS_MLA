const fs = require("fs");
const path = require("path");

module.exports = function () {
  const notebooksDir = path.resolve(__dirname, "./notebooks");
  if (!fs.existsSync(notebooksDir)) return {};

  const result = {};
  for (const file of fs.readdirSync(notebooksDir)) {
    if (!file.endsWith(".json")) continue;
    const slug = file.replace(".json", "");
    const data = JSON.parse(fs.readFileSync(path.join(notebooksDir, file), "utf-8"));
    result[slug] = data;
  }
  return result;
};
