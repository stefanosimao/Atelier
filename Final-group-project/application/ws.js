
const io = require('socket.io')();

const EventEmitter = require('events');
const eventBus = new EventEmitter()

let editing_ids = [];
let ids_map = {};
let gameObject = {};
var hostSocket = null;
var player_answers = 0;
var gameLive = false;
let players_ids = [];
let players_map = {};
var quizLive = false;
let players_answered = [];

function init(server) {
    console.log("Starting Server");
    io.attach(server);

    io.on("connection", (socket) => {
        console.log("Socket Connected");

        socket.on('refresh_list', () => {
            socket.emit('latest_list', { list: editing_ids });
        });

        socket.on("next question", () => {
            player_answers = 0;
            players_answered = [];
            gameObject.current_question_index++;
            if (gameObject.current_question_index < gameObject.shuffle.length) {
                //send position of the correct answer between 0 and 3
                let ca_position = gameObject.shuffle[gameObject.current_question_index];
                let isHost = socket == hostSocket;
                players_ids.forEach(sid => {
                    io.to(sid).emit("next question for players", ca_position, gameObject.current_question_index, isHost);
                })
                hostSocket.emit("next question for players", ca_position, gameObject.current_question_index, isHost);
            } else {
                io.emit("ending_the_game", gameObject.Players);
                gameObject = {};
                hostSocket = null;
                player_answers = 0;
                players_ids = [];
                players_map = {};
                players_answered = [];
            }
        });

        socket.on("correct answer", (name, current_question) => {
            let player = gameObject.Players.find(element => element.username == name);
            //check if player is synchronized

            if (gameObject.Quiz.questions[gameObject.current_question_index].difficulty == 1)
                player.points += 10;
            else if (gameObject.Quiz.questions[gameObject.current_question_index].difficulty == 2)
                player.points += 20;
            else
                player.points += 30;
            player_answers++;
            players_answered.push(socket.id);            

            //call function to check if all players sent an answer 
            //and redirect to the leaderboard/show correct answer

            if (player_answers >= gameObject.Players.length) {
                players_ids.forEach(sid => {
                    io.to(sid).emit("show correct answer");
                })
                hostSocket.emit("show correct answer");
            }
        });

        socket.on("wrong answer", (current_question) => {
            player_answers++;
            players_answered.push(socket.id); 
            
            //call function to check if all players sent an answer 
            //and redirect to the leaderboard/show correct answer

            if (player_answers >= gameObject.Players.length) {
                players_ids.forEach(sid => {
                    io.to(sid).emit("show correct answer");
                })
                hostSocket.emit("show correct answer");
            }
        });

        socket.on("goToLeaderboard", () => {
            let isHost = socket == hostSocket;
            if (gameObject.current_question_index + 1 < gameObject.shuffle.length) {
                players_ids.forEach(sid => {
                    io.to(sid).emit("showLeaderboard", {players: gameObject.Players, host: isHost});
                })
                hostSocket.emit("showLeaderboard", { players: gameObject.Players, host: isHost });
            } else {
                io.emit("ending_the_game", gameObject.Players);
                gameObject = {};
                hostSocket = null;
                player_answers = 0;
                players_ids = [];
                players_map = {};
                players_answered = [];
            }
        });

        socket.on("disconnect", () => {
            for (let x in ids_map) {
                if (ids_map[x] == socket.id) {
                    ids_map[x] = [];
                    editing_ids.splice(editing_ids.indexOf(x), 1);
                    socket.broadcast.emit('stop_editing', { id: x })
                }
            }
            if (hostSocket != null){
                if (socket.id == hostSocket.id) {
                    console.log('Host disconnected')
                    gameObject = {};
                    hostSocket = null;
                    socket.broadcast.emit('host_disconnected');
                    players_ids = [];
                    players_map = {};
                    players_answered = []
                }
                for (let y in players_ids) {
                    if(socket.id == players_ids[y]){
                        players_ids.splice(y, 1);
                    }
                }
                for (let s in players_map) {
                    if (socket.id == players_map[s]){
                        eventBus.emit('eliminate_player_go', { username: s })
                        hostSocket.emit('eliminate_player', {username: s});
                        if (quizLive){
                            for(let t in players_answered){
                                if (socket.id == players_answered[t]){
                                    player_answers--;
                                    break;
                                }
                            }
                            if (player_answers >= gameObject.Players.length) {
                                players_ids.forEach(sid => {
                                    io.to(sid).emit("show correct answer");
                                })
                                hostSocket.emit("show correct answer");
                            }
                        }
                        break;
                    }
                }
            }
            else{
                console.log("Someone's browser disconnected");      

            }
            
        });

        socket.on("start_edit", (msg) => {
            ids_map[msg.id] = socket.id;
            editing_ids.push(msg.id);
            socket.broadcast.emit('editing', { id: msg.id, editing_ids: editing_ids });
        })

        socket.on("stop_edit", (msg) => {
            ids_map[msg.id] = [];
            editing_ids.splice(editing_ids.indexOf(msg.id), 1);
            socket.broadcast.emit('stop_editing', msg);
        })

        socket.on('game_started', (msg) => {
            hostSocket = socket;
            gameLive = true;
            socket.broadcast.emit('game_in_progress', msg);
        })

        socket.on("checkGameStatus", () => {
            socket.emit("currentGameStatus", gameLive, quizLive);
        });

        socket.on("startQuiz", () => {
            quizLive = true;
            eventBus.emit('quizChanged', true);
            socket.broadcast.emit('renderQuizzes', gameObject.shuffle[gameObject.current_question_index]);
        })

        socket.on('ingame_player', (msg) =>{
            players_ids.push(socket.id);
            players_map[msg.username] = socket.id;
        })
    });
}

module.exports.eventBus = eventBus;
module.exports.init = init;


//new quiz created
eventBus.on('quiz.created', function (event) {
    io.emit('quiz.created', event);
});

//quiz deleted
eventBus.on('quiz.deleted', function (event) {
    io.emit('quiz.deleted', event);
});

//quiz modified
eventBus.on('quiz.modified', function (event) {
    io.emit('quiz.modified', event);
});

eventBus.on('player_joined', (username, new_gameObject) => {
    gameObject = new_gameObject;
    io.emit('new_player', new_gameObject.Players);
})

eventBus.on('gameEnded', (new_gameObject) => {
    gameLive = false;
    quizLive = false;
    eventBus.emit('quizChanged', false);
    gameObject = new_gameObject;
})

eventBus.on('gameStarted', (new_gameObject) => {
    gameObject = new_gameObject;
})

eventBus.emit('gameChanged', (new_gameObject) => {
    gameObject = new_gameObject;
});