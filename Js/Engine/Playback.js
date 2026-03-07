/* ===========================================================
   VideoForge - playback.js
   Handles play/pause, syncing video & audio, and playhead motion
   =========================================================== */

const PlaybackEngine = {
  tickHandle: null,

  init() {
    // No setup needed yet
  },

  /* ---------------------------------------------------------
     Start playback
  --------------------------------------------------------- */
  play() {
    const VF = window.VideoForge;

    if (VF.playing) return;

    VF.playing = true;
    this.playLoop();
  },

  /* ---------------------------------------------------------
     Pause playback
  --------------------------------------------------------- */
  pause() {
    const VF = window.VideoForge;
    VF.playing = false;

    // Pause all videos
    VF.clips.forEach(c => {
      if (c.media && c.media.videoEl) {
        c.media.videoEl.pause();
      }
      if (c.media && c.media.audioEl) {
        c.media.audioEl.pause();
      }
    });
  },

  /* ---------------------------------------------------------
     Main playback loop (fires at ~60fps)
  --------------------------------------------------------- */
  playLoop() {
    const VF = window.VideoForge;
    if (!VF.playing) return;

    // Advance time
    VF.playhead += 1 / VF.fps;

    // Loop
    if (VF.playhead > VF.duration) {
      VF.playhead = 0;
    }

    // Sync audio + video elements
    this.syncMedia();

    // Update timeline playhead
    TimelineEngine.updatePlayhead();

    // Update preview
    RenderEngine.renderFrame();

    // Update UI display
    const td = document.getElementById("timeDisplay");
    if (td) td.textContent = VF.playhead.toFixed(1) + "s";

    requestAnimationFrame(() => this.playLoop());
  },

  /* ---------------------------------------------------------
     Sync video/audio element playback positions
  --------------------------------------------------------- */
  syncMedia() {
    const VF = window.VideoForge;

    VF.clips.forEach((clip) => {
      const t = VF.playhead;

      if (t >= clip.start && t <= clip.start + clip.length) {
        const local = t - clip.start;

        if (clip.type === "video") {
          const vid = clip.media.videoEl;
          if (vid && Math.abs(vid.currentTime - local) > 0.05) {
            vid.currentTime = local;
          }
          if (vid && vid.paused) vid.play().catch(() => {});
        }

        if (clip.type === "audio") {
          if (!clip.media.audioEl) {
            const a = document.createElement("audio");
            a.src = clip.media.url;
            a.preload = "auto";
            a.volume = 1.0;
            clip.media.audioEl = a;
          }

          const aud = clip.media.audioEl;
          if (Math.abs(aud.currentTime - local) > 0.05) {
            aud.currentTime = local;
          }
          if (aud.paused) aud.play().catch(() => {});
        }

      } else {
        // Pause when clip is inactive
        if (clip.media.videoEl) clip.media.videoEl.pause();
        if (clip.media.audioEl) clip.media.audioEl.pause();
      }
    });
  }
};

// Expose for UI buttons
document.getElementById("btnPlay").onclick = () => PlaybackEngine.play();
document.getElementById("btnPause").onclick = () => PlaybackEngine.pause();
