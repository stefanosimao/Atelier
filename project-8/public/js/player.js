

function init() {

    let socket = io();

    socket.on("connect", () => {
        console.log("Browser connected!");
        document.getElementById('bigtitle').style.color = "green";
    });

    socket.on("disconnect", () => {
        console.log("Browser disconnected!");
        document.getElementById('bigtitle').style.color = "red";
    });

    socket.on("message", (msg) => {
        console.log(msg.text);
    });

    document.getElementById("play").addEventListener("click", () => {
        socket.emit("start_play");
    });

    document.getElementById("pause").addEventListener("click", () => {
        socket.emit("pause_play");
    });

}