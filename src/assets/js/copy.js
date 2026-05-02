(function () {
  document.querySelectorAll("pre.hljs").forEach((pre) => {
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "コピー";
    btn.addEventListener("click", () => {
      const code = pre.querySelector("code");
      navigator.clipboard.writeText(code ? code.innerText : pre.innerText).then(() => {
        btn.textContent = "✓ コピー完了";
        setTimeout(() => (btn.textContent = "コピー"), 2000);
      });
    });
    pre.appendChild(btn);
  });
})();
