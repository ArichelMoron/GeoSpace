document.addEventListener("DOMContentLoaded", () => {
  const dashboardView = document.getElementById("dashboardView");
  const viewerView = document.getElementById("viewerView");
  const btnBack = document.getElementById("btnBack");

  window.switchView = (toViewer) => {
    if (toViewer) {
      dashboardView.classList.replace("view-active", "view-hidden");
      viewerView.classList.replace("view-hidden", "view-active");
    } else {
      viewerView.classList.replace("view-active", "view-hidden");
      dashboardView.classList.replace("view-hidden", "view-active");
      
      // ✅ Solução definitiva para parar a renderização do último elemento aberto ao fechar a tela
      if (window.clearCurrentScene) {
        window.clearCurrentScene();
      }
    }
  };

  btnBack.addEventListener("click", () => switchView(false));
  lucide.createIcons();
});