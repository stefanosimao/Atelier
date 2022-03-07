const io = require('socket.io')();

let map_user_socket = {};
function init(server) {
    io.attach(server);
    console.log("Starting WS server");

    io.on('connection', function (socket) {

        console.log('client connected ', socket.id);

        socket.emit('message',
            {text: "Welcome!" });

        socket.on('disconnect', function () {
            console.log('client disconnected');
        });
        
        socket.on("addToPlaylist", addToPlaylist => {
            console.log(addToPlaylist);

            io.emit('addNowToPlaylist', addToPlaylist);
        })

        socket.on("start_play", () =>{
            socket.broadcast.emit("start_play");
        })

        socket.on("pause_play", () => {
            socket.broadcast.emit("pause_play");
        })

        socket.on("start_edit", (msg) => {
            let editing_now = false;
            let ids = Object.keys(map_user_socket);
            for (let i = 0; i < ids.length; i++){
                if (ids[i] == msg.id && map_user_socket[msg.id].length > 0){
                    editing_now = true;
                }
            }
            if (typeof map_user_socket[msg.id] === 'undefined' ) {
                map_user_socket[msg.id] = [];
            }
            if (editing_now == false){
                map_user_socket[msg.id].push(socket.id);
            }
            else{
                map_user_socket[msg.id].push(socket.id);
                map_user_socket[msg.id].forEach(sid =>{
                    io.to(sid).emit('editing');
                })
            }
            console.log(map_user_socket[msg.id]);
        })

        socket.on("stop_edit", (msg) => {
            let editing_now = false;
            if (map_user_socket[msg.id].length > 1) {
                editing_now = true;
            }
            if (editing_now == false) {
                map_user_socket[msg.id] = [];
                console.log('Done editing')
                console.log(map_user_socket)
            }
            else {
                let index = map_user_socket[msg.id].indexOf(socket.id);
                map_user_socket[msg.id].splice(index, 1);
                if (map_user_socket[msg.id].length = 1){
                    io.to(map_user_socket[msg.id][0]).emit('stop_editing');
                }
            }

        })

    });

}

module.exports.init = init;

const EventEmitter = require('events');
const eventBus = new EventEmitter()
module.exports.eventBus = eventBus;

//new song created
eventBus.on('song.created', function (event) {
    io.emit('song.created', event);
});

//song updated
eventBus.on('song.modified', function (event) {
    io.emit('song.modified', event);
});

//song deleted
eventBus.on('song.deleted', function (event) {
    io.emit('song.deleted', event);
});