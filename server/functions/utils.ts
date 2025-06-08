import WebSocket from 'ws';

export const notifyClient = (ws: WebSocket, message: Object, logConsole: boolean = false) => {
    ws.send(JSON.stringify(message));
    if (logConsole === true) {
        console.log(message);
    }
}
