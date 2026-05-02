const fs = require("fs");
const path = require("path");

module.exports = function () {
  const tilDir = path.resolve(__dirname, "../../til");
  const files = fs
    .readdirSync(tilDir)
    .filter((f) => /^2026-\d{2}-\d{2}\.md$/.test(f))
    .sort()
    .reverse();

  return files.map((filename) => {
    const date = filename.replace(".md", "");
    const raw = fs.readFileSync(path.join(tilDir, filename), "utf-8");

    // 日付抽出: 新形式は "## 日付\nYYYY年MM月DD日", 旧形式はファイル名から
    let displayDate = date;
    const dateMatch = raw.match(/## 日付\s*\n([\d年月日\s]+)/);
    if (dateMatch) {
      displayDate = dateMatch[1].trim();
    }

    // トピック抽出: ### 見出しをすべて収集
    const topics = [];
    const topicRe = /^###\s+(.+)$/gm;
    let m;
    while ((m = topicRe.exec(raw)) !== null) {
      topics.push(m[1].trim());
    }

    // 旧形式トピック: "## トピック: [...]"
    if (topics.length === 0) {
      const oldTopicMatch = raw.match(/## トピック:\s*\[(.+?)\]/);
      if (oldTopicMatch) topics.push(oldTopicMatch[1].trim());
    }

    // 本文テキスト（検索用、先頭500文字）
    const bodyText = raw.replace(/^#+ .+$/gm, "").replace(/\s+/g, " ").trim().slice(0, 500);

    return {
      date,           // "2026-04-29"
      displayDate,    // "2026年04月29日" or "2026-04-29"
      filename,
      topics,
      bodyText,
      content: raw,   // 生のMarkdown（テンプレートでレンダリング）
    };
  });
};
