document.addEventListener("DOMContentLoaded", () => {
  const cta = document.querySelector(".cta");

  if (!cta) {
    return;
  }

  cta.addEventListener("click", () => {
    cta.textContent = "スクロールしています...";
    window.setTimeout(() => {
      cta.textContent = "詳細を見る";
    }, 900);
  });
});
