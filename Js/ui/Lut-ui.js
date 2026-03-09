/* ===========================================================
   VideoForge - lut-ui.js
   Inspector UI integration for LUT color filters
   =========================================================== */

const LUTUI = {
  init() {},

  apply(clip) {
    const panel = document.getElementById("inspectorContent");

    // LUTs apply to ALL clip types (video, image, text)
    this.title("LUT Filter");

    this.dropdown(
      "Filter",
      ["none", ...LUTEngine.lutNames],
      clip.lut || "none",
      v => {
        clip.lut = v;
        RenderEngine.renderFrame();
      }
    );
  },

  /* -----------------------------------------------
     UI Helpers (same pattern as TextStyleUI)
  ------------------------------------------------ */

  title(text) {
    const div = document.createElement("div");
    div.className = "inspector-title";
    div.style.marginTop = "12px";
    div.textContent = text;
    document.getElementById("inspectorContent").appendChild(div);
  },

  dropdown(label, list, selected, onChange) {
    const row = document.createElement("div");
    row.className = "inspector-row";

    const lab = document.createElement("div");
    lab.className = "inspector-label";
    lab.textContent = label;

    const sel = document.createElement("select");
    sel.className = "inspector-input";

    list.forEach(optName => {
      const opt = document.createElement("option");
      opt.value = optName;
      opt.textContent = optName.replace(/-/g, " ");
      if (optName === selected) opt.selected = true;
      sel.appendChild(opt);
    });

    sel.onchange = () => onChange(sel.value);

    row.appendChild(lab);
    row.appendChild(sel);

    document.getElementById("inspectorContent").appendChild(row);
  }
};
