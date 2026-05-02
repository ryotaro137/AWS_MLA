const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const hljs = require("highlight.js");
const path = require("path");

module.exports = function (eleventyConfig) {
  // markdown-it + highlight.js 統合
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre class="hljs"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            "</code></pre>"
          );
        } catch (_) {}
      }
      return (
        '<pre class="hljs"><code>' +
        md.utils.escapeHtml(str) +
        "</code></pre>"
      );
    },
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink(),
    slugify: (s) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[\s]+/g, "-")
        .replace(/[^\w\-]/g, ""),
  });

  eleventyConfig.setLibrary("md", md);

  // assets をそのままコピー
  eleventyConfig.addPassthroughCopy("src/assets");

  // _data/notebooks もコピー対象外（ビルド時に生成）

  // フィルター: 日付フォーマット
  eleventyConfig.addFilter("dateFormat", (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("isoDate", (dateStr) => {
    if (!dateStr) return "";
    return dateStr;
  });

  // フィルター: limit
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  // フィルター: markdown レンダリング
  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content || "");
  });

  return {
    dir: {
      input: "src",
      output: "site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
