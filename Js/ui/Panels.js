/* ===========================================================
   VideoForge - panels.js
   Handles left panel UI interactions (Media / Text / Effects)
   =========================================================== */

const PanelsUI = {
  init() {
    this.setupMediaTab();
    this.setupTextTab();
    this.setupEffectsTab();
  },

  /* ---------------------------------------------------------
     MEDIA TAB
     Handles adding media to timeline
  --------------------------------------------------------- */
  setupMediaTab() {
    const mediaList = document.getElementById("mediaList");

    // When a new mediaItem is added by media.js,
    // its .onclick automatically calls MediaEngine.addClipToTimeline()
    // so nothing else needed here.
  },

  /* ---------------------------------------------------------
     TEXT TAB
     Add text layers to the timeline
  --------------------------------------------------------- */
  setupTextTab() {
    const btn = document.getElementById("addTextBtn");

    btn.onclick = () => {
      const VF = window.VideoForge;

      const clip = {
        id: Date.now(),
        type: "text",
        name: "Text",
        text: "New Text",
        start: 0,
        length: 4,
        x: 0,
        track: 0,

        // Transform
        scale: 1,
        rotation: 0,
        opacity: 1,

        // Effects
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hue: 0,
        blur: 0,
        vignette: 0,

        transition: "none",
        element: null
      };

      VF.clips.push(clip);
      TimelineEngine.refreshTimeline();
      selectClip(clip);
    };
  },

  /* ---------------------------------------------------------
     EFFECTS TAB
     Apply presets
  --------------------------------------------------------- */
  setupEffectsTab() {
    const buttons = document.querySelectorAll(".effect-btn");

    buttons.forEach(btn => {
      btn.onclick = () => {
        const VF = window.VideoForge;

        if (!VF.selectedClip) {
          alert("Select a clip first.");
          return;
        }

        const preset = btn.dataset.preset;
        EffectsEngine.applyPreset(VF.selectedClip, preset);

        InspectorUI.showClip(VF.selectedClip);
      };
    });
  }
};
