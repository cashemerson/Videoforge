/* ===========================================================
   VideoForge - media.js
   Handles media import, thumbnails, and adding clips to timeline
   =========================================================== */

const MediaEngine = {
  importFile(file) {
    const type = this.getType(file);

    const entry = {
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      type,
      duration: 0,
      thumb: null
    };

    if (type === "image") {
      this.loadImage(entry);
    } else if (type === "video") {
      this.loadVideo(entry);
    } else if (type === "audio") {
      this.loadAudio(entry);
    }

    window.VideoForge.mediaLibrary.push(entry);
    this.addToUI(entry);
  },

  /* ---------------------------------------------------------
     Determine type (video / audio / image)
  --------------------------------------------------------- */
  getType(file) {
    if (file.type.startsWith("video")) return "video";
    if (file.type.startsWith("image")) return "image";
    if (file.type.startsWith("audio")) return "audio";
    return "unknown";
  },

  /* ---------------------------------------------------------
     Load image & generate thumbnail
  --------------------------------------------------------- */
  loadImage(entry) {
    const img = new Image();
    img.onload = () => {
      entry.duration = 5; // Image placeholder duration
      entry.thumb = entry.url;
    };
    img.src = entry.url;
  },

  /* ---------------------------------------------------------
     Load video metadata + generate thumbnail
  --------------------------------------------------------- */
  loadVideo(entry) {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = entry.url;

    video.onloadedmetadata = () => {
      entry.duration = video.duration;

      // Generate thumbnail
      video.currentTime = Math.min(0.2, video.duration / 3);
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 90;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, 160, 90);
        entry.thumb = canvas.toDataURL("image/jpeg", 0.7);
      };
    };
  },

  /* ---------------------------------------------------------
     Load audio metadata
  --------------------------------------------------------- */
  loadAudio(entry) {
    const audio = document.createElement("audio");
    audio.src = entry.url;
    audio.preload = "metadata";

    audio.onloadedmetadata = () => {
      entry.duration = audio.duration;
    };
  },

  /* ---------------------------------------------------------
     Add media to the left panel UI
  --------------------------------------------------------- */
  addToUI(entry) {
    const box = document.createElement("div");
    box.className = "media-item";

    box.textContent = entry.name;
    box.onclick = () => this.addClipToTimeline(entry);

    document.getElementById("mediaList").appendChild(box);
  },

  /* ---------------------------------------------------------
     Add selected media as a timeline clip
  --------------------------------------------------------- */
  addClipToTimeline(entry) {
    const VF = window.VideoForge;

    const clip = {
      id: Date.now() + Math.random(),
      type: entry.type,
      name: entry.name,
      media: entry,
      start: 0,
      length: entry.duration || 5,
      x: 0,
      track: 0,     // For now everything goes on track 0
      element: null
    };

    VF.clips.push(clip);

    TimelineEngine.refreshTimeline();
  }
};
