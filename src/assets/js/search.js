(function () {
  const docs = window.__SEARCH_INDEX__ || [];
  if (!docs.length) return;

  // lunr インデックス構築
  const idx = lunr(function () {
    this.field("title", { boost: 10 });
    this.field("body");
    this.ref("id");

    docs.forEach((doc) => this.add(doc));
  });

  const docMap = {};
  docs.forEach((d) => (docMap[d.id] = d));

  const input = document.getElementById("search-input");
  const status = document.getElementById("search-status");
  const results = document.getElementById("search-results");

  function search(query) {
    results.innerHTML = "";
    if (!query.trim()) {
      status.textContent = "";
      return;
    }

    let hits;
    try {
      hits = idx.search(query + "~1");
    } catch (_) {
      hits = [];
    }

    status.textContent = hits.length > 0 ? `${hits.length} 件見つかりました` : "該当なし";

    hits.forEach((hit) => {
      const doc = docMap[hit.ref];
      if (!doc) return;

      const li = document.createElement("li");
      li.className = "search-result-item";

      const snippet = doc.body
        .replace(/<[^>]+>/g, "")
        .slice(0, 150)
        .replace(new RegExp(query, "gi"), (m) => `<mark>${m}</mark>`);

      li.innerHTML = `
        <div class="search-result-title">
          <a href="${doc.url}">${doc.title}</a>
          <span style="font-size:0.72rem;color:var(--text-muted);margin-left:0.5rem;">${doc.type === "til" ? "TIL" : "Code"}</span>
        </div>
        <div class="search-result-snippet">${snippet}…</div>
      `;
      results.appendChild(li);
    });
  }

  let timer;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => search(input.value), 200);
  });

  // URL クエリパラメータ対応
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) {
    input.value = q;
    search(q);
  }
})();
