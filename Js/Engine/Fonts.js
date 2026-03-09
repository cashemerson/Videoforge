/* ===========================================================
   VideoForge - fonts.js
   Registers font pack for use in TextStyleUI
   =========================================================== */

const AssetPacks = {
  fonts: [
    "Arial",
    "Montserrat",
    "Anton",
    "Bebas Neue",
    "Poppins",
    "Oswald",
    "Courier New",
    "Georgia"
  ]
};

// Add loaded fonts to document body for usage
window.addEventListener("DOMContentLoaded", () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "css/fonts.css";
  document.head.appendChild(link);

  console.log("Font pack loaded");
});
