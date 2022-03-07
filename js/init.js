/**
 * Initialize the content of the songs.html page as described in Task 2
 */
function init_songs() {

    function songToHTML(data){
        return `<article class="song" data-sid="${data["_id"]}">
                    <a rel="play" href="player.html?src=${data["src"]}" target="player">Play</a>
                    <span class="filename">${data["filename"]}</span>
                    <span class="duration">${data["duration"]}</span>
                    <span class="size">${data["size"]}</span>
                    <span class="title">${data["title"]}</span>
                    <span class="album">${data["album"]}</span>
                    <span class="artist">${data["artist"]}</span>
                    <span class="genre">${data["genre"]}</span>
                    <span class="desc">${data["desc"]}</span>
                    <span><progress class="quality" min="0" max="10" value="${data["quality"]}"></progress></span>
                    <button data-action="fav" id="fav_${data["_id"]}" data-fav="${data["favourite"]}">&#9734;</button>
                    <button data-action="delete" id="delete_${data["_id"]}">&#215;</button>
                    <button type="button" class="add_button" id=${data["src"]}>ADD</button>
                    <button type="button" class="remove_button" id=${data["src"]}>REM</button>
                    </article>`;
    }

    function sidebarToHTML(data, type){
        return `<a href="songs.html?${type}=${data}" class="link">${data}</a></aside>`;
    }

    function showSidebar(items, type){
        for (let j = 0; j < items.length; j++){
            sidebar.innerHTML = sidebar.innerHTML + (sidebarToHTML(items[j], type));
        }
    }

    function showSongs(songs){
        for (let i = 0; i < songs.length; i++){
            table.innerHTML = table.innerHTML + (songToHTML(songs[i]));
        }
    }

    let table = document.querySelector('.song_table');
    let sidebar = document.querySelector('#sidebar');
    let sidebar_title = document.querySelector('#sidebar_title');

    let url = new URL(window.location);
    const query = new URLSearchParams(url.search);
    let DOMtitle = document.querySelector('#bigtitle');

    if(url.search == ''){
        showSongs(song_data);
    }

    if(query.has('artist')){
        const artistName = url.searchParams.get('artist');
        searchQuery = {};
        searchQuery.artist = artistName;
        if (artistName == undefined){
            showSongs(song_data);
        }
        let songsToDisplay = find_by(song_data, searchQuery)
        showSongs(songsToDisplay);

        let newDOMtitle = `Filter: Artist - ${songsToDisplay.length} Songs`;
        DOMtitle.innerHTML = newDOMtitle;

        let albumsFromArtist = Object.keys(group_by(songsToDisplay, "album"));
        sidebar_title.innerHTML = 'Albums from ' + artistName;
        showSidebar(albumsFromArtist, 'album');
        
    }

    if(query.has('album')){
        const albumName = url.searchParams.get('album');
        searchQuery = {};
        searchQuery.album = albumName;
        if (albumName == undefined){
            showSongs(song_data);
        }
        let songsToDisplay = find_by(song_data, searchQuery)
        showSongs(songsToDisplay);

        let newDOMtitle = `Filter: Album - ${songsToDisplay.length} Songs`;
        DOMtitle.innerHTML = newDOMtitle;
    }


    if(query.has('genre')){
        const genreName = url.searchParams.get('genre');
        searchQuery = {};
        searchQuery.genre = genreName;
        if (genreName == undefined){
            showSongs(song_data);
        }
        let songsToDisplay = find_by(song_data, searchQuery)
        showSongs(songsToDisplay);

        let newDOMtitle = `Filter: Genre - ${songsToDisplay.length} Songs`;
        DOMtitle.innerHTML = newDOMtitle;

        let artistsFromGenre = Object.keys(group_by(songsToDisplay, "artist"));
        sidebar_title.innerHTML = genreName + ' artists';
        showSidebar(artistsFromGenre, 'artist');
    }


    
    function addToPlaylist(buttonElement){
        //Load Data
        let playlist_string = localStorage.getItem('pl');
        let playlist_object = JSON.parse(playlist_string); 
        let thisSong = buttonElement.id;
        if (!playlist_object.songs.includes(thisSong)){
            playlist_object.songs.push(thisSong);
        }
        //console.log(buttonElement.id);
        //Save data
        playlist_string = JSON.stringify(playlist_object);
        localStorage.setItem('pl', playlist_string);

        // const change_event = new CustomEvent('playlist-add', {detail: this});
        // buttonElement.dispatchEvent(change_event);
    }

    document.querySelectorAll(".add_button").forEach(element => element.addEventListener("click", (event) => addToPlaylist(event.target)));

    
    function removeFromPlaylist(buttonElement){
        //Load Data
        let playlist_string = localStorage.getItem('pl');
        let playlist_object = JSON.parse(playlist_string); 
        let thisSong = buttonElement.id;
        if (playlist_object.songs.includes(thisSong)){
            let song_index = playlist_object.songs.indexOf(thisSong);
            playlist_object.songs.splice(song_index,1);
            //console.log(song_index);
        }
        //console.log(song_index);
        //Save data
        playlist_string = JSON.stringify(playlist_object);
        localStorage.setItem('pl', playlist_string);

        // const change_event = new CustomEvent('playlist-add', {detail: this});
        // buttonElement.dispatchEvent(change_event);
    }
    
    document.querySelectorAll(".remove_button").forEach(element => element.addEventListener("click", (event) => removeFromPlaylist(event.target)));
    
}

/**
 * Initialize the content of the index.html page as described in Task 3
 */
function init_home() {

    let genres = group_by(song_data, "genre");
    let albums = group_by(song_data, "album");
    let artists = group_by(song_data, "artist");

    //Show favourites
    function favToHTML(data){
        return `<a href="player.html?src=${data.src}" target="_blank" class="home favssong link">${data.title}</a>`;
    }

    function showFavs(items){
        for (let k = 0; k < items.length; k++){
            favs_DOM.innerHTML = favs_DOM.innerHTML + (favToHTML(items[k]));
        }
    }

    function takeFavs(data){
        for (let l = 0; l < data.length; l++){
            if (data[l].favourite){
                fav_songs.push(data[l]);
            }
        }
    }

    function artListToHTML(data){
        return `<a href="songs.html?artist=${data}" target="_blank" class="home fastlink" >${data}</a>`
    }

    function genListToHTML(data){
        return `<a href="songs.html?genre=${data}" target="_blank" class="home fastlink" >${data}</a>`
    }

    let favs_DOM = document.querySelector('#favs');
    let fav_songs = [];
    takeFavs(song_data);
    showFavs(fav_songs);

    //Song Number
    let s_Number = document.querySelector('#song_number');
    s_Number.innerText = song_data.length + ' Songs'

    //Album Number
    let al_Number = document.querySelector('#album_number');
    al_Number.innerText = Object.keys(albums).length + ' Albums'

    //Genre Number
    let gen_Number = document.querySelector('#genre_number');
    gen_Number.innerText = Object.keys(genres).length + ' Genres'

    //Artist Number
    let art_Number = document.querySelector('#artist_number');
    art_Number.innerText = Object.keys(artists).length + ' Artists'


    //Artist list
    let art_list = document.querySelector('#artists_list');
    for (let i = 0; i < Object.keys(artists).length; i++){
        art_list.innerHTML = art_list.innerHTML + (artListToHTML(Object.keys(artists)[i]))
    }

    //Genre list
    let gen_list = document.querySelector('#genres_list');
    for (let i = 0; i < Object.keys(genres).length; i++){
        gen_list.innerHTML = gen_list.innerHTML + (genListToHTML(Object.keys(genres)[i]))
    }
    

}



/**
 * @param {Array[Object]} a - Array of objects, which may contain at least field k
 * @param {String} k - The name of a field of the objects inside the array
 * @return {Object{Array[Object]}} - returns a dictionary which indexes the original Objects
 * contained in the Array a depending on the values of their field k.
 */
function group_by(a, k) {

    if (!(a instanceof Array) || a.length == 0) {
        return undefined;
    }

    let result = {};
    let noK = [];
    let yesK = [];
    for (let i = 0; i < a.length; i++){
        let b = Object.keys(a[i]);
        if (b.includes(k)){
            yesK.push(a[i]);
        }
        else{
            noK.push(a[i]);
        }
    }
    
    if (noK.length > 0){
        result[undefined] = noK;
    }
   
    for (let j = 0; j < yesK.length; j++){
        if (Object.keys(result).includes(a[j][k])){
            result[a[j][k]].push(a[j]);
        }
        else{
            result[a[j][k]] = [a[j]];
        }
    }

     return result;
}



/**
 * @param {Array[Object]} a - Array of objects
 * @param {Object} f - Filter object, to be matched against the objects in the array
 * @return {Array[Object]}} - returns an array of the matching objects.
 * An object matches the filter if all non-undefined/non-null fields of the filter
 * are found with the same value in the object
 */
function find_by(a, f) {
    if (!(a instanceof Array) || a.length == 0) {
        return undefined;
    }

    if (Object.keys(f).length == 0){
        return a;
    }

    let result = [];

    function checkProp(propNames, o){
        let match = [];
        for (let j = 0; j < propNames.length; j++){
            for (let k = 0; k < propNamesf.length; k++){
                if(propNames[j] == propNamesf[k] && o[propNames[j]] == f[propNamesf[k]]){
                    match.push(1);
                }
            }
        }
    return match.length;
    }

    let propNamesf = Object.getOwnPropertyNames(f).filter(item => f[item] != undefined);
    propNamesf = Object.getOwnPropertyNames(f).filter(item => f[item] != null);
    if (propNamesf.length == 0){
        return a;
    }

    for (let i = 0; i < a.length; i++){
        const propNames = Object.getOwnPropertyNames(a[i]);    
        
        let matchL = checkProp(propNames, a[i]);
        if (matchL == propNamesf.length){
            result.push(a[i]);
        }

    }

    return result;
}


//This is the constructor function stub for Task 5.
//If you prefer to use classes, feel free to change it accordingly.
function Playlist(a, repeat = false) {

    //public fields
    this.index = 0;
    this.songs = a;
    this.repeat = repeat;

    //methods
    this.toJSON = function(){
        let o = {index: this.index, songs: this.songs, repeat: this.repeat};
        let json = JSON.stringify(o);
        return json;
    };

    this.load = function(json){
        try{
            let o = JSON.parse(json);
            if (typeof o == "object" && Array.isArray(o.songs) && typeof repeat == 'boolean'){
                this.index = o.index;
                this.songs = o.songs;
                this.repeat = o.repeat;
                return this;s
            }
        } 
        catch(e){
            return this;
        }
        return this;
    };

    this.next = function(){
        if (this.repeat){
            if (this.index < this.songs.length -1){
                this.index++;
                return this.songs[this.index];
            }
            else {
                this.index = 0;
                return this.songs[this.index];
            }
        }
        else{
            if (this.index < this.songs.length -1){
                this.index++;
                return this.songs[this.index];
            }
            else if(this.index >= this.songs.length -1){
                this.index = this.songs.length;
                return undefined;
            }
            else if (this.index == -1) {
                this.index++;
                return this.songs[this.index];
            }
        }
    };

    this.prev = function(){
        if (this.repeat){
            if (this.index > 0){
                this.index--;
                return this.songs[this.index];
            }
            else {
                this.index = this.songs.length -1;
                return this.songs[this.index];
            }
        }
        else{
            if (this.index > 0){
                this.index--;
                return this.songs[this.index];
            }
            else if(this.index <= 0){
                this.index = -1;
                return undefined;
            }
            else if (this.index == this.songs.length -1){
                this.index--;
                return this.songs[this.index];
            }
        }
    };

    this.appendSong = function(s){
        this.songs.push(s);
    };

    this.toHTML = function(){
        let playlist_HTML = ` `;
        for(let i = 0; i < this.songs.length; i++){
            let title = song_data.filter(x => {return x.src == this.songs[i];})[0].title
            playlist_HTML = playlist_HTML + `<article class="home playlist_song">${title}</article>`
        }
        return playlist_HTML;
    };


}



//Task 6
//Adapt and extend the code of init_player
function init_player_with_playlist(dom, key, a) {

    let playlist_o = new Playlist(a);
    let playlist_s = playlist_o.toJSON();
    
    if (localStorage.getItem(key) == null){
        localStorage.setItem(key, playlist_s);
        console.log('localStorage is empty');
    }
    else {
        let old_playlist = localStorage.getItem(key);
        playlist_o.load(old_playlist);
        console.log('Loading localStorage');
        //console.log(playlist_o);
    }

    function continuePlay() {
        if (dom_audio.ended) {
            nextSong();
            dom_audio.play();
        }
    }

    function generateHTML(key){
        return `<section class="player">
                    <main class="player" id="player${key}">
                        <header class="player" >
                            <p class="title rest artist"></p>
                            <p class="title titleSong" id="titleSong${key}"></p>  
                            <p class="title rest album"></p>  
                        </header>
                        <section class="play buttons">
                            <button type="button" class="small" id="prev${key}"></button>
                            <button type="button" id="play${key}"></button>
                            <button type="button" id="pause${key}"></button>
                            <button type="button" class="small" id="next${key}"></button>
                        </section>
                        <section class="player seek play" >
                            <p class="elapsed" id="elapsed${key}"></p>
                            <progress id="file${key}" value="0" max="100"></progress>
                            <p class="remain" id="remain${key}"></p>
                        </section>  
                        <section class="play playlist" id="playlist${key}">
                            <h2 id="playlist_title">Playlist</h2>
                        </section>
                        <aside class="player volume" > 
                                <button type="button" id="loud${key}"></button>
                                <button type="button" id="mute${key}"></button>
                                <button type="button" id="low${key}"></button>
                                <input type="range" id="slide${key}" min="0" max="100" value="75"/>
                                <button type="button" class="smallest" id="repeat${key}"></button>
                                <button type="button" id="remove${key}"></button>
                                <button type="button" id="removeAll${key}"></button>
                        </aside>
                    </main>

                </section>
            <audio id="player-audio${key}" style="display:none"></audio>`
    }

    function generateStyle(key){
        return ` #player_body>h1 {
    margin-bottom: 30px
}

* {
    margin: 2px;
    padding: 2px;
    text-align: center;
    font-family: Quicksand;
}

body {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
}

section {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
}

main {
    flex: 10;
    height: fit-content;
}

.playlist_song{
    border: 1px solid rgb(92, 70, 70);
    font-size: max(0.8vw, 0.8em);
    width: 95%;
}#player${key} button#prev${key} {background-image: url("images/prev.svg")}
        #player${key} button#play${key} {background-image: url("images/play.svg")}
        #player${key} button#pause${key} {background-image: url("images/pause.svg")}
        #player${key} button#next${key} {background-image: url("images/next.svg")}
        #player${key} button#loud${key} {background-image: url("images/loud.svg")}
        #player${key} button#mute${key} {background-image: url("images/mute.svg")}
        #player${key} button#low${key} {background-image: url("images/low.svg")} 
        #player${key} button#repeat${key} {background-image: url("images/repeat.svg")}
        #player${key} button#remove${key} {background-image: url("images/highlight_off.svg")}
        #player${key} button#removeAll${key} {background-image: url("images/playlist_remove.svg")}
        #player${key} #remove${key}{grid-column: 3; grid-row: 1; margin-right: 1em}
        #player${key} #removeAll${key}{grid-column: 3; grid-row: 5; margin-right: 1em}
        #player${key} .volume button#mute${key} {margin-left: 1em; grid-row: 3; grid-column: 1}
        #player${key} .volume button#loud${key} {grid-row: 1; grid-column: 2}
        #player${key} .volume button#low${key} {grid-row: 5; grid-column: 2}
        #player${key} {text-align: center}
        #player${key} {display: grid; grid-template-columns: 7fr 2fr 2fr; height: 150px}
        #player${key}>header {grid-column: 1}
        #player${key}>section {grid-column: 1}
        #player${key}>aside {grid-column: 2; grid-row: 1/4}
        #player${key} > .playlist {grid-column: 3; grid-row: 1/4; display: flex; flex-direction: column; border-left: 3px solid rgb(0, 0, 0); overflow: scroll} 
        #player${key} header {display: flex; flex-direction: row; align-items: baseline}
        #player${key} header p {flex: 1}
        #player${key} header p.title {font-size: 2em}
        #player${key} section {display: flex; flex-direction: row; align-items: center}
        #player${key} section.seek {margin-top: 1em; justify-content: center}
        #player${key} section.seek p {margin: 1em}
        #player${key} section.seek p.elapsed {color: black}
        #player${key} section.seek p.remain {color: gray}
        #player${key} section.seek progress {width: 45vw; height: 32px}
        #player${key} section.play.buttons {justify-content: center}
        #player${key} button {border-radius: 50%; border-width: 10px}
        #player${key} button:hover {background-color: rgb(0, 132, 255)}
        #player${key} button {background-size: contain; background-position: center center; background-repeat: no-repeat}
        #player${key} button.smallest {grid-column: 3; grid-row: 3; margin-right: 1em}
        #player${key} button.smallestrepeat {border-color: red; grid-column: 3; grid-row: 3; margin-right: 1em}
        #player${key} button.small {width: 75px; height: 75px}
        #player${key} button {width: 125px; height: 125px}
        #player${key} aside.volume button {width: 50px; height: 50px; background-size: 50%}
        #player${key} aside.volume {display: grid; grid-template-columns: 100px 100px 100px; grid-template-rows: 2fr 1fr 5fr 1fr 2fr; align-content: space-around; align-items: center; justify-items: center; justify-content: start}
        #player${key} .volume button {border-width: 5px; width: 50px; height: 50px; display: flex; justify-items: center; align-items: center}
        #player${key} .volume input[type=range] {grid-row: 3; grid-column: 2; transform: rotate(-90deg) translate(-85px, 65px); transform-origin: 0 0; width: 150px}
        .current_playing${key} {background-color: rgba(126, 125, 43, 0.349)}
        .playlist_song:hover {background-color: rgba(43, 126, 98, 0.349); transition: all 0.25s}
        `
    }

    let styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = generateStyle(key);
    document.head.appendChild(styleSheet);

    //dom.innerHTML = dom.innerHTML + generateHTML(key);
    dom.insertAdjacentHTML('beforeend', generateHTML(key));

    function repeat_button(key){
        if(playlist_o.repeat){
            playlist_o.repeat = false;
            document.querySelector(`#repeat${key}`).classList.remove('smallestrepeat');
            document.querySelector(`#repeat${key}`).classList.add('smallest')
        }
        else{
            playlist_o.repeat = true;
            document.querySelector(`#repeat${key}`).classList.remove('smallest');
            document.querySelector(`#repeat${key}`).classList.add('smallestrepeat')
        }
    }

    function currentPlaying(key){
        let now = document.querySelector(`#titleSong${key}`).innerText;
        document.querySelectorAll(`#player${key} .playlist_song`).forEach(song => song.classList.add(`playlist_songs${key}`));
        let playlist_songs = document.querySelectorAll(`.playlist_songs${key}`);
        for (let j = 0; j < playlist_songs.length; j++){
            if (playlist_songs[j].innerText == now){
                playlist_songs[j].classList.add(`current_playing${key}`);
            }
            else{
                playlist_songs[j].classList.remove(`current_playing${key}`);
            }
        }
    }

    //Init Playlist
    let playlistID = `#playlist${key}`;
    let dom_playlist = document.querySelector(playlistID);
    dom_playlist.innerHTML = dom_playlist.innerHTML + playlist_o.toHTML();
    document.querySelector(`#repeat${key}`).addEventListener('click', () => repeat_button(key));
    window.addEventListener('storage', (e) =>{
        //console.log(e);
        old_playlist = localStorage.getItem(key);
        let old_index = playlist_o.index;
        playlist_o.load(old_playlist);
        playlist_o.index = old_index;
        dom_playlist.innerHTML = `<h2 id="playlist_title">Playlist</h2>` + playlist_o.toHTML();
        if (playlist_o.songs.length > 0){
            document.querySelector(`#titleSong${key}`).innerText = song_data.filter(x => {return x.src == playlist_o.songs[playlist_o.index];})[0].title;
        }
        else{
            document.querySelector(`#titleSong${key}`).innerText = 'No songs in the playlist';
        }
    });

    
    //Init player
    let dom_audio = document.querySelector(`#player-audio${key}`);
    let firstSong = playlist_o.songs[0];
    dom_audio.src = firstSong;
    dom_audio.load();
    dom_audio.addEventListener('canplay', () => console.log("You can start listening"));

    if (playlist_o.songs.length > 0){
        let songName = song_data.filter(x => {return x.src == playlist_o.songs[0];})[0].title;
        document.querySelector(`#titleSong${key}`).innerText = songName;
    }
    else{
        document.querySelector(`#titleSong${key}`).innerText = 'No songs in the playlist';
    }
    
    document.querySelector(`#slide${key}`).setAttribute('value', '75.0')
    dom_audio.volume = '0.75';
    document.querySelector(`#file${key}`).setAttribute('max', dom_audio.duration);

    dom_audio.addEventListener('volumechange', () => {
        document.querySelector(`#slide${key}`).setAttribute('value', dom_audio.volume * 100);
        console.log(dom_audio.volume)
    });
    document.querySelector(`#loud${key}`).addEventListener("click", () => {
        dom_audio.volume > 0.8 ? dom_audio.volume = 1.0 : dom_audio.volume += 0.2
    });
    document.querySelector(`#low${key}`).addEventListener("click", () => {
        dom_audio.volume < 0.2 ? dom_audio.volume = 0.0 : dom_audio.volume -= 0.2
    });
    document.querySelector(`#mute${key}`).addEventListener("click", () => {
        dom_audio.volume == 0.0 ? dom_audio.volume = 0.75 : dom_audio.volume = 0.0
    });
    document.querySelector(`#slide${key}`).addEventListener("input", () => dom_audio.volume = document.querySelector(`#slide${key}`).value / 100);


    setInterval(() => {
        document.querySelector(`#elapsed${key}`).innerHTML = format_seconds(dom_audio.currentTime);
        document.querySelector(`#remain${key}`).innerHTML = format_seconds(Math.ceil(song_data.filter(x => {return x.src == playlist_o.songs[playlist_o.index];})[0].duration) - dom_audio.currentTime);
        continuePlay();
        document.querySelector(`#file${key}`).setAttribute('value', dom_audio.currentTime);
        document.querySelector(`#file${key}`).setAttribute('max', song_data.filter(x => {return x.src == playlist_o.songs[playlist_o.index];})[0].duration);
        currentPlaying(key);
    }, 100);

    document.querySelector(`#play${key}`).addEventListener("click", () => {dom_audio.play(); console.log('Play')});
    document.querySelector(`#pause${key}`).addEventListener("click", () => dom_audio.pause());

    function nextSong(paused) {
        if (playlist_o.repeat){
            dom_audio.src = playlist_o.next();
            document.querySelector(`#titleSong${key}`).innerText = song_data.filter(x => {return x.src == playlist_o.songs[playlist_o.index];})[0].title;
        }
        else{
            if (playlist_o.index >= playlist_o.songs.length -1){
                console.log('End of the playlist reached!')
            }
            else{
                dom_audio.src = playlist_o.next();
                document.querySelector(`#titleSong${key}`).innerText = song_data.filter(x => {return x.src == playlist_o.songs[playlist_o.index];})[0].title;
            }
        }

        if (!paused) {
            dom_audio.play();
        }
  
    }

    function prevSong(paused) {
        if (playlist_o.repeat){
            dom_audio.src = playlist_o.prev();
            document.querySelector(`#titleSong${key}`).innerText = song_data.filter(x => {return x.src == playlist_o.songs[playlist_o.index];})[0].title;
        }
        else{
            if (playlist_o.index == 0 ){
                console.log('Cannot go back!')
            }
            else{
                dom_audio.src = playlist_o.prev();
                document.querySelector(`#titleSong${key}`).innerText = song_data.filter(x => {return x.src == playlist_o.songs[playlist_o.index];})[0].title;
            }
        }

        if (!paused) {
            dom_audio.play();
        }
        
    }

    document.querySelector(`#next${key}`).addEventListener("click", () => nextSong(dom_audio.paused));
    document.querySelector(`#prev${key}`).addEventListener("click", () => prevSong(dom_audio.paused));


    function removeSong(button) {
        //Load Data
        let playlist_string = localStorage.getItem(key);
        let playlist_object = JSON.parse(playlist_string); 

        let thisSongTitle = document.querySelector(`#titleSong${key}`).innerText;
        for (let j = 0; j < song_data.length; j++){
            if (song_data[j].title == thisSongTitle){
                let song_index = playlist_object.songs.indexOf(song_data[j].src);
                playlist_object.songs.splice(song_index,1);
            }
        }

        //Save data
        playlist_string = JSON.stringify(playlist_object);
        localStorage.setItem(key, playlist_string);

        let old_index = playlist_o.index;
        playlist_o.load(playlist_string);
        playlist_o.index = old_index;
        dom_playlist.innerHTML = `<h2 id="playlist_title">Playlist</h2>` + playlist_o.toHTML();
        if (playlist_o.songs.length > 0){
            document.querySelector(`#titleSong${key}`).innerText = song_data.filter(x => {return x.src == playlist_o.songs[playlist_o.index];})[0].title;
        }
        else{
            document.querySelector(`#titleSong${key}`).innerText = 'No songs in the playlist';
        }
    }


    let remove_button = document.querySelector(`#remove${key}`);
    remove_button.addEventListener("click", (event) => removeSong(event.target));


    function removeAllSong(){
        //Load Data
        let playlist_string = localStorage.getItem(key);
        let playlist_object = JSON.parse(playlist_string); 

        playlist_object.songs=[];
        playlist_object.index=0;

        //Save data
        playlist_string = JSON.stringify(playlist_object);
        localStorage.setItem(key, playlist_string);

        playlist_o.load(playlist_string);
        dom_playlist.innerHTML = `<h2 id="playlist_title">Playlist</h2>` + playlist_o.toHTML();
        document.querySelector(`#titleSong${key}`).innerText = 'No songs in the playlist';
    }

    let removeAll_button = document.querySelector(`#removeAll${key}`);
    removeAll_button.addEventListener("click", (event) => removeAllSong(event.target));
} 