/* ===========================================================
   VideoForge - toolbar.js
   Handles top toolbar actions (New, Import, Export)
   =========================================================== */

const ToolbarUI = {
  init() {
    this.setupButtons();
  },

  setupButtons() {
    // NEW PROJECT
    document.getElementById("btnNew").onclick = () => {
      if (confirm("Start a new project? This will clear your timeline.")) {
        location.reload();
      }
    };

    // IMPORT MEDIA
    document.getElementById("btnImport").onclick = () => {
      document.getElementById("mediaInput").click();
    };

    // EXPORT VIDEO (real rendering coming in export.js)
    document.getElementById("btnExport").onclick = () => {
      alert("Export module is coming soon! This will render your timeline to video.");
    };
  }
};

// Initialize toolbar after DOM load
window.addEventListener("DOMContentLoaded", () => {
  ToolbarUI.init();
});
