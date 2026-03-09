/* ===========================================================
   VideoForge - text-styles.js
   Stroke, shadow, background box, alignment, and style rendering
   =========================================================== */

const TextStyleEngine = {
  applyTextStyles(ctx, clip, drawFn) {
    ctx.save();

    // Background box
    if (clip.bgEnabled) {
      ctx.fillStyle = clip.bgColor || "rgba(0,0,0,0.4)";
      const pad = clip.bgPadding || 20;
      const w = clip.bgWidth  || 1000;
      const h = clip.bgHeight || 200;
      ctx.fillRect(
        -w/2 - pad/2,
        -h/2 - pad/2,
        w + pad,
        h + pad
      );
    }

    // Shadows
    if (clip.shadowEnabled) {
      ctx.shadowColor = clip.shadowColor || "rgba(0,0,0,0.5)";
      ctx.shadowBlur = clip.shadowBlur || 10;
      ctx.shadowOffsetX = clip.shadowX || 0;
      ctx.shadowOffsetY = clip.shadowY || 0;
    }

    // Text stroke
    if (clip.strokeEnabled) {
      ctx.lineWidth = clip.strokeWidth || 4;
      ctx.strokeStyle = clip.strokeColor || "#000000";
      drawFn("stroke");
    }

    // Fill
    drawFn("fill");

    ctx.restore();
  }
};

/* ===========================================================
   Patch RenderEngine.drawText to include new styles
=========================================================== */

(function patchDrawText() {
  const orig = RenderEngine.drawText;

  RenderEngine.drawText = function(clip) {
    const VF = window.VideoForge;
    const ctx = VF.ctx;

    this.applyTransform(clip, () => {
      ctx.font = `${clip.fontSize || 80}px ${clip.fontFamily || "Arial"}`;
      ctx.textAlign = clip.textAlign || "center";
      ctx.textBaseline = "middle";

      const lines = (clip.text || "").split("\n");

      const draw = (mode) => {
        lines.forEach((line, i) => {
          const y = (i - (lines.length - 1) / 2) * (clip.fontSize * 1.2);
          if (mode === "stroke") ctx.strokeText(line, 0, y);
          else ctx.fillText(line, 0, y);
        });
      };

      TextStyleEngine.applyTextStyles(ctx, clip, draw);
    });
  };
})();
