/* ===========================================================
   VideoForge - text-style-ui.js
   Inspector UI for stroke, shadow, background, alignment, fonts
   =========================================================== */

const TextStyleUI = {
  init() {},

  apply(clip) {
    const panel = document.getElementById("inspectorContent");

    // Only show for text clips
    if (clip.type !== "text") return;

    /* ------------------------------
       FONT FAMILY
    ------------------------------ */
    this.title("Font");

    this.dropdown("Font", AssetPacks.fonts, clip.fontFamily || "Arial", v => {
      clip.fontFamily = v;
      RenderEngine.renderFrame();
    });

    /* ------------------------------
       ALIGNMENT
    ------------------------------ */
    this.title("Align");

    this.dropdown("Align", ["left", "center", "right"], clip.textAlign || "center", v => {
      clip.textAlign = v;
      RenderEngine.renderFrame();
    });

    /* ------------------------------
       STROKE (Outline)
    ------------------------------ */
    this.title("Stroke");

    this.checkbox("Enable Stroke", clip.strokeEnabled || false, v => {
      clip.strokeEnabled = v;
      RenderEngine.renderFrame();
    });

    this.color("Stroke Color", clip.strokeColor || "#ffffff", v => {
      clip.strokeColor = v;
      RenderEngine.renderFrame();
    });

    this.slider("Width", clip.strokeWidth || 4, 0, 20, 1, v => {
      clip.strokeWidth = parseFloat(v);
      RenderEngine.renderFrame();
    });

    /* ------------------------------
       SHADOW
    ------------------------------ */
    this.title("Shadow");

    this.checkbox("Enable Shadow", clip.shadowEnabled || false, v => {
      clip.shadowEnabled = v;
      RenderEngine.renderFrame();
    });

    this.color("Shadow Color", clip.shadowColor || "#000000", v => {
      clip.shadowColor = v;
      RenderEngine.renderFrame();
    });

    this.slider("Blur", clip.shadowBlur || 10, 0, 50, 1, v => {
      clip.shadowBlur = parseFloat(v);
      RenderEngine.renderFrame();
    });

    this.slider("Offset X", clip.shadowX || 0, -50, 50, 1, v => {
      clip.shadowX = parseFloat(v);
      RenderEngine.renderFrame();
    });

    this.slider("Offset Y", clip.shadowY || 0, -50, 50, 1, v => {
      clip.shadowY = parseFloat(v);
      RenderEngine.renderFrame();
    });

    /* ------------------------------
       BACKGROUND BOX
    ------------------------------ */
    this.title("Background");

    this.checkbox("Enable Background", clip.bgEnabled || false, v => {
      clip.bgEnabled = v;
      RenderEngine.renderFrame();
    });

    this.color("BG Color", clip.bgColor || "#000000", v => {
      clip.bgColor = v;
      RenderEngine.renderFrame();
    });

    this.slider("Padding", clip.bgPadding || 20, 0, 100, 1, v => {
      clip.bgPadding = parseFloat(v);
      RenderEngine.renderFrame();
    });
  },

  /* ==========================================================
     UI Helpers
  ========================================================== */

  title(text) {
    const div = document.createElement("div");
    div.className = "inspector-title";
    div.style.marginTop = "12px";
    div.textContent = text;
    document.getElementById("inspectorContent").appendChild(div);
  },

  checkbox(label, checked, onChange) {
    const row = document.createElement("div");
    row.className = "inspector-row";

    const lab = document.createElement("div");
    lab.className = "inspector-label";
    lab.textContent = label;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checked;
    input.oninput = () => onChange(input.checked);

    row.appendChild(lab);
    row.appendChild(input);
    document.getElementById("inspectorContent").appendChild(row);
  },

  color(label, value, onChange) {
    const row = document.createElement("div");
    row.className = "inspector-row";

    const lab = document.createElement("div");
    lab.className = "inspector-label";
    lab.textContent = label;

    const input = document.createElement("input");
    input.type = "color";
    input.value = value;
    input.oninput = () => onChange(input.value);

    row.appendChild(lab);
    row.appendChild(input);
    document.getElementById("inspectorContent").appendChild(row);
  },

  slider(label, value, min, max, step, onChange) {
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

    document.getElementById("inspectorContent").appendChild(row);
  },

  dropdown(label, options, selected, onChange) {
    const row = document.createElement("div");
    row.className = "inspector-row";

    const lab = document.createElement("div");
    lab.className = "inspector-label";
    lab.textContent = label;

    const sel = document.createElement("select");
    sel.className = "inspector-input";

    options.forEach(o => {
      const opt = document.createElement("option");
      opt.value = o;
      opt.textContent = o;
      if (o === selected) opt.selected = true;
      sel.appendChild(opt);
    });

    sel.onchange = () => onChange(sel.value);

    row.appendChild(lab);
    row.appendChild(sel);
    document.getElementById("inspectorContent").appendChild(row);
  }
};
