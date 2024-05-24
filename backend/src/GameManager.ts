import { Socket } from "socket.io";
import { Game, INIT_GAME, MOVE } from "./message";

export class GameManager {
    private games :Game[];
    private pendingUsers: Socket | null;
    public users:Socket[];

    constructor() {
        this.games = [];
        this.pendingUsers = null;
        this.users = [];
    }

    addUser(socket:Socket){
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket:Socket){
        this.users.splice(this.users.indexOf(socket),1);
        // or
        // this.users = this.users.filter(s => s!== socket);
    }

    public addHandler(socket:Socket){
        socket.on("message", (payload:any) => {
            const message =JSON.parse(payload);

            if (message.type === INIT_GAME) {
                if (this.pendingUsers) {

                    const game = new Game(this.pendingUsers, socket);

                    this.games.push(game);
                    this.pendingUsers = null; 

                } else {
                    this.pendingUsers = socket;
                }
            }

            if(message.type === MOVE) {
                const game = this.games.find(g => g.player1 === socket || g.player2 === socket);
                if (game) {
                    game.makeMove(socket,message.move);
                }
            }
        
        });
    }

}