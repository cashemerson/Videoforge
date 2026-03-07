/* ===========================================================
   VideoForge - export.js
   FULL video export engine (WebM + WebCodecs)
   =========================================================== */

const ExportEngine = {
  async exportVideo() {
    const VF = window.VideoForge;

    if (VF.clips.length === 0) {
      alert("Nothing to export — your timeline is empty.");
      return;
    }

    alert("Rendering video... This may take a while on iPad.");

    const canvas = VF.canvas;
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    const fps = VF.fps;
    const duration = VF.duration;
    const totalFrames = Math.floor(duration * fps);

    // -------------------------------------------------------
    // Check WebCodecs support
    // -------------------------------------------------------
    const webcodecsSupported = ("VideoEncoder" in window);

    if (!webcodecsSupported) {
      alert("⚠️ WebCodecs not supported on this device. Export will use fallback (slow).");
      return this.exportFallback();
    }

    // -------------------------------------------------------
    // WebCodecs Export
    // -------------------------------------------------------
    const chunks = [];
    const encoder = new VideoEncoder({
      output: (chunk) => chunks.push(chunk),
      error: (e) => console.error(e),
    });

    encoder.configure({
      codec: "vp8",
      width,
      height,
      bitrate: 8_000_000,
      framerate: fps,
    });

    const offcanvas = new OffscreenCanvas(width, height);
    const offctx = offcanvas.getContext("2d");

    let timestamp = 0;

    for (let frame = 0; frame < totalFrames; frame++) {
      const t = frame / fps;
      VF.playhead = t;

      // Render frame to main canvas
      RenderEngine.renderFrame();

      // Copy to offscreen
      offctx.drawImage(canvas, 0, 0);

      // Create frame
      const videoFrame = new VideoFrame(offcanvas, { timestamp });

      encoder.encode(videoFrame);
      videoFrame.close();

      timestamp += 1_000_000 / fps; // microseconds

      if (frame % 10 === 0) {
        console.log(`Rendering frame ${frame}/${totalFrames}`);
      }
    }

    await encoder.flush();

    // -------------------------------------------------------
    // Combine chunks into final WebM
    // -------------------------------------------------------

    const webmBlob = new Blob(chunks.map(c => c.data), { type: "video/webm" });

    // Trigger download
    const a = document.createElement("a");
    a.href = URL.createObjectURL(webmBlob);
    a.download = "videoforge_export.webm";
    a.click();

    alert("Export complete!");
  },


  /* ---------------------------------------------------------
     Fallback Export (PNG sequence inside a ZIP)
     Used when WebCodecs is unavailable
  --------------------------------------------------------- */
  async exportFallback() {
    const VF = window.VideoForge;
    const canvas = VF.canvas;
    const fps = VF.fps;
    const duration = VF.duration;
    const totalFrames = Math.floor(duration * fps);

    const zip = new JSZip();  
    const folder = zip.folder("frames");

    for (let frame = 0; frame < totalFrames; frame++) {
      VF.playhead = frame / fps;

      RenderEngine.renderFrame();

      const png = canvas.toDataURL("image/png").split(",")[1];
      folder.file(`frame${String(frame).padStart(5, "0")}.png`, png, { base64: true });

      if (frame % 10 === 0) {
        console.log(`Exporting PNG ${frame}/${totalFrames}`);
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "videoforge_png_sequence.zip";
    a.click();

    alert("Fallback export complete! (PNG sequence)");
  }
};

// Hook into Export button
document.getElementById("btnExport").onclick = () => ExportEngine.exportVideo();
