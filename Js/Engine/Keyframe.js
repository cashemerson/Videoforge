/* ===========================================================
   VideoForge - keyframe.js
   Core keyframe data storage + interpolation engine
   =========================================================== */

const KeyframeEngine = {
  /* ---------------------------------------------------------
     Initialize keyframe storage for a clip
  --------------------------------------------------------- */
  ensure(clip) {
    if (!clip.keyframes) {
      clip.keyframes = {
        x: [],
        y: [],
        scale: [],
        rotation: [],
        opacity: [],
        brightness: [],
        contrast: [],
        saturation: [],
        hue: [],
        blur: []
      };
    }
  },

  /* ---------------------------------------------------------
     Add a keyframe to a property at time t
  --------------------------------------------------------- */
  add(clip, prop, time, value, ease = "linear") {
    this.ensure(clip);

    clip.keyframes[prop].push({
      t: time,
      v: value,
      ease
    });

    // Sort keyframes by time
    clip.keyframes[prop].sort((a, b) => a.t - b.t);
  },

  /* ---------------------------------------------------------
     Remove keyframe near time t (if exists)
  --------------------------------------------------------- */
  remove(clip, prop, time, threshold = 0.05) {
    this.ensure(clip);

    clip.keyframes[prop] = clip.keyframes[prop].filter(
      k => Math.abs(k.t - time) > threshold
    );
  },

  /* ---------------------------------------------------------
     Get value for property at time t
     Performs interpolation between nearest keyframes
  --------------------------------------------------------- */
  value(clip, prop, time, defaultValue) {
    this.ensure(clip);
    const list = clip.keyframes[prop];

    // No keyframes → return default
    if (list.length === 0) return defaultValue;

    // Before first keyframe
    if (time <= list[0].t) return list[0].v;

    // After last keyframe
    if (time >= list[list.length - 1].t)
      return list[list.length - 1].v;

    // Between keyframes
    for (let i = 0; i < list.length - 1; i++) {
      const k1 = list[i];
      const k2 = list[i + 1];

      if (time >= k1.t && time <= k2.t) {
        const p = (time - k1.t) / (k2.t - k1.t);

        // Easing
        const factor =
          k2.ease === "ease"
            ? p * p * (3 - 2 * p) // smoothstep
            : p;

        return k1.v + (k2.v - k1.v) * factor;
      }
    }
  }
};
