/* ===========================================================
   VideoForge - lut.js
   Lightweight LUT (Look-Up Table) engine using 16×16 PNGs
   =========================================================== */

const LUTEngine = {
  luts: {},       // LUT textures
  lutNames: [],   // Names for UI
/* ---------------------------------------------------------
   Register LUT textures
--------------------------------------------------------- */

// Teal & Orange LUT
LUTEngine.register("teal-orange",
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAYAAAAf8/9hAAA...<TRUNCATED>");

// Tokyo LUT
LUTEngine.register("tokyo",
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAYAAAAf8/9hAAA...<TRUNCATED>");

// Cinematic Green LUT
LUTEngine.register("cine-green",
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAYAAAAf8/9hAAA...<TRUNCATED>");

// Vintage Fade LUT
LUTEngine.register("vintage",
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAYAAAAf8/9hAAA...<TRUNCATED>");

  /* ---------------------------------------------------------
     Register a LUT (Base64 PNG)
  --------------------------------------------------------- */
  register(name, base64png) {
    const img = new Image();
    img.src = base64png;
    this.luts[name] = img;
    this.lutNames.push(name);
  },

  /* ---------------------------------------------------------
     Apply LUT to pixel data
     (Executes after regular effects)
  --------------------------------------------------------- */
  applyLUT(ctx, clip, canvas) {
    if (!clip.lut || clip.lut === "none") return;

    const lut = this.luts[clip.lut];
    if (!lut.complete) return; // not ready yet

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const lutCanvas = document.createElement("canvas");
    lutCanvas.width = 256;
    lutCanvas.height = 16;

    const lutCtx = lutCanvas.getContext("2d");
    lutCtx.drawImage(lut, 0, 0);

    const lutData = lutCtx.getImageData(0, 0, 256, 16).data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Primary LUT sampling
      const index = (r * 4);  // LUT row 0-255
      data[i]     = lutData[index];
      data[i + 1] = lutData[index + 1];
      data[i + 2] = lutData[index + 2];
    }

    ctx.putImageData(imgData, 0, 0);
  }
};

/* -----------------------------------------------------------
   Patch RenderEngine.renderFrame to include LUT pass
----------------------------------------------------------- */
(function patchLUT() {
  const original = RenderEngine.renderFrame;

  RenderEngine.renderFrame = function() {
    original.call(RenderEngine);

    const VF = window.VideoForge;
    const ctx = VF.ctx;
    const canvas = VF.canvas;

    // Apply LUT pass on final frame
    const active = VF.clips.filter(c => {
      const t = VF.playhead;
      return t >= c.start && t <= c.start + c.length;
    });

    active.forEach(clip => {
      LUTEngine.applyLUT(ctx, clip, canvas);
    });
  };
})();
