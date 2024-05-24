"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameManager_1 = require("./GameManager");
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const server = require('http').createServer();
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
});
const gameManager = new GameManager_1.GameManager();
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    gameManager.addUser(socket);
    console.log("user with", socket.id, "connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
        gameManager.removeUser(socket);
    });
}));
server.listen(port, () => {
    console.log(`server active at http://localhost:${port}`);
});
