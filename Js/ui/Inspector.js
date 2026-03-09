/* ===========================================================
   VideoForge - inspector.js
   Right panel: clip property controls (transform, text, effects)
   =========================================================== */

const InspectorUI = {
  pane: null,

  init() {
    this.pane = document.getElementById("inspectorContent");
  },

  /* ---------------------------------------------------------
     Render inspector for selected clip
  --------------------------------------------------------- */
  showClip(clip) {
    if (!clip) {
      this.pane.innerHTML = "<p>No clip selected</p>";
      return;
    }

    this.pane.innerHTML = "";

    this.section("Transform");
    this.transformControls(clip);

    if (clip.type === "text") {
      this.section("Text");
      this.effectControls(clip);
TextStyleUI.apply(clip);   // if you installed this
LUTUI.apply(clip);         // <-- add here

    }

    this.section("Effects");
    this.effectControls(clip);

    this.section("Transition");
    this.transitionControls(clip);
  },

  /* ---------------------------------------------------------
     Section header
  --------------------------------------------------------- */
  section(title) {
    const div = document.createElement("div");
    div.className = "inspector-section";
    div.innerHTML = `<div class="inspector-title">${title}</div>`;
    this.pane.appendChild(div);
  },

  /* ---------------------------------------------------------
     Transform: x, y, scale, rotation, opacity
  --------------------------------------------------------- */
  transformControls(clip) {
    this.rowNumber("X", clip.x || 0, v => {
      clip.x = parseFloat(v);
      RenderEngine.renderFrame();
    });

    this.rowNumber("Y", clip.y || 0, v => {
      clip.y = parseFloat(v);
      RenderEngine.renderFrame();
    });

    this.rowSlider("Scale", clip.scale || 1, 0.1, 4, 0.1, v => {
      clip.scale = parseFloat(v);
      RenderEngine.renderFrame();
    });

    this.rowSlider("Rotate", clip.rotation || 0, -180, 180, 1, v => {
      clip.rotation = parseFloat(v);
      RenderEngine.renderFrame();
    });

    this.rowSlider("Opacity", clip.opacity || 1, 0, 1, 0.05, v => {
      clip.opacity = parseFloat(v);
      RenderEngine.renderFrame();
    });
  },

  /* ---------------------------------------------------------
     Text controls
  --------------------------------------------------------- */
  textControls(clip) {
    const row = document.createElement("div");
    row.className = "inspector-row";

    const input = document.createElement("input");
    input.className = "inspector-input";
    input.value = clip.text || "";
    input.oninput = () => {
      clip.text = input.value;
      RenderEngine.renderFrame();
    };

    row.appendChild(input);
    this.pane.appendChild(row);
  },

  /* ---------------------------------------------------------
     Color effects sliders
  --------------------------------------------------------- */
  effectControls(clip) {
    this.rowSlider("Bright", clip.brightness ?? 100, 0, 200, 1, v => {
      clip.brightness = parseInt(v);
      RenderEngine.renderFrame();
    });

    this.rowSlider("Contrast", clip.contrast ?? 100, 0, 200, 1, v => {
      clip.contrast = parseInt(v);
      RenderEngine.renderFrame();
    });

    this.rowSlider("Sat", clip.saturation ?? 100, 0, 200, 1, v => {
      clip.saturation = parseInt(v);
      RenderEngine.renderFrame();
    });

    this.rowSlider("Hue", clip.hue ?? 0, 0, 360, 1, v => {
      clip.hue = parseInt(v);
      RenderEngine.renderFrame();
    });

    this.rowSlider("Blur", clip.blur ?? 0, 0, 20, 0.5, v => {
      clip.blur = parseFloat(v);
      RenderEngine.renderFrame();
    });

    this.rowSlider("Vignette", clip.vignette ?? 0, 0, 100, 1, v => {
      clip.vignette = parseInt(v);
      RenderEngine.renderFrame();
    });
  },

  /* ---------------------------------------------------------
     Transitions (fade, slide, zoom, spin, wipe, dissolve)
  --------------------------------------------------------- */
  transitionControls(clip) {
    const row = document.createElement("div");
    row.className = "inspector-row";

    const select = document.createElement("select");
    select.className = "inspector-input";

    const list = [
      ["none", "None"],
      ["fade", "Fade"],
      ["slide-left", "Slide Left"],
      ["slide-right", "Slide Right"],
      ["zoom-in", "Zoom In"],
      ["zoom-out", "Zoom Out"],
      ["spin", "Spin"],
      ["wipe", "Wipe"],
      ["dissolve", "Dissolve"]
    ];

    list.forEach(([val, label]) => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = label;
      if (clip.transition === val) opt.selected = true;
      select.appendChild(opt);
    });

    select.onchange = () => {
      clip.transition = select.value;
      RenderEngine.renderFrame();
    };

    row.appendChild(select);
    this.pane.appendChild(row);
  },
const list = [
  ["none", "None"],
  ["fade", "Fade"],
  ["slide-left", "Slide Left"],
  ["slide-right", "Slide Right"],
  ["zoom-in", "Zoom In"],
  ["zoom-out", "Zoom Out"],
  ["spin", "Spin"],
  ["wipe", "Wipe"],
  ["dissolve", "Dissolve"],

  // NEW ADVANCED TRANSITIONS
  ["cross-warp", "Cross Warp"],
  ["lens-bloom", "Lens Bloom"],
  ["warp-zoom", "Warp Zoom"],
  ["bounce-in", "Bounce In"],
  ["spin-drop", "Spin Drop"]
];

  /* ---------------------------------------------------------
     Reusable row: number input
  --------------------------------------------------------- */
  rowNumber(label, value, onChange) {
    const row = document.createElement("div");
    row.className = "inspector-row";

    const lab = document.createElement("div");
    lab.className = "inspector-label";
    lab.textContent = label;

    const input = document.createElement("input");
    input.type = "number";
    input.value = value;
    input.className = "inspector-input";
    input.oninput = () => onChange(input.value);

    row.appendChild(lab);
    row.appendChild(input);
    this.pane.appendChild(row);
  },

  /* ---------------------------------------------------------
     Reusable row: slider
  --------------------------------------------------------- */
  rowSlider(label, value, min, max, step, onChange) {
    const row = document.createElement("div");
    row.className = "inspector-row";

    const lab = document.createElement("div");
    lab.className = "inspector-label";
    lab.textContent = label;

    const sliderWrap = document.createElement("div");
    sliderWrap.className = "inspector-slider";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = value;

    const val = document.createElement("div");
    val.className = "range-value";
    val.textContent = value;

    slider.oninput = () => {
      val.textContent = slider.value;
      onChange(slider.value);
    };

    sliderWrap.appendChild(slider);
    row.appendChild(lab);
    row.appendChild(sliderWrap);
    row.appendChild(val);

    this.pane.appendChild(row);
  }
};
``
