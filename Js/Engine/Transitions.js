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
/* ===========================================================
   VideoForge - Advanced Transition Pack
   Adds Cross Warp, Lens Bloom, Warp Zoom, Bounce In, Spin Drop
   =========================================================== */

Transitions.advanced = {
  
  /* --------------------------
     Cross Warp
  -------------------------- */
  "cross-warp": (ctx, p, w, h) => {
    const ip = 1 - p;
    ctx.translate(Math.sin(ip * Math.PI) * 60, 0);
    ctx.scale(1 + ip * 0.2, 1 + ip * 0.2);
    ctx.globalAlpha *= p;
  },

  /* --------------------------
     Lens Bloom
  -------------------------- */
  "lens-bloom": (ctx, p, w, h) => {
    // Bright flash
    ctx.globalAlpha *= (0.3 + p * 0.7);
    ctx.scale(1 + p * 0.15, 1 + p * 0.15);

    // radial bloom
    const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, w);
    gradient.addColorStop(0, `rgba(255,255,255,${0.7 * p})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(-w, -h, w * 2, h * 2);
  },

  /* --------------------------
     Warp Zoom
  -------------------------- */
  "warp-zoom": (ctx, p, w, h) => {
    ctx.scale(1 + p * 1.5, 1 + p * 1.5);
    ctx.rotate((1 - p) * 0.3);
    ctx.globalAlpha *= p;
  },

  /* --------------------------
     Bounce In
  -------------------------- */
  "bounce-in": (ctx, p, w, h) => {
    // Ease-out bounce
    const bounce = (x) =>
      x < 0.5
        ? 4 * x * x * x
        : 1 - Math.pow(-2 * x + 2, 3) / 2;

    const b = bounce(p);
    const scale = 0.6 + b * 0.4;

    ctx.scale(scale, scale);
    ctx.globalAlpha *= p;
  },

  /* --------------------------
     Spin Drop
  -------------------------- */
  "spin-drop": (ctx, p, w, h) => {
    ctx.rotate((1 - p) * Math.PI * 1.2);
    ctx.translate(0, -(1 - p) * h * 0.8);
    ctx.globalAlpha *= p;
  }
};


/* -----------------------------------------------------------
   Patch existing Transitions.apply() to recognize new effects
----------------------------------------------------------- */
(function patchAdvancedTransitions() {
  const oldApply = Transitions.apply;

  Transitions.apply = function(ctx, type, p, canvas) {
    const w = canvas.width;
    const h = canvas.height;

    // Use advanced transition if exists
    if (Transitions.advanced[type]) {
      Transitions.advanced[type](ctx, p, w, h);
      return;
    }

    // Otherwise fallback to base transitions
    oldApply(ctx, type, p, canvas);
  };
}
/* ===========================================================
   VideoForge - Advanced Transition Pack
   Adds Cross Warp, Lens Bloom, Warp Zoom, Bounce In, Spin Drop
   =========================================================== */

Transitions.advanced = {
  
  /* --------------------------
     Cross Warp
  -------------------------- */
  "cross-warp": (ctx, p, w, h) => {
    const ip = 1 - p;
    ctx.translate(Math.sin(ip * Math.PI) * 60, 0);
    ctx.scale(1 + ip * 0.2, 1 + ip * 0.2);
    ctx.globalAlpha *= p;
  },

  /* --------------------------
     Lens Bloom
  -------------------------- */
  "lens-bloom": (ctx, p, w, h) => {
    // Bright flash
    ctx.globalAlpha *= (0.3 + p * 0.7);
    ctx.scale(1 + p * 0.15, 1 + p * 0.15);

    // radial bloom
    const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, w);
    gradient.addColorStop(0, `rgba(255,255,255,${0.7 * p})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(-w, -h, w * 2, h * 2);
  },

  /* --------------------------
     Warp Zoom
  -------------------------- */
  "warp-zoom": (ctx, p, w, h) => {
    ctx.scale(1 + p * 1.5, 1 + p * 1.5);
    ctx.rotate((1 - p) * 0.3);
    ctx.globalAlpha *= p;
  },

  /* --------------------------
     Bounce In
  -------------------------- */
  "bounce-in": (ctx, p, w, h) => {
    // Ease-out bounce
    const bounce = (x) =>
      x < 0.5
        ? 4 * x * x * x
        : 1 - Math.pow(-2 * x + 2, 3) / 2;

    const b = bounce(p);
    const scale = 0.6 + b * 0.4;

    ctx.scale(scale, scale);
    ctx.globalAlpha *= p;
  },

  /* --------------------------
     Spin Drop
  -------------------------- */
  "spin-drop": (ctx, p, w, h) => {
    ctx.rotate((1 - p) * Math.PI * 1.2);
    ctx.translate(0, -(1 - p) * h * 0.8);
    ctx.globalAlpha *= p;
  }
};


/* -----------------------------------------------------------
   Patch existing Transitions.apply() to recognize new effects
----------------------------------------------------------- */
(function patchAdvancedTransitions() {
  const oldApply = Transitions.apply;

  Transitions.apply = function(ctx, type, p, canvas) {
    const w = canvas.width;
    const h = canvas.height;

    // Use advanced transition if exists
    if (Transitions.advanced[type]) {
      Transitions.advanced[type](ctx, p, w, h);
      return;
    }

    // Otherwise fallback to base transitions
    oldApply(ctx, type, p, canvas);
  };
})();

