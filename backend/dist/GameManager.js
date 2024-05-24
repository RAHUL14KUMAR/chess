"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const message_1 = require("./message");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUsers = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users.splice(this.users.indexOf(socket), 1);
        // or
        // this.users = this.users.filter(s => s!== socket);
    }
    addHandler(socket) {
        socket.on("message", (payload) => {
            const message = JSON.parse(payload);
            if (message.type === message_1.INIT_GAME) {
                if (this.pendingUsers) {
                    const game = new message_1.Game(this.pendingUsers, socket);
                    this.games.push(game);
                    this.pendingUsers = null;
                }
                else {
                    this.pendingUsers = socket;
                }
            }
            if (message.type === message_1.MOVE) {
                const game = this.games.find(g => g.player1 === socket || g.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
