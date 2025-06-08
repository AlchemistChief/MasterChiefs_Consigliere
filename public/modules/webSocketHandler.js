// ────────── Module Importing ──────────
let socket;

export function initWebSocket() {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname;
    const port = 443;
    const wsUrl = `${protocol}://${host}:${port}/ws`;

    socket = new WebSocket(wsUrl);

    socket.addEventListener('open', () => {
        console.log('WebSocket connected');
    });

    socket.addEventListener('message', event => {
        const data = JSON.parse(event.data);
        console.log('Received:', data);

        if (data.logMessage) {
            const { message, type = "DEBUG", update = false, id = null } = data.logMessage;
            logMessage(message, type, update, id);
        }
    });

    socket.addEventListener('close', () => {
        console.log('WebSocket disconnected');
    });

    socket.addEventListener('error', error => {
        console.error('WebSocket error:', error);
    });
}

export function sendMessage(msg) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
    }
}
