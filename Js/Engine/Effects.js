/* ===========================================================
   VideoForge - effects.js
   Color grading & image processing presets
   =========================================================== */

const EffectsEngine = {
  /* ---------------------------------------------------------
     Apply named preset to a clip
  --------------------------------------------------------- */
  applyPreset(clip, preset) {
    clip.preset = preset;

    // Apply preset values
    const p = this.presets[preset];
    if (!p) return;

    clip.brightness = p.brightness;
    clip.contrast   = p.contrast;
    clip.saturation = p.saturation;
    clip.hue        = p.hue;
    clip.blur       = p.blur;
    clip.vignette   = p.vignette || 0;
  },

  /* ---------------------------------------------------------
     Named color grading presets
  --------------------------------------------------------- */
  presets: {
    none: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      vignette: 0
    },

    bw: {
      brightness: 100,
      contrast: 120,
      saturation: 0,
      hue: 0,
      blur: 0,
      vignette: 0
    },

    warm: {
      brightness: 108,
      contrast: 105,
      saturation: 120,
      hue: 15,
      blur: 0,
      vignette: 5
    },

    cool: {
      brightness: 98,
      contrast: 110,
      saturation: 115,
      hue: 200,
      blur: 0,
      vignette: 5
    },

    vivid: {
      brightness: 105,
      contrast: 115,
      saturation: 180,
      hue: 0,
      blur: 0,
      vignette: 0
    },

    cinematic: {
      brightness: 92,
      contrast: 130,
      saturation: 80,
      hue: 0,
      blur: 0,
      vignette: 30
    },

    neon: {
      brightness: 110,
      contrast: 160,
      saturation: 220,
      hue: -40,
      blur: 1,
      vignette: 0
    },

    matte: {
      brightness: 104,
      contrast: 80,
      saturation: 80,
      hue: 0,
      blur: 0,
      vignette: 0
    }
  }
};

/* -----------------------------------------------------------
   Hook effects into RenderEngine’s transform pipeline
----------------------------------------------------------- */

(function patchRenderEngine() {
  const origApplyTransform = RenderEngine.applyTransform;

  RenderEngine.applyTransform = function (clip, drawFn) {
    const VF = window.VideoForge;
    const ctx = VF.ctx;

    ctx.save();

    // Apply opacity
    ctx.globalAlpha = clip.opacity || 1;

    // Canvas filter string
    let f = "";

    if (clip.brightness !== undefined)
      f += `brightness(${clip.brightness}%) `;

    if (clip.contrast !== undefined)
      f += `contrast(${clip.contrast}%) `;

    if (clip.saturation !== undefined)
      f += `saturate(${clip.saturation}%) `;

    if (clip.hue !== undefined)
      f += `hue-rotate(${clip.hue}deg) `;

    if (clip.blur !== undefined)
      f += `blur(${clip.blur}px) `;

    ctx.filter = f.trim();

    // Scale + rotation
    ctx.translate(VF.canvas.width / 2, VF.canvas.height / 2);

    if (clip.rotation) {
      ctx.rotate((clip.rotation * Math.PI) / 180);
    }

    const sc = clip.scale || 1;
    ctx.scale(sc, sc);

    // Draw original
    drawFn();

    // Vignette overlay
    if (clip.vignette && clip.vignette > 0) {
      const grd = ctx.createRadialGradient(
        0, 0, 10,
        0, 0, VF.canvas.height * 0.8
      );

      grd.addColorStop(0, "transparent");
      grd.addColorStop(1, `rgba(0,0,0,${clip.vignette / 100})`);

      ctx.globalAlpha = 1;
      ctx.filter = "none";
      ctx.fillStyle = grd;
      ctx.fillRect(-VF.canvas.width, -VF.canvas.height, VF.canvas.width * 2, VF.canvas.height * 2);
    }

    ctx.restore();
  };
})();
