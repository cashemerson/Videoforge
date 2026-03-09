/* ===========================================================
   VideoForge - safe-area.js
   Adds a safe-area overlay that adjusts to aspect ratio
   =========================================================== */

const SafeArea = {
  enabled: false,
  overlay: null,

  init() {
    this.overlay = document.createElement("div");
    this.overlay.id = "safeAreaOverlay";

    const preview = document.getElementById("previewArea");
    preview.appendChild(this.overlay);

    this.setupToolbarButton();

    // Initial calculation
    setTimeout(() => this.update(), 200);
  },

  /* ---------------------------------------------------------
     Add toggle button to toolbar
  --------------------------------------------------------- */
  setupToolbarButton() {
    const toolbar = document.getElementById("toolbar");

    const btn = document.createElement("button");
    btn.className = "tb-btn";
    btn.textContent = "Safe Area";
    btn.id = "safeAreaBtn";

    btn.onclick = () => {
      this.enabled = !this.enabled;
      this.overlay.style.display = this.enabled ? "block" : "none";
      this.update();
    };

    toolbar.appendChild(btn);
  },

  /* ---------------------------------------------------------
     Recompute safe-area based on aspect ratio and canvas size
  --------------------------------------------------------- */
  update() {
    if (!this.enabled) return;

    const VF = window.VideoForge;
    const canvas = VF.canvas;
    const preview = document.getElementById("previewArea");

    const ov = this.overlay;

    // Canvas aspect ratio
    const cw = canvas.width;
    const ch = canvas.height;

    // Preview container size (actual display size of canvas)
    const pw = preview.clientWidth;
    const ph = preview.clientHeight;

    // Compute how canvas is being fitted (object-fit: contain)
    const canvasAspect = cw / ch;
    const previewAspect = pw / ph;

    let displayW, displayH;

    if (canvasAspect > previewAspect) {
      displayW = pw;
      displayH = pw / canvasAspect;
    } else {
      displayH = ph;
      displayW = ph * canvasAspect;
    }

    // Safe area = 90% of canvas display
    const safeScale = 0.90;

    ov.style.width = displayW * safeScale + "px";
    ov.style.height = displayH * safeScale + "px";

    ov.style.display = this.enabled ? "block" : "none";
  }
};

/* Enable safe-area after DOM load */
window.addEventListener("DOMContentLoaded", () => {
  SafeArea.init();
});
