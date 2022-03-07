let song_data = {};
let songs = [];
function init() {
    window.onpopstate = function (event) {
        //console.log(event.state);
        navigate(event.state.urlPath);
    };
    let frag = window.location.hash;
    init_playlist(frag);
}

function init_playlist(frag) {
    API.refreshSongs().then(data => {
        song_data = JSON.parse(data)
        //console.log(song_data);
        navigate(frag, 'view');
        for (let i = 0; i < song_data.length; i++) {
            if (song_data[i].missing_file == false || song_data[i].missing_file !== 'undefined') {
                let songSrc = song_data[i].src
                songs.push(songSrc);
            }
        }
        let dom = document.getElementsByTagName("footer")[0];

        init_player_with_playlist(dom, "pl", songs);
    })
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function navigate(frag, options = ''){
    
    if (frag == 'songs' || frag == '#songs') {
        if (options == 'view') {
            API.getSongsView();
        }
        else {
            API.getSongs();
        }
    }
    else if (frag == 'home' || frag == '') {
        API.getHome();
    }
    else if (frag.includes('artist')){
        if (options == '' || options == 'view'){
            let options = '?artist=' + frag.substring(frag.lastIndexOf('/') + 1);
            API.getArtist(options);
        }else{
            API.getArtist(options);
        }
    }
    else if (frag.includes('genre')) {
        if (options == '' || options == 'view') {
            let options = '?genre=' + frag.substring(frag.lastIndexOf('/') + 1);
            API.getGenre(options);
        } else {
            API.getGenre(options);
        }
    }
    else if (frag.includes('album')) {
        if (options == '' || options == 'view') {
            let options = '?album=' + frag.substring(frag.lastIndexOf('/') + 1);
            API.getAlbum(options);
        } else {
            API.getAlbum(options);
        }
    }
    else if (frag == 'upload' || frag == '#upload') {
        API.getUpload();
    }
    else if (frag.includes('edit')) {
        if (options == '' || options == 'view') {
            //let id = '/' + frag.substring(frag.lastIndexOf('/') + 1) + '/edit';
            let id = frag.substring(frag.lastIndexOf('/') + 1);
            //console.log(options);
            API.getEdit(id);
        } else {
           // API.getAlbum(options);
        }
    }
    else if (frag.includes('search')) {
        let options = frag.substring(frag.lastIndexOf('/') + 1);
        API.getSearch(options);
    }
    else if (frag.includes('sort')) {
        options = options.substring(options.indexOf('=') + 1);
        API.sortSongs(options);
    }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function linkClick(event) {
    event.preventDefault();
    console.log(event.currentTarget.href);

    let url = new URL(event.currentTarget.href);
    if (url.pathname == "/") {
        navigate('home');
    }
    else if (url.pathname.endsWith("/songs/") && url.search == '') {
        navigate('songs');
    }
    else if (url.search.includes('artist')) {
        //console.log(url.search)
        navigate('artist', url.search);
    }
    else if (url.search.includes('genre')) {
        navigate('genre', url.search);
    }
    else if (url.search.includes('album')) {
        navigate('album', url.search);
    }
    else if (url.pathname.endsWith("/upload")) {
        navigate('upload');
    }
    else if (url.search.includes('fav')){
        let id = url.search.substring(url.search.indexOf('=')+1);
        API.playSong(id);
    }
    else if (url.search.includes('sort')) {
        navigate('sort', url.search);
    }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function buttonClick(event) {
    event.preventDefault();
    let button = event.target;
    let buttonName = button.className.substring(0, button.className.indexOf('_'));
    let article = button.parentNode;
    let id = article.id;
    
    if (buttonName == 'edit'){
        API.getEdit(id);
    }
    else if (buttonName == 'delete') {
        let dom_playlist = document.querySelector(`#playlistpl`);
        let songs_playlist = dom_playlist.querySelectorAll('.playlist_song');
        let song_title;
        for (let i = 0; i < song_data.length; i++) {
            if (song_data[i]._id == id) {
                song_title = song_data[i].title;
                console.log(song_title);
            }
        }
        console.log(songs_playlist);
        for (let j = 0; j < songs_playlist.length; j++) {
            if (songs_playlist[j].innerHTML == song_title) {
                console.log('here');
                removeSongOut(dom_playlist, id);
            }
        }

        API.deleteSong(id);
        for (let i = 0; i < song_data.length; i++) {
            if (song_data[i]._id == id) {
                song_data.splice(i, 1);
            }
        }
        article.parentNode.removeChild(article);
    }
    else if(buttonName == 'play'){
        API.playSong(id);
    }
    else if(buttonName == 'add'){
        API.addToPlaylist(id);
    }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function changeLocationBar(frag, name = ''){
    if (frag == '#songs'){
        history.pushState({ urlPath: frag }, "Song Table", 'http://localhost:8888/' + frag);
    }
    else if(frag == 'home'){
        history.pushState({ urlPath: ''}, "Homepage", 'http://localhost:8888/');
    } 
    else if (frag == '#songs/artist') {
        history.pushState({urlPath: frag + '/' + name}, "Song Table", 'http://localhost:8888/' + frag + '/' + name);
    }
    else if (frag == '#songs/genre') {
        history.pushState({ urlPath: frag + '/' + name }, "Song Table", 'http://localhost:8888/' + frag + '/' + name);
    }
    else if (frag == '#songs/album') {
        history.pushState({ urlPath: frag + '/' + name }, "Song Table", 'http://localhost:8888/' + frag + '/' + name);
    }
    else if (frag == '#upload') {
        history.pushState({ urlPath: frag }, "Upload Song", 'http://localhost:8888/' + frag);
    }
    else if (frag == '#edit') {
        history.pushState({ urlPath: frag + '/' + name }, "Edit Song", 'http://localhost:8888/' + frag + '/' + name);
    }
    else if (frag == '#songs/search') {
        history.pushState({ urlPath: frag + '/' + name }, "Search Song", 'http://localhost:8888/' + frag + '/' + name);
    }
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
API = function () {

    function getHome() {
        let model = {};
        let html;
        for (let i = 0; i < song_data.length; i++) {
            if (song_data[i].missing_file == true) {
                song_data.splice(i, 1);
            }
        }
        if (song_data.length == 0) {
            model = { data: [], a_List: [], gen_List: [], fav_List: [] };
            html = ejs.views_homepage(model);

        }
        else {
            let stats = [];
            let genres = group_by(song_data, "genre");
            let albums = group_by(song_data, "album");
            let artists = group_by(song_data, "artist");
            let favourites = [];
            for (let i = 0; i < song_data.length; i++) {
                if (song_data[i].favourite == true) {
                    favourites.push(song_data[i]);
                }
            }

            //Song Number
            let s_Number = song_data.length;
            stats.push(s_Number);

            //Album Number
            let al_Number = Object.keys(albums).length;
            stats.push(al_Number);

            //Genre Number
            let gen_Number = Object.keys(genres).length;
            stats.push(gen_Number);

            //Artist Number
            let art_Number = Object.keys(artists).length;
            stats.push(art_Number);

            //Artist list
            let a_List = Object.keys(artists);

            //Genre list
            let gen_List = Object.keys(genres);

            model = { data: stats, a_List: a_List, gen_List: gen_List, fav_List: favourites };
            html = ejs.views_homepage(model);
        }

        document.getElementById('secChange').innerHTML = html;
        document.getElementsByTagName("title")[0].innerHTML = 'Homepage';

        //intercept clicks
        document.getElementById('secChange').querySelectorAll("a").forEach(a => {
            a.addEventListener("click", linkClick);
        })
        
        changeLocationBar('home');

    }

    function getSongs() {
        let genres = group_by(song_data, "genre");
        let gen_List_Side = Object.keys(genres);
        let model = { song_List: song_data, side_List: gen_List_Side, side_Type: 'genre' };
        let html = ejs.views_songs(model);
        document.getElementById('secChange').innerHTML = html;
        document.getElementsByTagName("title")[0].innerHTML = 'Song Table';

        //intercept clicks
        document.getElementById('secChange').querySelectorAll("a:not(.download_button)").forEach(a => {
            a.addEventListener("click", linkClick);
        })

        //intercept clicks
        document.getElementById('secChange').querySelectorAll("button:not(.download_button)").forEach(a => {
            a.addEventListener("click", buttonClick);
        })

        let dom_playlist = document.querySelector(`#playlistpl`);
        dom_playlist.innerHTML = `<h2 id="playlist_title">Playlist</h2>` + playlist_o.toHTML();
        console.log(dom_playlist);

        changeLocationBar('#songs');
        let input = document.getElementById('searchSong');
        input.addEventListener("input", (event) =>{
            //console.log(input.value);
            API.search(input.value, song_data);
            if (input.value.length > 0) {
                changeLocationBar('#songs/search', input.value);
            }
            else{
                changeLocationBar('#songs');
            }
        })

    }

    function getSongsView() {
        let genres = group_by(song_data, "genre");
        let gen_List_Side = Object.keys(genres);
        let model = { song_List: song_data, side_List: gen_List_Side, side_Type: 'genre' };
        let html = ejs.views_songs(model);
        document.getElementById('secChange').innerHTML = html;
        document.getElementsByTagName("title")[0].innerHTML = 'Song Table';

        //intercept clicks
        document.getElementById('secChange').querySelectorAll("a:not(.download_button)").forEach(a => {
            a.addEventListener("click", linkClick);
        })

        //intercept clicks
        document.getElementById('secChange').querySelectorAll("button:not(.download_button)").forEach(a => {
            a.addEventListener("click", buttonClick);
        })

        changeLocationBar('#songs');
        let input = document.getElementById('searchSong');
        input.addEventListener("input", (event) => {
            //console.log(input.value);
            API.search(input.value, song_data);
            if (input.value.length > 0) {
                changeLocationBar('#songs/search', input.value);
            }
            else {
                changeLocationBar('#songs');
            }
        })

    }

    function getArtist(options) {
        let searchQuery = {};
        searchQuery.artist = decodeURI(options.substring(options.indexOf('=')+1));
        let songsToDisplay = find_by(song_data, searchQuery);
        let albumsFromArtist = Object.keys(group_by(song_data, "album"));
        let model = { song_List: songsToDisplay, side_List: albumsFromArtist, side_Type: 'album' };

        let html = ejs.views_songs(model);
        document.getElementById('secChange').innerHTML = html;
        document.getElementsByTagName("title")[0].innerHTML = 'Song Table';

        //intercept clicks
        document.getElementById('secChange').querySelectorAll("a").forEach(a => {
            a.addEventListener("click", linkClick);
        })

        //intercept clicks
        document.getElementById('secChange').querySelectorAll("button:not(.download_button)").forEach(a => {
            a.addEventListener("click", buttonClick);
        })

        let name = new URLSearchParams(options).get('artist');
        changeLocationBar('#songs/artist', name);
        let input = document.getElementById('searchSong');
        input.addEventListener("input", (event) => {
            //console.log(input.value);
            API.search(input.value, songsToDisplay);
            if (input.value.length > 0) {
                changeLocationBar('#songs/search', input.value);
            }
            else {
                changeLocationBar('#songs/artist', name);
            }
        })
    }

    function getGenre(options) {
        let searchQuery = {};
        searchQuery.genre = decodeURI(options.substring(options.indexOf('=') + 1));
        let songsToDisplay = find_by(song_data, searchQuery);
        let artistsFromGenre = Object.keys(group_by(song_data, "artist"));
        let model = { song_List: songsToDisplay, side_List: artistsFromGenre, side_Type: 'artist' };

        let html = ejs.views_songs(model);
        document.getElementById('secChange').innerHTML = html;
        document.getElementsByTagName("title")[0].innerHTML = 'Song Table';

        //intercept clicks
        document.getElementById('secChange').querySelectorAll("a").forEach(a => {
            a.addEventListener("click", linkClick);
        })

        //intercept clicks
        document.getElementById('secChange').querySelectorAll("button:not(.download_button)").forEach(a => {
            a.addEventListener("click", buttonClick);
        })

        let name = new URLSearchParams(options).get('genre');
        changeLocationBar('#songs/genre', name);
        let input = document.getElementById('searchSong');
        input.addEventListener("input", (event) => {
            //console.log(input.value);
            API.search(input.value, songsToDisplay);
            if (input.value.length > 0) {
                changeLocationBar('#songs/search', input.value);
            }
            else {
                changeLocationBar('#songs/genre', name);
            }
        })
    }

    function getAlbum(options) {
        let searchQuery = {};
        searchQuery.album = decodeURI(options.substring(options.indexOf('=') + 1));
        let songsToDisplay = find_by(song_data, searchQuery);
        let model = { song_List: songsToDisplay, side_List: [], side_Type: 'enjoy'  };

        let html = ejs.views_songs(model);
        document.getElementById('secChange').innerHTML = html;
        document.getElementsByTagName("title")[0].innerHTML = 'Song Table';

        //intercept clicks
        document.getElementById('secChange').querySelectorAll("a").forEach(a => {
            a.addEventListener("click", linkClick);
        })

        //intercept clicks
        document.getElementById('secChange').querySelectorAll("button:not(.download_button)").forEach(a => {
            a.addEventListener("click", buttonClick);
        })

        let name = new URLSearchParams(options).get('album');
        changeLocationBar('#songs/album', name);
        let input = document.getElementById('searchSong');
        input.addEventListener("input", (event) => {
            //console.log(input.value);
            API.search(input.value, songsToDisplay);
            if (input.value.length > 0) {
                changeLocationBar('#songs/search', input.value);
            }
            else {
                changeLocationBar('#songs/album', name);
            }
        })
    }

    function getUpload() {
        let model = {};
        let titles = group_by(song_data, "title");
        let title_List_Side = Object.keys(titles);
        let genres = group_by(song_data, "genre");
        let gen_List_Side = Object.keys(genres);
        let albums = group_by(song_data, "album");
        let alb_List_Side = Object.keys(albums);
        let artists = group_by(song_data, "artist");
        let art_List_Side = Object.keys(artists);
        model.gen = gen_List_Side;
        model.alb = alb_List_Side;
        model.art = art_List_Side;
        model.titles = title_List_Side;
        let html = ejs.views_upload(model);
        document.getElementById('secChange').innerHTML = html;
        document.getElementsByTagName("title")[0].innerHTML = 'Upload';

        //intercept clicks
        document.getElementById('secChange').querySelectorAll("a").forEach(a => {
            a.addEventListener("click", linkClick);
        })

        changeLocationBar('#upload');

        let form = document.getElementById('upsec');
        form.addEventListener('submit', (event) =>{
            event.preventDefault();
            let body = new FormData(form);
            fetch("/songs", { headers: { "Accept": "application/json" }, method: "POST", body }).then(res => {
                return res.text();
            }).then(data => {
                new_song = JSON.parse(data);
                new_song.duration = new_song.duration;
                song_data.push(new_song);
                //console.log(song_data)
                getSongs();
            })
        });
    }

    function getEdit(id) {
        let model = {};
        //let id = options.substring(options.indexOf('/') + 1, options.lastIndexOf('/'));
        let index = null;
        let f_name = null;
        let f_title;
        for (let i = 0; i < song_data.length; i++) {
            if (song_data[i]._id == id) {
                model.song_info = song_data[i];
                index = i;
                f_name = song_data[i].filename;
                model.selected = song_data[i].genre;
                f_title = song_data[i].title;
            }
        }
        let titles = group_by(song_data, "title");
        let title_List_Side = Object.keys(titles);
        let genres = group_by(song_data, "genre");
        let gen_List_Side = Object.keys(genres);
        let albums = group_by(song_data, "album");
        let alb_List_Side = Object.keys(albums);
        let artists = group_by(song_data, "artist");
        let art_List_Side = Object.keys(artists);
        model.gen = gen_List_Side;
        model.alb = alb_List_Side;
        model.art = art_List_Side;
        model.titles = title_List_Side;
        model.options = gen_List_Side;
        let html = ejs.views_edit(model);
        document.getElementById('secChange').innerHTML = html;
        document.getElementsByTagName("title")[0].innerHTML = 'Edit Song';

        // //intercept clicks
        document.getElementById('secChange').querySelectorAll("a").forEach(a => {
            a.addEventListener("click", linkClick);
        })
        document.getElementById('cancel').addEventListener("click", (event)=>{
            getSongs();
        });
        
        changeLocationBar('#edit', id);
        
        let form = document.getElementById('upsec');
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            let body = new FormData(form);
            fetch("/songs/" + id, { headers: { "Accept": "application/json" }, method: "PUT", body }).then(res => {
                return res.text();
            }).then(data => {
                mod_song = JSON.parse(data);
                song_data.splice(index, 1);
                if (mod_song.filename != f_name){
                    for (let i = song_data.length - 1; i >= 0; i--) {
                        if (song_data[i].filename == f_name) {
                            song_data.splice(i,1);
                        }
                    }
                }
                mod_song.duration = mod_song.duration;
                song_data.push(mod_song);

                //console.log(song_data);
                let dom_playlist = document.querySelector('#playlistpl');
                dom_playlist.innerHTML = `<h2 id="playlist_title">Playlist</h2>` + playlist_o.toHTML();

                let now_title = document.getElementById('titleSongpl').innerHTML;
                if (now_title == f_title) {
                    document.getElementById('titleSongpl').innerHTML = mod_song.title;
                }

                getSongs();
            })
        });
    }

    function refreshSongs(){
        return fetch('/songs', { headers: { "Accept": "application/json" } }).then(res => {
            console.log(res.status);
            return res.text();
        })
    }

    function search(options, songs){
        let songsToDisplay = [];
        for (var i = 0; i < songs.length; i++) {
            if (songs[i]['title'].toLowerCase().includes(options.toLowerCase())) {
                songsToDisplay.push(songs[i]);
            }
            else if (songs[i]['artist'].toLowerCase().includes(options.toLowerCase())) {
                songsToDisplay.push(songs[i]);
            }
            else if (songs[i]['genre'].toLowerCase().includes(options.toLowerCase())) {
                songsToDisplay.push(songs[i]);
            }
            else if (songs[i]['album'].toLowerCase().includes(options.toLowerCase())) {
                songsToDisplay.push(songs[i]);
            }
        }
        let model = { song_List: songsToDisplay};
        let html = ejs.views_song(model);
        document.getElementById('onlySongs').innerHTML = html;
        //intercept clicks
        document.querySelector('#onlysongs').querySelectorAll("button:not(.download_button)").forEach(a => {
            a.addEventListener("click", buttonClick);
        })

    }

    function getSearch(options){
        let genres = group_by(song_data, "genre");
        let gen_List_Side = Object.keys(genres);
        let model = { song_List: song_data, side_List: gen_List_Side, side_Type: 'genre' };
        let html = ejs.views_songs(model);
        document.getElementById('secChange').innerHTML = html;
        document.getElementsByTagName("title")[0].innerHTML = 'Song Table';

        //intercept clicks
        document.getElementById('secChange').querySelectorAll("a:not(.download_button)").forEach(a => {
            a.addEventListener("click", linkClick);
        })

        //intercept clicks
        // document.getElementById('secChange').querySelectorAll("button:not(.download_button)").forEach(a => {
        //     a.addEventListener("click", linkClick);
        // })
        changeLocationBar('#songs/search', options);
        API.search(options, song_data);
        let input = document.getElementById('searchSong');
        input.addEventListener("input", (event) => {
            //console.log(input.value);
            API.search(input.value, song_data);
            if (input.value.length > 0) {
                changeLocationBar('#songs/search', input.value);
            }
            else {
                changeLocationBar('#songs');
            }
        })

    }

    function deleteSong(id){
        let dom_playlist = document.querySelector(`#playlistpl`);
        fetch("/songs/" + id, { method: "DELETE", headers: { "Accept": "application/json" } }).then(res => {
            console.log(res.status);
        })
    }

    function playSong(id){
        let songSrc;
        let songTitle;
        let foundInPlaylist = false;
        let index;
        let dom_audio = document.querySelector(`#player-audiopl`);
        for (let i = 0; i < song_data.length; i++) {
            if (song_data[i]._id == id) {
                songSrc = song_data[i].src;
                songTitle = song_data[i].title;
            }
        }
        let playlist_string = localStorage.getItem('pl');
        let playlist_object = JSON.parse(playlist_string);

        for (let i = 0; i < playlist_object.songs.length; i++){
            if (playlist_object.songs[i] == songSrc){
                foundInPlaylist = true;
                index = i;
            }
        }
        if (foundInPlaylist == false){
            playlist_object.index = 0;
            playlist_object.songs.splice(0, 0, songSrc);
            index = 0;
        }
        document.querySelector(`#titleSongpl`).innerText = songTitle;
        playlist_string = JSON.stringify(playlist_object);
        localStorage.setItem('pl', playlist_string);
        playlist_o.load(playlist_string);
        playlist_o.index = index-1;
        nextSongOut(false, dom_audio);
        document.querySelector('#playlistpl').innerHTML = `<h2 id="playlist_title">Playlist</h2>` + playlist_o.toHTML();
    }

    function addToPlaylist(id){
        let songSrc;
        let foundInPlaylist = false;
        for (let i = 0; i < song_data.length; i++) {
            if (song_data[i]._id == id) {
                songSrc = song_data[i].src;
            }
        }
        let playlist_string = localStorage.getItem('pl');
        let playlist_object = JSON.parse(playlist_string);

        for (let i = 0; i < playlist_object.songs.length; i++) {
            if (playlist_object.songs[i] == songSrc) {
                foundInPlaylist = true;
            }
        }
        if (foundInPlaylist == false) {
            playlist_object.songs.push(songSrc);
        }
        playlist_string = JSON.stringify(playlist_object);
        localStorage.setItem('pl', playlist_string);
        playlist_o.load(playlist_string);
        document.querySelector('#playlistpl').innerHTML = `<h2 id="playlist_title">Playlist</h2>` + playlist_o.toHTML();
    }

    function sortSongs(type){
        let songsToDisplay = [];
        let displayedSongs = [];

        let nodes = document.querySelector('#onlysongs').childNodes
        let articles = [...nodes].filter(x => { return x.localName == 'article' });
        let ids = [];
        articles.forEach(item => ids.push(item.id));
        
        for(let k = 0; k < song_data.length; k++){
            for (let j = 0; j < ids.length; j++) {
                if (song_data[k]._id == ids[j]){
                    displayedSongs.push(song_data[k]);
                }
            }
        }

        function sortThis(array, type, n){
            let ta;
            let tb;
            array.sort((a, b) => {
                if (n == 'n'){
                    ta = a[type];
                    tb = b[type];
                }
                else{
                    ta = a[type].toLowerCase();
                    tb = b[type].toLowerCase();
                }
                if (ta < tb) {
                    return -1;
                }
                if (ta > tb) {
                    return 1;
                }
                return 0;
            });
            return array;
        }

        if (type == 'filename'){
            songsToDisplay = sortThis(displayedSongs, 'filename');
        }
        else if (type == 'title') {
            songsToDisplay = sortThis(displayedSongs, 'title');
        }
        else if (type == 'albu') {
            songsToDisplay = sortThis(displayedSongs, 'album');
        }
        else if (type == 'genr') {
            songsToDisplay = sortThis(displayedSongs, 'genre');
        }
        else if (type == 'artis') {
            songsToDisplay = sortThis(displayedSongs, 'artist');
        }
        else if (type == 'size') {
            songsToDisplay = sortThis(displayedSongs, 'size', 'n');
        }
        else if (type == 'duration') {
            songsToDisplay = sortThis(displayedSongs, 'duration', 'n');
        }

        let model = { song_List: songsToDisplay };
        let html = ejs.views_song(model);
        document.getElementById('onlySongs').innerHTML = html;

        //intercept clicks
        document.querySelector('#onlysongs').querySelectorAll("button:not(.download_button)").forEach(a => {
            a.addEventListener("click", buttonClick);
        })
    }

    return {
        getHome,
        getSongs,
        getArtist,
        getGenre,
        getAlbum,
        getUpload,
        getEdit,
        refreshSongs,
        search,
        getSearch,
        deleteSong,
        playSong,
        addToPlaylist,
        sortSongs,
        getSongsView
    }
}()

function group_by(a, k) {

    if (!(a instanceof Array) || a.length == 0) {
        return undefined;
    }

    let result = {};
    let noK = [];
    let yesK = [];
    for (let i = 0; i < a.length; i++) {
        let b = Object.keys(a[i]);
        if (b.includes(k)) {
            yesK.push(a[i]);
        }
        else {
            noK.push(a[i]);
        }
    }

    if (noK.length > 0) {
        result[undefined] = noK;
    }

    for (let j = 0; j < yesK.length; j++) {
        if (Object.keys(result).includes(a[j][k])) {
            result[a[j][k]].push(a[j]);
        }
        else {
            result[a[j][k]] = [a[j]];
        }
    }

    return result;
}

function find_by(a, f) {
    if (!(a instanceof Array) || a.length == 0) {
        return undefined;
    }

    if (Object.keys(f).length == 0) {
        return a;
    }

    let result = [];

    function checkProp(propNames, o) {
        let match = [];
        for (let j = 0; j < propNames.length; j++) {
            for (let k = 0; k < propNamesf.length; k++) {
                if (propNames[j] == propNamesf[k] && o[propNames[j]] == f[propNamesf[k]]) {
                    match.push(1);
                }
            }
        }
        return match.length;
    }

    let propNamesf = Object.getOwnPropertyNames(f).filter(item => f[item] != undefined);
    propNamesf = Object.getOwnPropertyNames(f).filter(item => f[item] != null);
    if (propNamesf.length == 0) {
        return a;
    }

    for (let i = 0; i < a.length; i++) {
        const propNames = Object.getOwnPropertyNames(a[i]);

        let matchL = checkProp(propNames, a[i]);
        if (matchL == propNamesf.length) {
            result.push(a[i]);
        }

    }

    return result;
}

function group_by(a, k) {

    if (!(a instanceof Array) || a.length == 0) {
        return undefined;
    }

    let result = {};
    let noK = [];
    let yesK = [];
    for (let i = 0; i < a.length; i++) {
        let b = Object.keys(a[i]);
        if (b.includes(k)) {
            yesK.push(a[i]);
        }
        else {
            noK.push(a[i]);
        }
    }

    if (noK.length > 0) {
        result[undefined] = noK;
    }

    for (let j = 0; j < yesK.length; j++) {
        if (Object.keys(result).includes(a[j][k])) {
            result[a[j][k]].push(a[j]);
        }
        else {
            result[a[j][k]] = [a[j]];
        }
    }

    return result;
}

function format_seconds(s) {
    if (typeof s != 'number' || Number.isNaN(s)) {
        return '?:??';
    }

    if (s == 0 || s == 00 || s < 1 && s > 0 || s > -1 && s < 0) {
        return '0:00';
    }

    if (s > 0) {
        var minutes = Math.trunc(s / 60);
        var seconds = Math.trunc(s % 60);
        if (seconds <= 9) {
            seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
    }

    if (s < 0) {
        var minutes = Math.abs(Math.trunc(s / 60));
        var seconds = Math.abs(Math.trunc(s % 60));
        if (seconds <= 9) {
            seconds = '0' + seconds;
        }
        return '-' + minutes + ':' + seconds;
    }
}

function Playlist(a, repeat = false) {

    //public fields
    this.index = 0;
    this.songs = a;
    this.repeat = repeat;

    //methods
    this.toJSON = function () {
        let o = { index: this.index, songs: this.songs, repeat: this.repeat };
        let json = JSON.stringify(o);
        return json;
    };

    this.load = function (json) {
        try {
            let o = JSON.parse(json);
            if (typeof o == "object" && Array.isArray(o.songs) && typeof repeat == 'boolean') {
                this.index = o.index;
                this.songs = o.songs;
                this.repeat = o.repeat;
                return this; s
            }
        }
        catch (e) {
            return this;
        }
        return this;
    };

    this.next = function () {
        if (this.repeat) {
            if (this.index < this.songs.length - 1) {
                this.index++;
                return this.songs[this.index];
            }
            else {
                this.index = 0;
                return this.songs[this.index];
            }
        }
        else {
            if (this.index < this.songs.length - 1) {
                this.index++;
                return this.songs[this.index];
            }
            else if (this.index >= this.songs.length - 1) {
                this.index = this.songs.length;
                return undefined;
            }
            else if (this.index == -1) {
                this.index++;
                return this.songs[this.index];
            }
        }
    };

    this.prev = function () {
        if (this.repeat) {
            if (this.index > 0) {
                this.index--;
                return this.songs[this.index];
            }
            else {
                this.index = this.songs.length - 1;
                return this.songs[this.index];
            }
        }
        else {
            if (this.index > 0) {
                this.index--;
                return this.songs[this.index];
            }
            else if (this.index <= 0) {
                this.index = -1;
                return undefined;
            }
            else if (this.index == this.songs.length - 1) {
                this.index--;
                return this.songs[this.index];
            }
        }
    };

    this.appendSong = function (s) {
        this.songs.push(s);
    };

    this.toHTML = function () {
        let playlist_HTML = ` `;
        for (let i = 0; i < this.songs.length; i++) {  
            let title = song_data.filter(x => { return x.src == this.songs[i]; })[0].title;
            playlist_HTML = playlist_HTML + `<article class="home playlist_song">${title}</article>`
        }
        return playlist_HTML;
    };


}

let playlist_o;
function init_player_with_playlist(dom, key, a) {

    playlist_o = new Playlist(a);
    let playlist_s = playlist_o.toJSON();

    if (localStorage.getItem(key) == null) {
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

    function generateHTML(key) {
        return `<hr class="home">
                <section class="player" id='playerF'>
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
                                <button type="button" id="shuffle${key}"></button>
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

    function generateStyle(key) {
        return ` #player_body>h1 {
        margin-bottom: 30px}
        .playlist_song{
        border: 1px solid rgb(92, 70, 70);
        font-size: max(0.8vw, 0.8em);
        width: 95%;}
        #player${key} button#prev${key} {background-image: url("images/prev.svg")}
        #player${key} button#play${key} {background-image: url("images/play.svg")}
        #player${key} button#pause${key} {background-image: url("images/pause.svg")}
        #player${key} button#next${key} {background-image: url("images/next.svg")}
        #player${key} button#loud${key} {background-image: url("images/loud.svg")}
        #player${key} button#mute${key} {background-image: url("images/mute.svg")}
        #player${key} button#low${key} {background-image: url("images/low.svg")} 
        #player${key} button#repeat${key} {background-image: url("images/repeat.svg")}
        #player${key} button#remove${key} {background-image: url("images/highlight_off.svg")}
        #player${key} button#removeAll${key} {background-image: url("images/playlist_remove.svg")}
        #player${key} button#shuffle${key} {background-image: url("images/shuffle.svg")}
        #player${key} #remove${key}{grid-column: 3; grid-row: 1; margin-right: 1em}
        #player${key} #removeAll${key}{grid-column: 3; grid-row: 5; margin-right: 1em}
        #player${key} #shuffle${key}{grid-column: 1; grid-row: 1; margin-left: 1em}
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
        #player${key} header p.title {font-size: 1.5em}
        #player${key} section {display: flex; flex-direction: row; align-items: center}
        #player${key} section.seek {margin-top: 0.2em; justify-content: center}
        #player${key} section.seek p {margin: 0.2em}
        #player${key} section.seek p.elapsed {color: black}
        #player${key} section.seek p.remain {color: gray}
        #player${key} section.seek progress {width: 45vw; height: 32px}
        #player${key} section.play.buttons {justify-content: center}
        #player${key} button {border-radius: 50%; border-width: 10px}
        #player${key} button:hover {background-color: rgb(0, 132, 255)}
        #player${key} button {background-size: contain; background-position: center center; background-repeat: no-repeat}
        #player${key} button.smallest {grid-column: 3; grid-row: 3; margin-right: 1em}
        #player${key} button.smallestrepeat {border-color: red; grid-column: 3; grid-row: 3; margin-right: 1em}
        #player${key} button.small {width: 50px; height: 50px}
        #player${key} button {width: 60px; height: 60px}
        #player${key} aside.volume button {width: 40px; height: 40px; background-size: 50%}
        #player${key} aside.volume {display: grid; grid-template-columns: 100px 100px 100px; grid-template-rows: 2fr 1fr 2fr 1fr 2fr; align-content: space-around; align-items: center; justify-items: center; justify-content: start}
        #player${key} .volume button {border-width: 5px; width: 50px; height: 50px; display: flex; justify-items: center; align-items: center}
        #player${key} .volume input[type=range] {grid-row: 3; grid-column: 2; transform: rotate(-90deg) translate(-50px, 30px); transform-origin: 0 0; width: 80px}
        .current_playing${key} {background-color: rgba(126, 125, 43, 0.349)}
        .playlist_song:hover {background-color: rgba(43, 126, 98, 0.349); transition: all 0.25s}
        #playerF {display: flex; flex-direction: row; flex-grow: 0}
        #playlist_title {font-size: 1em}
        `
    }

    let styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = generateStyle(key);
    document.head.appendChild(styleSheet);

    //dom.innerHTML = dom.innerHTML + generateHTML(key);
    dom.insertAdjacentHTML('beforeend', generateHTML(key));

    function repeat_button(key) {
        if (playlist_o.repeat) {
            playlist_o.repeat = false;
            document.querySelector(`#repeat${key}`).classList.remove('smallestrepeat');
            document.querySelector(`#repeat${key}`).classList.add('smallest')
        }
        else {
            playlist_o.repeat = true;
            document.querySelector(`#repeat${key}`).classList.remove('smallest');
            document.querySelector(`#repeat${key}`).classList.add('smallestrepeat')
        }
    }

    function currentPlaying(key) {
        let now = document.querySelector(`#titleSong${key}`).innerText;
        document.querySelectorAll(`#player${key} .playlist_song`).forEach(song => song.classList.add(`playlist_songs${key}`));
        let playlist_songs = document.querySelectorAll(`.playlist_songs${key}`);
        for (let j = 0; j < playlist_songs.length; j++) {
            if (playlist_songs[j].innerText == now) {
                playlist_songs[j].classList.add(`current_playing${key}`);
            }
            else {
                playlist_songs[j].classList.remove(`current_playing${key}`);
            }
        }
    }

    //Init Playlist
    let playlistID = `#playlist${key}`;
    let dom_playlist = document.querySelector(playlistID);
    dom_playlist.innerHTML = dom_playlist.innerHTML + playlist_o.toHTML();
    document.querySelector(`#repeat${key}`).addEventListener('click', () => repeat_button(key));
    window.addEventListener('storage', (e) => {
        //console.log(e);
        old_playlist = localStorage.getItem(key);
        let old_index = playlist_o.index;
        playlist_o.load(old_playlist);
        playlist_o.index = old_index;
        dom_playlist.innerHTML = `<h2 id="playlist_title">Playlist</h2>` + playlist_o.toHTML();
        if (playlist_o.songs.length > 0) {
            document.querySelector(`#titleSong${key}`).innerText = song_data.filter(x => { return x.src == playlist_o.songs[playlist_o.index]; })[0].title;
        }
        else {
            document.querySelector(`#titleSong${key}`).innerText = 'No songs in the playlist';
        }
    });


    //Init player
    let dom_audio = document.querySelector(`#player-audio${key}`);
    let firstSong = playlist_o.songs[0];
    dom_audio.src = firstSong;
    dom_audio.load();
    dom_audio.addEventListener('canplay', () => console.log("You can start listening"));

    if (playlist_o.songs.length > 0) {
        let songName = song_data.filter(x => { return x.src == playlist_o.songs[0]; })[0].title;
        document.querySelector(`#titleSong${key}`).innerText = songName;
    }
    else {
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
        document.querySelector(`#remain${key}`).innerHTML = format_seconds(Math.ceil(song_data.filter(x => { return x.src == playlist_o.songs[playlist_o.index]; })[0].duration) - dom_audio.currentTime);
        continuePlay();
        document.querySelector(`#file${key}`).setAttribute('value', dom_audio.currentTime);
        document.querySelector(`#file${key}`).setAttribute('max', song_data.filter(x => { return x.src == playlist_o.songs[playlist_o.index]; })[0].duration);
        currentPlaying(key);
    }, 100);

    document.querySelector(`#play${key}`).addEventListener("click", () => { dom_audio.play(); console.log('Play') });
    document.querySelector(`#pause${key}`).addEventListener("click", () => dom_audio.pause());

    function nextSong(paused) {
        if (playlist_o.repeat) {
            dom_audio.src = playlist_o.next();
            document.querySelector(`#titleSong${key}`).innerText = song_data.filter(x => { return x.src == playlist_o.songs[playlist_o.index]; })[0].title;
        }
        else {
            if (playlist_o.index >= playlist_o.songs.length - 1) {
                console.log('End of the playlist reached!')
            }
            else {
                dom_audio.src = playlist_o.next();
                document.querySelector(`#titleSong${key}`).innerText = song_data.filter(x => { return x.src == playlist_o.songs[playlist_o.index]; })[0].title;
            }
        }

        if (!paused) {
            dom_audio.play();
        }

    }

    function prevSong(paused) {
        if (playlist_o.repeat) {
            dom_audio.src = playlist_o.prev();
            document.querySelector(`#titleSong${key}`).innerText = song_data.filter(x => { return x.src == playlist_o.songs[playlist_o.index]; })[0].title;
        }
        else {
            if (playlist_o.index == 0) {
                console.log('Cannot go back!')
            }
            else {
                dom_audio.src = playlist_o.prev();
                document.querySelector(`#titleSong${key}`).innerText = song_data.filter(x => { return x.src == playlist_o.songs[playlist_o.index]; })[0].title;
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
        for (let j = 0; j < song_data.length; j++) {
            if (song_data[j].title == thisSongTitle) {
                let song_index = playlist_object.songs.indexOf(song_data[j].src);
                playlist_object.songs.splice(song_index, 1);
            }
        }

        //Save data
        playlist_string = JSON.stringify(playlist_object);
        localStorage.setItem(key, playlist_string);

        let old_index = playlist_o.index;
        playlist_o.load(playlist_string);
        playlist_o.index = old_index;
        dom_playlist.innerHTML = `<h2 id="playlist_title">Playlist</h2>` + playlist_o.toHTML();
        if (playlist_o.songs.length > 0) {
            document.querySelector(`#titleSong${key}`).innerText = song_data.filter(x => { return x.src == playlist_o.songs[playlist_o.index]; })[0].title;
        }
        else {
            document.querySelector(`#titleSong${key}`).innerText = 'No songs in the playlist';
        }
    }


    let remove_button = document.querySelector(`#remove${key}`);
    remove_button.addEventListener("click", (event) => removeSong(event.target));


    function removeAllSong() {
        //Load Data
        let playlist_string = localStorage.getItem(key);
        let playlist_object = JSON.parse(playlist_string);

        playlist_object.songs = [];
        playlist_object.index = 0;

        //Save data
        playlist_string = JSON.stringify(playlist_object);
        localStorage.setItem(key, playlist_string);

        playlist_o.load(playlist_string);
        dom_playlist.innerHTML = `<h2 id="playlist_title">Playlist</h2>` + playlist_o.toHTML();
        document.querySelector(`#titleSong${key}`).innerText = 'No songs in the playlist';
    }

    let removeAll_button = document.querySelector(`#removeAll${key}`);
    removeAll_button.addEventListener("click", (event) => removeAllSong(event.target));

    let shuffle_button = document.querySelector(`#shuffle${key}`);
    shuffle_button.addEventListener("click", (event) => shufflePlaylist(event.target));

    function shufflePlaylist(button) {
        //Load Data
        let playlist_string = localStorage.getItem(key);
        let playlist_object = JSON.parse(playlist_string);
        let currentSongTitle = document.querySelector('#titleSongpl').innerText;
        for (let i = playlist_object.songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = playlist_object.songs[i];
            playlist_object.songs[i] = playlist_object.songs[j];
            playlist_object.songs[j] = temp;
        }

        //Save data
        playlist_string = JSON.stringify(playlist_object);
        localStorage.setItem(key, playlist_string);

        playlist_o.load(playlist_string);
        dom_playlist.innerHTML = `<h2 id="playlist_title">Playlist</h2>` + playlist_o.toHTML();
        document.querySelector(`#titleSong${key}`).innerText = currentSongTitle;
    }



}

function nextSongOut(paused, dom_audio) {
    if (playlist_o.repeat) {
        dom_audio.src = playlist_o.next();
    }
    else {
        if (playlist_o.index >= playlist_o.songs.length - 1) {
            console.log('End of the playlist reached!')
        }
        else {
            dom_audio.src = playlist_o.next();
        }
    }

    if (!paused) {
        dom_audio.play();
    }

}

function removeSongOut(dom_playlist, id) {
    //Load Data
    let playlist_string = localStorage.getItem('pl');
    let playlist_object = JSON.parse(playlist_string);

    for (let i = 0; i < song_data.length; i++) {
        if (song_data[i]._id == id) {
            console.log(song_data[i]);
            let song_index = playlist_object.songs.indexOf(song_data[i].src);
            playlist_object.songs.splice(song_index, 1);
        }
    }


    //Save data
    playlist_string = JSON.stringify(playlist_object);
    localStorage.setItem('pl', playlist_string);

    let old_index = playlist_o.index;
    playlist_o.load(playlist_string);
    playlist_o.index = old_index -1;
    dom_playlist.innerHTML = `<h2 id="playlist_title">Playlist</h2>` + playlist_o.toHTML();
    let dom_audio = document.querySelector(`#player-audiopl`);
    nextSongOut(dom_audio.paused, dom_audio);
    if (playlist_o.songs.length > 0) {
        document.querySelector(`#titleSongpl`).innerText = song_data.filter(x => { return x.src == playlist_o.songs[playlist_o.index]; })[0].title;
    }
    else {
        document.querySelector(`#titleSongpl`).innerText = 'No songs in the playlist';
    }
}