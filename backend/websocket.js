const websocket = require('ws');

class WebSocket {
    static server;
    static wss;

    static connect(server) {
        this.server = server;
        this.wss = new websocket.Server({noServer: true});
        this.server.on('upgrade', (request, socket, head) => {
            this.wss.handleUpgrade(request, socket, head, socket => {
                this.wss.emit('connection', socket, request);
            });
        });

        // this.wss.on('connection', () => {
        //     this.broadcast({msg: "Ello"});
        // });
        
    }

    static broadcast(message) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === websocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        })
    }
}

module.exports = WebSocket