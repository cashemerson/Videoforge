/* ===========================================================
   VideoForge - text-animations.js
   Text animation presets (Fade, Slide, Pop, Typewriter, Reveal)
   =========================================================== */

const TextAnimationEngine = {
  /* ---------------------------------------------------------
     Apply animation preset to a text clip
  --------------------------------------------------------- */
  applyPreset(clip, presetName) {
    const VF = window.VideoForge;
    const KF = KeyframeEngine;

    // Ensure keyframe structure
    KF.ensure(clip);

    // Clear existing keyframes
    Object.keys(clip.keyframes).forEach(prop => {
      clip.keyframes[prop] = [];
    });

    switch (presetName) {
      case "fade-in":
        KF.add(clip, "opacity", 0, 0);
        KF.add(clip, "opacity", 0.8, 1);
        break;

      case "slide-up":
        KF.add(clip, "y", 0, 200);
        KF.add(clip, "y", 1.0, 0);
        KF.add(clip, "opacity", 0, 0);
        KF.add(clip, "opacity", 0.5, 1);
        break;

      case "slide-left":
        KF.add(clip, "x", 0, 300);
        KF.add(clip, "x", 1.0, 0);
        KF.add(clip, "opacity", 0, 0);
        KF.add(clip, "opacity", 0.6, 1);
        break;

      case "pop":
        KF.add(clip, "scale", 0, 0.3);
        KF.add(clip, "scale", 0.4, 1.3);
        KF.add(clip, "scale", 0.8, 1);
        break;

      case "typewriter":
        this.applyTypewriter(clip);
        break;

      case "reveal":
        KF.add(clip, "opacity", 0, 0);
        KF.add(clip, "opacity", 1.0, 1);
        KF.add(clip, "blur", 0, 20);
        KF.add(clip, "blur", 1.0, 0);
        break;
    }

    TimelineEngine.refreshTimeline();
    RenderEngine.renderFrame();
  },

  /* ---------------------------------------------------------
     Typewriter animation: reveal characters one-by-one
  --------------------------------------------------------- */
  applyTypewriter(clip) {
    const KF = KeyframeEngine;

    const text = clip.text || "";
    const len = text.length;

    KF.ensure(clip);

    clip._typewriterVisible = 0; // internal use

    // Keyframes simulate character reveal based on opacity
    for (let i = 0; i <= len; i++) {
      const t = (i / len) * 1.0; // normalize to 1 second
      const visibleChars = i;

      KF.add(clip, "opacity", t, 1); // keep opacity full

      // store progress for renderer
      KF.add(clip, "blur", t, 0);  
      KF.add(clip, "scale", t, 1);

      // Store internal property
      if (!clip.typewriterKF) clip.typewriterKF = [];
      clip.typewriterKF.push({ t, visible: visibleChars });
    }
  },

  /* ---------------------------------------------------------
     During rendering, apply typewriter masking
  --------------------------------------------------------- */
  getTypewriterVisibleChars(clip, localTime) {
    if (!clip.typewriterKF) return clip.text.length;

    let visible = clip.text.length;

    clip.typewriterKF.forEach(k => {
      if (localTime >= k.t) visible = k.visible;
    });

    return visible;
  }
};

/* -----------------------------------------------------------
   Patch RenderEngine.drawText to support typewriter masking
----------------------------------------------------------- */
(function patchTypewriter() {
  const original = RenderEngine.drawText;

  RenderEngine.drawText = function(clip) {
    const VF = window.VideoForge;
    const ctx = VF.ctx;
    const t = VF.playhead - clip.start;

    const visibleChars = clip.typewriterKF
      ? TextAnimationEngine.getTypewriterVisibleChars(clip, t)
      : clip.text.length;

    const masked = (clip.text || "").substring(0, visibleChars);

    // Temporarily override clip.text
    const oldText = clip.text;
    clip.text = masked;

    original.call(RenderEngine, clip);

    // Restore
    clip.text = oldText;
  };
})();
