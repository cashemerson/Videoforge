/* ===========================================================
   VideoForge - app.js
   Application bootstrap + global state + UI wiring
   =========================================================== */

window.VideoForge = {
  clips: [],            // All clips on timeline
  mediaLibrary: [],     // Imported media
  tracks: [],           // Timeline tracks
  selectedClip: null,   // Currently selected clip
  playhead: 0,          // Timeline time in seconds
  playing: false,       // Playback state
  pps: 80,              // Pixels per second (timeline zoom)
  canvas: null,         // Preview canvas reference
  ctx: null,            // Canvas 2D context
  fps: 30,              // Playback frame rate
  duration: 0           // Total timeline duration
};

/* -----------------------------------------------------------
   Initialize App
----------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  const VF = window.VideoForge;

  // Cache canvas
  VF.canvas = document.getElementById("previewCanvas");
  VF.ctx = VF.canvas.getContext("2d");

  // Setup UI
  setupTabs();
  setupToolbar();
  setupPlayback();
  setupMediaImport();

  // Fire up engines
  TimelineEngine.init();
  RenderEngine.init();
  InspectorUI.init();
  PanelsUI.init();

  console.log("VideoForge initialized.");
});

/* -----------------------------------------------------------
   Tab switching (Media / Text / Effects)
----------------------------------------------------------- */
function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  const panes = document.querySelectorAll(".tabPane");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      panes.forEach(p => {
        p.style.display = "none";
      });

      document.getElementById(`pane-${target}`).style.display = "block";
    });
  });
}

/* -----------------------------------------------------------
   Toolbar buttons (New / Import / Export)
----------------------------------------------------------- */
function setupToolbar() {
  document.getElementById("btnNew").onclick = () => {
    if (confirm("Start a new project?")) {
      location.reload();
    }
  };

  document.getElementById("btnImport").onclick = () => {
    document.getElementById("mediaInput").click();
  };

  document.getElementById("btnExport").onclick = () => {
    alert("Export will be added in Module 12.");
  };
}

/* -----------------------------------------------------------
   Playback controls
----------------------------------------------------------- */
function setupPlayback() {
  const VF = window.VideoForge;

  document.getElementById("btnPlay").onclick = () => {
    VF.playing = true;
    requestAnimationFrame(playLoop);
  };

  document.getElementById("btnPause").onclick = () => {
    VF.playing = false;
  };
}

function playLoop(timestamp) {
  const VF = window.VideoForge;
  if (!VF.playing) return;

  VF.playhead += 1 / VF.fps;
  if (VF.playhead > VF.duration) VF.playhead = 0;

  // Update UI
  document.getElementById("timeDisplay").textContent =
    VF.playhead.toFixed(1) + "s";

  // Render
  RenderEngine.renderFrame();

  requestAnimationFrame(playLoop);
}

/* -----------------------------------------------------------
   Media importing
----------------------------------------------------------- */
function setupMediaImport() {
  const input = document.getElementById("mediaInput");

  input.onchange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      MediaEngine.importFile(file);
    });
  };
}

/* -----------------------------------------------------------
   Utility: Select a clip
----------------------------------------------------------- */
window.selectClip = function (clip) {
  const VF = window.VideoForge;

  VF.selectedClip = clip;

  // Remove highlight from old clips
  document.querySelectorAll(".clip").forEach(c => {
    c.classList.remove("selected");
  });

  if (clip.element) {
    clip.element.classList.add("selected");
  }

  InspectorUI.showClip(clip);
};
