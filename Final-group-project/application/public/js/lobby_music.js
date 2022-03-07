// Music for lobby
function music() {
    let mute = document.getElementById('lobby_mute');
    mute.addEventListener('click', function () {
        document.getElementById("audio").play();
        document.getElementById("audio").volume = 0.15;
        audio.muted = !audio.muted;
        if (mute.classList.contains('no_sound'))
            mute.className = "with_sound";
        else
            mute.className = "no_sound";
    });
}