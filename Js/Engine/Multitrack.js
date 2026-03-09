/* ===========================================================
   VideoForge - multitrack.js
   Adds true multi-track support for video + audio layers
   =========================================================== */

const MultiTrack = {
  init() {
    const VF = window.VideoForge;

    // Ensure a baseline set of tracks
    if (!VF.tracks || VF.tracks.length === 0) {
      VF.tracks = [
        { id: "V1", type: "video", clips: [] },
        { id: "A1", type: "audio", clips: [] }
      ];
    }
  },

  /* ---------------------------------------------------------
     Add a new video or audio track
  --------------------------------------------------------- */
  addTrack(type = "video") {
    const VF = window.VideoForge;

    const prefix = type === "video" ? "V" : "A";
    const nextIndex =
      VF.tracks.filter(t => t.type === type).length + 1;

    const newTrack = {
      id: prefix + nextIndex,
      type,
      clips: []
    };

    VF.tracks.push(newTrack);

    TimelineEngine.refreshTimeline();
    return newTrack;
  },

  /* ---------------------------------------------------------
     Insert clip into specific track
  --------------------------------------------------------- */
  addClipToTrack(clip, trackId) {
    const VF = window.VideoForge;

    const track = VF.tracks.find(t => t.id === trackId);
    if (!track) return;

    track.clips.push(clip);
    clip.track = trackId;

    TimelineEngine.refreshTimeline();
  },

  /* ---------------------------------------------------------
     Get track for clip
  --------------------------------------------------------- */
  getTrack(clip) {
    const VF = window.VideoForge;
    return VF.tracks.find(t => t.id === clip.track);
  },

  /* ---------------------------------------------------------
     Rendering order: bottom → top (V1 → Vn)
  --------------------------------------------------------- */
  getRenderStack() {
    const VF = window.VideoForge;

    return VF.tracks
      .filter(t => t.type === "video")
      .map(t => t.clips)
      .flat()
      .sort((a, b) => {
        // Higher-numbered video tracks render on top
        const ta = parseInt(a.track.slice(1));
        const tb = parseInt(b.track.slice(1));
        return ta - tb;
      });
  }
};
