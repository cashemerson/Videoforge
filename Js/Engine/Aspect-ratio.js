/* ===========================================================
   VideoForge - aspect-ratio.js
   Handles canvas resizing for 16:9, 9:16, 1:1 aspect ratios
   =========================================================== */

const AspectRatioEngine = {
  ratios: {
    "16:9": 16 / 9,
    "9:16": 9 / 16,
    "1:1": 1
  },

  current: "16:9",

  init() {
    this.apply("16:9"); // default
  },

  /* ---------------------------------------------------------
     Apply selected aspect ratio
  --------------------------------------------------------- */
  apply(ratioName) {
    const VF = window.VideoForge;

    if (!this.ratios[ratioName]) return;

    this.current = ratioName;

    const aspect = this.ratios[ratioName];

    // Base resolution (HD)
    let baseW = 1920;
    let baseH = Math.round(1920 / aspect);

    // Vertical case (9:16)
    if (ratioName === "9:16") {
      baseH = 1920;
      baseW = Math.round(1920 * aspect);
    }

    // Square case (1:1)
    if (ratioName === "1:1") {
      baseW = 1500;
      baseH = 1500;
    }

    // Resize canvas
    VF.canvas.width = baseW;
    VF.canvas.height = baseH;

    // Refresh UI + preview
    TimelineEngine.refreshTimeline();
    RenderEngine.renderFrame();

    console.log(`Aspect ratio changed to ${ratioName} (${baseW}×${baseH})`);
  }
};


/* -----------------------------------------------------------
   Add aspect ratio buttons dynamically to toolbar
----------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  const toolbar = document.getElementById("toolbar");

  const select = document.createElement("select");
  select.id = "ratioSelect";
  select.className = "tb-btn";
  select.style.padding = "6px 8px";

  ["16:9", "9:16", "1:1"].forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    select.appendChild(opt);
  });

  select.onchange = () => {
    AspectRatioEngine.apply(select.value);
  };

  toolbar.appendChild(select);

  AspectRatioEngine.init();
});
