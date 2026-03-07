/* ===========================================================
   VideoForge - transitions.js
   Transition effects applied inside RenderEngine
   =========================================================== */

const Transitions = {
  /**
   * Apply transition effect.
   * Called by RenderEngine.drawClip().
   * 
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} type
   * @param {number} progress 0.0 → 1.0
   * @param {HTMLCanvasElement} canvas
   */
  apply(ctx, type, progress, canvas) {
    const w = canvas.width;
    const h = canvas.height;
    const p = progress;
    const ip = 1 - progress; // inverse

    switch (type) {
      case "fade":
        ctx.globalAlpha *= p;
        break;

      case "slide-left":
        ctx.translate(-w * ip, 0);
        break;

      case "slide-right":
        ctx.translate(w * ip, 0);
        break;

      case "zoom-in":
        ctx.scale(0.5 + p * 0.5, 0.5 + p * 0.5);
        ctx.globalAlpha *= p;
        break;

      case "zoom-out":
        ctx.scale(1.5 - p * 0.5, 1.5 - p * 0.5);
        ctx.globalAlpha *= p;
        break;

      case "spin":
        ctx.rotate(ip * Math.PI);
        ctx.globalAlpha *= p;
        break;

      case "wipe":
        ctx.beginPath();
        ctx.rect(-w / 2, -h / 2, w * p, h);
        ctx.clip();
        break;

      case "dissolve":
        // Random pixel-based dissolve effect
        ctx.globalAlpha *= (Math.random() < p ? 1 : 0.4);
        break;
    }
  }
};

/* 
  Add available transitions as a property on clips.
  Text, video, image clips can set: clip.transition = 'fade'
*/
