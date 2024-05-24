import { GameManager } from "./GameManager";

require('dotenv').config();
const express=require('express');
const cors=require('cors');

const app=express();
const port=process.env.PORT;

const server=require('http').createServer();


const io=require("socket.io")(server,{
    cors: {
        origin: "*"
    }
});

const gameManager=new GameManager();

io.on("connection", async (socket: any) => {

    gameManager.addUser(socket);
    console.log("user with",socket.id,"connected");

    socket.on("disconnect", () => {
        console.log("user disconnected");
        gameManager.removeUser(socket);
    });
});

server.listen(port, () => {
    console.log(`server active at http://localhost:${port}`);
});
