/* ===========================================================
   VideoForge - timeline.js
   Timeline tracks, clip placement, dragging, resizing, snapping
   =========================================================== */

const TimelineEngine = {
  trackHeight: 60,

  init() {
    this.container = document.getElementById("timelineTracks");
    this.playheadEl = this.createPlayhead();
    this.snapLine = this.createSnapLine();

    this.dragState = null;

    this.refreshTimeline();
  },

  /* ---------------------------------------------------------
     Create playhead element
  --------------------------------------------------------- */
  createPlayhead() {
    const ph = document.createElement("div");
    ph.id = "playhead";
    ph.style.left = "0px";
    this.container.appendChild(ph);
    return ph;
  },

  createSnapLine() {
    const sl = document.createElement("div");
    sl.id = "snapLine";
    this.container.appendChild(sl);
    return sl;
  },

  /* ---------------------------------------------------------
     Re-render all tracks & clips
  --------------------------------------------------------- */
  refreshTimeline() {
    const VF = window.VideoForge;

    // Clear
    this.container.innerHTML = "";
    this.container.appendChild(this.playheadEl);
    this.container.appendChild(this.snapLine);

    // Ensure at least 1 track
    if (VF.tracks.length === 0) {
      VF.tracks.push({ id: 0, clips: [] });
    }

    // Push clips into track 0 (for now)
    VF.tracks[0].clips = VF.clips;

    // Render tracks
    VF.tracks.forEach((track, i) => {
      this.renderTrack(track, i);
    });

    // Recompute total duration
    this.recomputeDuration();

    // Redraw playhead
    this.updatePlayhead();
  },

  /* ---------------------------------------------------------
     Render a single timeline track
  --------------------------------------------------------- */
  renderTrack(track, index) {
    const VF = window.VideoForge;

    const trackEl = document.createElement("div");
    trackEl.className = "timeline-track";
    trackEl.style.top = index * this.trackHeight + "px";

    if (track.clips.length === 0) {
      const empty = document.createElement("div");
      empty.className = "track-empty";
      empty.textContent = "Empty Track";
      trackEl.appendChild(empty);
    }

    track.clips.forEach((clip) => {
      this.renderClip(clip, trackEl);
    });

    this.container.appendChild(trackEl);
  },

  /* ---------------------------------------------------------
     Render a clip element
  --------------------------------------------------------- */
  renderClip(clip, parent) {
    const VF = window.VideoForge;

    const el = document.createElement("div");
    el.className = "clip " + this.getClipClass(clip);
    el.style.left = clip.start * VF.pps + "px";
    el.style.width = clip.length * VF.pps + "px";
    el.textContent = clip.name;

    // Store element
    clip.element = el;

    // Click = select
    el.onclick = (e) => {
      e.stopPropagation();
      selectClip(clip);
    };

    // Dragging
    el.onmousedown = (e) => this.startDrag(e, clip);

    // Resize handles
    const left = document.createElement("div");
    left.className = "resize-handle resize-left";
    left.onmousedown = (e) => this.startResize(e, clip, "left");

    const right = document.createElement("div");
    right.className = "resize-handle resize-right";
    right.onmousedown = (e) => this.startResize(e, clip, "right");

    el.appendChild(left);
    el.appendChild(right);

    parent.appendChild(el);
  },

  /* ---------------------------------------------------------
     Clip CSS classes by type
  --------------------------------------------------------- */
  getClipClass(clip) {
    if (clip.type === "video") return "clip-video";
    if (clip.type === "audio") return "clip-audio";
    if (clip.type === "text") return "clip-text";
    if (clip.type === "image") return "clip-image";
    return "";
  },

  /* ---------------------------------------------------------
     DRAGGING clips
  --------------------------------------------------------- */
  startDrag(e, clip) {
    e.preventDefault();

    const VF = window.VideoForge;

    this.dragState = {
      clip,
      startX: e.clientX,
      origStart: clip.start
    };

    document.onmousemove = (ev) => this.dragMove(ev);
    document.onmouseup = () => this.dragEnd();
  },

  dragMove(ev) {
    if (!this.dragState) return;

    const VF = window.VideoForge;
    const dx = (ev.clientX - this.dragState.startX) / VF.pps;

    let newStart = this.dragState.origStart + dx;
    newStart = Math.max(0, newStart);

    // Snapping
    const snap = this.findSnap(newStart, this.dragState.clip);
    if (snap !== null) {
      newStart = snap;
      this.showSnapLine(newStart * VF.pps);
    } else {
      this.hideSnapLine();
    }

    this.dragState.clip.start = newStart;

    this.refreshTimeline();
  },

  dragEnd() {
    this.dragState = null;
    this.hideSnapLine();

    document.onmousemove = null;
    document.onmouseup = null;
  },

  /* ---------------------------------------------------------
     RESIZING clips
  --------------------------------------------------------- */
  startResize(e, clip, side) {
    e.stopPropagation();
    e.preventDefault();

    const VF = window.VideoForge;

    this.dragState = {
      clip,
      side,
      startX: e.clientX,
      origStart: clip.start,
      origLen: clip.length
    };

    document.onmousemove = (ev) => this.resizeMove(ev);
    document.onmouseup = () => this.resizeEnd();
  },

  resizeMove(ev) {
    if (!this.dragState) return;

    const VF = window.VideoForge;
    const ds = this.dragState;
    const dx = (ev.clientX - ds.startX) / VF.pps;

    if (ds.side === "right") {
      let newLen = ds.origLen + dx;
      newLen = Math.max(0.2, newLen);
      ds.clip.length = newLen;
    }

    if (ds.side === "left") {
      let newStart = ds.origStart + dx;
      let newLen = ds.origLen - dx;

      if (newStart < 0) return;
      if (newLen < 0.2) return;

      ds.clip.start = newStart;
      ds.clip.length = newLen;
    }

    this.refreshTimeline();
  },

  resizeEnd() {
    this.dragState = null;
    this.hideSnapLine();

    document.onmousemove = null;
    document.onmouseup = null;
  },

  /* ---------------------------------------------------------
     Snapping system
  --------------------------------------------------------- */
  findSnap(newStart, clip) {
    const VF = window.VideoForge;
    const eps = 0.1; // seconds

    let best = null;

    VF.clips.forEach(c => {
      if (c.id === clip.id) return;

      const edges = [c.start, c.start + c.length];
      edges.forEach(edge => {
        if (Math.abs(edge - newStart) < eps) {
          best = edge;
        }
      });
    });

    return best;
  },

  showSnapLine(px) {
    this.snapLine.style.left = px + "px";
    this.snapLine.classList.add("active");
  },

  hideSnapLine() {
    this.snapLine.classList.remove("active");
  },

  /* ---------------------------------------------------------
     Recompute total duration
  --------------------------------------------------------- */
  recomputeDuration() {
    const VF = window.VideoForge;

    let maxEnd = 0;
    VF.clips.forEach(c => {
      const end = c.start + c.length;
      if (end > maxEnd) maxEnd = end;
    });

    VF.duration = maxEnd;
  },

  /* ---------------------------------------------------------
     Update playhead on timeline
  --------------------------------------------------------- */
  updatePlayhead() {
    const VF = window.VideoForge;
    this.playheadEl.style.left = VF.playhead * VF.pps + "px";
  }
};
