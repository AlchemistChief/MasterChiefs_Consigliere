// ────────── Module Importing ──────────
import { toggleLogVisibility, hideDebug, hideError, hideValid, hideTimestamp } from './modules/logHandler.js';
import { toggleSideMenuVisibility, loadPartial } from './modules/interfaceHandler.js';
import { initInputsUpdate, initSwitchButtons, loadSettings } from './modules/inputHandler.js';
import { initWebSocket } from './modules/webSocketHandler.js';
import { requestCertificate } from './modules/utils.js';

document.addEventListener("DOMContentLoaded", async () => {
  // ────────── Initialization: Core Setup ──────────
  await loadPartial("robDiamonds.html", "content");
  initWebSocket();

  document.getElementById("hamburger").addEventListener("click", toggleSideMenuVisibility);
  document.getElementById("fetch-cert").addEventListener("click", requestCertificate);

  // ────────── Sidebar Navigation ──────────
  document.querySelectorAll(".sidebar-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const partialName = button.id.replace("-btn", "") + ".html";
      await loadPartial(partialName, "content");
      loadSettings();
      initSwitchButtons();
      initInputsUpdate();
    });
  });

  // ────────── Global Log Control Bindings ──────────
  window.toggleLogVisibility = toggleLogVisibility;
  window.hideTimestamp = hideTimestamp;
  window.hideDebug = hideDebug;
  window.hideError = hideError;
  window.hideValid = hideValid;
});
