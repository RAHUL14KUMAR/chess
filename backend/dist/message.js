"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.MOVE = exports.INIT_GAME = void 0;
const chess_js_1 = require("chess.js");
exports.INIT_GAME = "init_game";
exports.MOVE = "move";
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.starTime = new Date();
        this.player1.emit("init_game", { color: "black"
        });
        this.player2.emit("init_game", { color: "white"
        });
    }
    makeMove(socket, move) {
        // validation move
        // is this  a user move
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (error) {
            console.log(error);
            return;
        }
        // update the board
        if (this.board.isGameOver()) {
            // send the game over message to both the parties
            this.player1.emit("game_over", ({
                winner: this.board.turn() === "w" ? "black" : "white"
            }));
            this.player2.emit("game_over", ({
                winner: this.board.turn() === "w" ? "white" : "black"
            }));
            return;
        }
        if (this.moveCount % 2 === 0) {
            this.player2.emit(exports.MOVE, { payload: move });
        }
        else {
            this.player1.emit(exports.MOVE, { payload: move });
        }
        this.moveCount++;
        // send the updtaed board to all the players
    }
}
exports.Game = Game;
