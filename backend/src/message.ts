import { Chess } from "chess.js";
import { Socket } from "socket.io";

export const INIT_GAME="init_game"; 
export const MOVE="move";

export class Game{
    public player1:Socket | any;
    public player2:Socket | any;
    public board:Chess
    private starTime:Date;
    private moveCount=0;

    constructor(player1:Socket,player2:Socket){
        this.player1=player1;
        this.player2=player2;
        this.board=new Chess();
        this.starTime= new Date();
        this.player1.emit("init_game",{color:"black"
        });
        this.player2.emit("init_game",{color:"white"
        });
    }

    makeMove(socket:Socket,move:{from:string,to:string}){
        // validation move
        // is this  a user move
        if(this.moveCount%2===0 && socket!== this.player1){
            return;
        }

        if(this.moveCount%2===1 && socket!== this.player2){
            return;
        }

        try{
            this.board.move(move);
            
        }catch(error){
            console.log(error)
            return;
        }

        // update the board
        if(this.board.isGameOver()){
            // send the game over message to both the parties
            this.player1.emit("game_over",({
                winner:this.board.turn()==="w"?"black":"white"
            }))
            this.player2.emit("game_over",({
                winner:this.board.turn()==="w"?"white":"black"
            }))

            return;
        }

        if(this.moveCount%2===0){
            this.player2.emit(MOVE,{payload:move});
        }else{
            this.player1.emit(MOVE,{payload:move});
        }

        this.moveCount++;

        // send the updtaed board to all the players

    }
}