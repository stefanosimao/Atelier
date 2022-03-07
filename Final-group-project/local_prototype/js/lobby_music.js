let song_started = false;

// Music for lobby
const mute = document.getElementById('lobby_mute');
mute.addEventListener('click', function () {
    if (!song_started) {
        document.getElementById("audio").play();
        document.getElementById("audio").volume = 0.25;
        song_started = true;
    }

    audio.muted = !audio.muted;
    if (mute.classList.contains('no_sound'))
        mute.className = "with_sound";
    else
        mute.className = "no_sound";
});