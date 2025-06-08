// ────────── Module Importing ──────────
import { logMessage } from './logHandler.js';

export async function requestCertificate() { //Manual Certificate Installation
    try {
        logMessage("Requesting certificate...", "DEBUG");
        const res = await fetch('/selfsigned.crt');
        if (!res.ok) throw new Error("Failed to fetch certificate");
        const cert = await res.text();
        const blob = new Blob([cert], { type: 'text/plain' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "selfsigned.crt";
        document.body.appendChild(a);
        a.click();
        a.remove();
        logMessage("Certificate downloaded", "VALID");
    } catch (error) {
        logMessage(error.message, "ERROR");
    }
};
