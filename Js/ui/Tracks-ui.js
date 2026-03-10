/* ===========================================================
   VideoForge - tracks-ui.js
   Handles track selection, adding video/audio tracks,
   and assigning clips to the selected track.
   =========================================================== */

const TracksUI = {
  activeTrack: "V1",

  init() {
    this.injectButtons();
    this.refreshTrackSelector();
  },

  /* ---------------------------------------------------------
     Add “Add Track” buttons to toolbar
  --------------------------------------------------------- */
  injectButtons() {
    const toolbar = document.getElementById("toolbar");

    // Add Video Track
    const btnV = document.createElement("button");
    btnV.className = "tb-btn";
    btnV.textContent = "+ Video Track";
    btnV.onclick = () => {
      const tr = MultiTrack.addTrack("video");
      this.activeTrack = tr.id;
      this.refreshTrackSelector();
    };
    toolbar.appendChild(btnV);

    // Add Audio Track
    const btnA = document.createElement("button");
    btnA.className = "tb-btn";
    btnA.textContent = "+ Audio Track";
    btnA.onclick = () => {
      const tr = MultiTrack.addTrack("audio");
      this.activeTrack = tr.id;
      this.refreshTrackSelector();
    };
    toolbar.appendChild(btnA);

    // Track Selector Dropdown
    const sel = document.createElement("select");
    sel.id = "trackSelector";
    sel.className = "tb-btn";
    sel.onchange = () => {
      this.activeTrack = sel.value;
    };
    toolbar.appendChild(sel);
  },

  /* ---------------------------------------------------------
     Refresh dropdown with current track list
  --------------------------------------------------------- */
  refreshTrackSelector() {
    const VF = window.VideoForge;
    const sel = document.getElementById("trackSelector");
    sel.innerHTML = "";

    VF.tracks.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.id;
      if (t.id === this.activeTrack) opt.selected = true;
      sel.appendChild(opt);
    });
  },

  /* ---------------------------------------------------------
     Assign a new clip to the active track
  --------------------------------------------------------- */
  assignClip(clip) {
    MultiTrack.addClipToTrack(clip, this.activeTrack);
  }
};
