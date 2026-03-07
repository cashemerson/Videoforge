/* ===========================================================
   VideoForge - keyframe-ui.js
   Handles keyframe buttons, markers, selection, graph editor
   =========================================================== */

const KeyframeUI = {
  selectedKF: null,
  graphOpen: false,

  init() {
    this.injectGraphEditor();
  },

  /* ---------------------------------------------------------
     Inject graph editor panel + canvas
  --------------------------------------------------------- */
  injectGraphEditor() {
    const wrapper = document.getElementById("timelineWrapper");

    const graph = document.createElement("div");
    graph.id = "graphEditor";

    graph.innerHTML = `
      <div class="graph-controls">
        <button class="graph-btn" id="closeGraphBtn">Close Graph</button>
        <button class="graph-btn" id="deleteKFBtn">Delete Keyframe</button>
      </div>
      <canvas id="graphCanvas"></canvas>
    `;

    wrapper.appendChild(graph);

    document.getElementById("closeGraphBtn").onclick = () =>
      this.closeGraph();

    document.getElementById("deleteKFBtn").onclick = () =>
      this.deleteSelected();
  },

  /* ---------------------------------------------------------
     Add “Add Keyframe” button to the inspector for each property
  --------------------------------------------------------- */
  addKeyframeButton(container, clip, propName) {
    const btn = document.createElement("button");
    btn.className = "inspector-button";
    btn.textContent = "Add Keyframe";

    btn.onclick = () => {
      const VF = window.VideoForge;
      const t = VF.playhead;
      const val = clip[propName];

      KeyframeEngine.add(clip, propName, t, val);
      TimelineEngine.refreshTimeline();
      RenderEngine.renderFrame();
    };

    container.appendChild(btn);
  },

  /* ---------------------------------------------------------
     Draw keyframe diamonds on timeline for a property
  --------------------------------------------------------- */
  drawKeyframes(clip, trackEl) {
    if (!clip.keyframes) return;
    const VF = window.VideoForge;

    const props = Object.keys(clip.keyframes);

    props.forEach((prop) => {
      clip.keyframes[prop].forEach((kf) => {
        const marker = document.createElement("div");
        marker.className = "keyframe-marker";

        marker.style.left = (kf.t * VF.pps) + "px";

        marker.onclick = (e) => {
          e.stopPropagation();
          this.select(kf, clip, prop);
        };

        trackEl.appendChild(marker);

        kf._el = marker;
      });
    });
  },

  /* ---------------------------------------------------------
     Select a keyframe
  --------------------------------------------------------- */
  select(kf, clip, prop) {
    this.selectedKF = { kf, clip, prop };

    document.querySelectorAll(".keyframe-marker")
      .forEach(m => m.classList.remove("selected"));

    if (kf._el) kf._el.classList.add("selected");

    this.openGraph(clip, prop);
  },

  /* ---------------------------------------------------------
     Delete selected keyframe
  --------------------------------------------------------- */
  deleteSelected() {
    if (!this.selectedKF) return;

    const { kf, clip, prop } = this.selectedKF;

    clip.keyframes[prop] = clip.keyframes[prop].filter(k => k !== kf);

    this.selectedKF = null;
    this.closeGraph();
    TimelineEngine.refreshTimeline();
  },

  /* ---------------------------------------------------------
     Open graph editor for property
  --------------------------------------------------------- */
  openGraph(clip, prop) {
    const panel = document.getElementById("graphEditor");
    panel.style.display = "block";

    this.graphOpen = true;

    this.drawGraph(clip, prop);
  },

  closeGraph() {
    const panel = document.getElementById("graphEditor");
    panel.style.display = "none";
    this.graphOpen = false;
  },

  /* ---------------------------------------------------------
     Draw curve in graph editor for the selected property
  --------------------------------------------------------- */
  drawGraph(clip, prop) {
    const canvas = document.getElementById("graphCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const kfs = clip.keyframes[prop];
    if (!kfs || kfs.length < 2) return;

    // Normalize for drawing
    const minT = kfs[0].t;
    const maxT = kfs[kfs.length - 1].t;

    const xs = (t) =>
      ((t - minT) / (maxT - minT)) * canvas.width;

    const minV = Math.min(...kfs.map(k => k.v));
    const maxV = Math.max(...kfs.map(k => k.v));

    const ys = (v) =>
      canvas.height - ((v - minV) / (maxV - minV)) * canvas.height;

    // Draw curve
    ctx.strokeStyle = "#7c5cfc";
    ctx.lineWidth = 2;
    ctx.beginPath();

    ctx.moveTo(xs(kfs[0].t), ys(kfs[0].v));

    for (let i = 1; i < kfs.length; i++) {
      ctx.lineTo(xs(kfs[i].t), ys(kfs[i].v));
    }

    ctx.stroke();

    // Draw points
    ctx.fillStyle = "#ff6b9d";
    kfs.forEach(k => {
      ctx.beginPath();
      ctx.arc(xs(k.t), ys(k.v), 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }
};
