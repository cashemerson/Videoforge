/* ===========================================================
   VideoForge - render.js
   Canvas rendering engine (video, image, text)
   =========================================================== */

const RenderEngine = {
  init() {
    const VF = window.VideoForge;
    VF.ctx.imageSmoothingEnabled = true;
  },

  /* ---------------------------------------------------------
     Main frame drawing entry point
  --------------------------------------------------------- */
  renderFrame() {
    const VF = window.VideoForge;
    const ctx = VF.ctx;

    ctx.clearRect(0, 0, VF.canvas.width, VF.canvas.height);

    // Draw all active clips
    VF.clips.forEach((clip) => {
      const t = VF.playhead;

      if (t >= clip.start && t <= clip.start + clip.length) {
        this.drawClip(clip, t - clip.start);
      }
    });
  },

  /* ---------------------------------------------------------
     Draw a single clip depending on its type
  --------------------------------------------------------- */
  drawClip(clip, localTime) {
    if (clip.type === "video") return this.drawVideo(clip, localTime);
    if (clip.type === "image") return this.drawImage(clip);
    if (clip.type === "text") return this.drawText(clip);
  },

  /* ---------------------------------------------------------
     Draw VIDEO frame
  --------------------------------------------------------- */
  drawVideo(clip, localTime) {
    const VF = window.VideoForge;
    const ctx = VF.ctx;
    const media = clip.media;

    if (!media.videoEl) {
      media.videoEl = document.createElement("video");
      media.videoEl.src = media.url;
      media.videoEl.crossOrigin = "anonymous";
      media.videoEl.muted = true;
      media.videoEl.preload = "auto";
    }

    const v = media.videoEl;

    // Seek to correct time
    const drawTime = Math.min(media.duration, localTime);
    if (Math.abs(v.currentTime - drawTime) > 0.05) {
      v.currentTime = drawTime;
    }

    this.applyTransform(clip, () => {
      try {
        ctx.drawImage(v, 0, 0, VF.canvas.width, VF.canvas.height);
      } catch (e) {
        // Not ready yet, ignore
      }
    });
  },

  /* ---------------------------------------------------------
     Draw IMAGE
  --------------------------------------------------------- */
  drawImage(clip) {
    const VF = window.VideoForge;
    const ctx = VF.ctx;
    const media = clip.media;

    if (!media.imageEl) {
      media.imageEl = new Image();
      media.imageEl.src = media.url;
    }

    const img = media.imageEl;

    this.applyTransform(clip, () => {
      const cw = VF.canvas.width;
      const ch = VF.canvas.height;

      // Fit image
      const ir = img.width / img.height;
      const cr = cw / ch;

      let dw = cw, dh = ch;
      if (ir > cr) {
        dh = cw / ir;
      } else {
        dw = ch * ir;
      }

      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    });
  },

  /* ---------------------------------------------------------
     Draw TEXT
  --------------------------------------------------------- */
  drawText(clip) {
    const VF = window.VideoForge;
    const ctx = VF.ctx;

    this.applyTransform(clip, () => {
      ctx.fillStyle = "white";
      ctx.font = "80px Arial";
      ctx.textAlign = "center";
      ctx.fillText(clip.text || "Text", VF.canvas.width / 2, VF.canvas.height / 2);
    });
  },

  /* ---------------------------------------------------------
     Shared transform pipeline
     (opacity, scale, rotate, brightness, contrast, hue, blur)
  --------------------------------------------------------- */
  applyTransform(clip, drawFn) {
    const VF = window.VideoForge;
    const ctx = VF.ctx;

    ctx.save();

    // Set position transform
    ctx.globalAlpha = clip.opacity || 1;

    // Handle filters
    let f = "";

    if (clip.brightness) f += `brightness(${clip.brightness}%) `;
    if (clip.contrast)   f += `contrast(${clip.contrast}%) `;
    if (clip.saturation) f += `saturate(${clip.saturation}%) `;
    if (clip.hue)        f += `hue-rotate(${clip.hue}deg) `;
    if (clip.blur)       f += `blur(${clip.blur}px) `;

    ctx.filter = f.trim();

    // Position + rotation
    ctx.translate(VF.canvas.width / 2, VF.canvas.height / 2);

    if (clip.rotation) {
      ctx.rotate((clip.rotation * Math.PI) / 180);
    }

    const sc = clip.scale || 1;
    ctx.scale(sc, sc);

    drawFn();

    ctx.restore();
  }
};
