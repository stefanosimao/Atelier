/**
 * Web Atelier 2021  Exercise 4 - JavaScript on the Server-side
 *
 * Student: Stefano Gonçalves Simao
 *
 * Task 2 - Static Site Generator
 *
 */

const fs = require("fs-extra");
const  jsmediatags = require("jsmediatags");

var myArgs = process.argv.slice(2);
let inputPath = './data.json';
let outputPath = './public';

let basePath = '/Users/stefanosimao/ex4-node--stefanosimao/';

if (myArgs.length == 2){
    inputPath = myArgs[0];
    outputPath = myArgs[1];
}

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

function generateIndex(data, a_List, gen_List, outputPath) {
    const content = `<html>
    <head>
        <title> Homepage </title>
        <meta name="author" content="Stefano Gonçalves Simao">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="style.css" rel="stylesheet"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Quicksand">
    </head>
    <body class="home">
        <header class="home" id="bigtitle"> Stefano's Music </header>
        <hr class="home">
        <section class="home">

            <nav class="home">  <img src = "images/place.svg" alt="Place" class="home" id="place"/>
                <a href="index.html" target="_blank" class="home link" id="current">Homepage</a>
                <a href="songs.html" target="_blank" class="home link">Song catalog</a>
                <a href="player.html" target="_blank" class="home link">Player Page</a>
                <a href="upload.html" target="_blank" class="home link">Song Upload Form</a>                                
            </nav>

            <main class="home">
                <p class="home" id="statstitle"> Stats </p>
                <article class="home" id="stats"> 
                    <figure>
                         <img src="images/songs.svg" alt="Songs" style="width:75%" class="home statsicon">
                         <figcaption class="home figcap" id="song_number">${data[0]} Songs</figcaption>
                    </figure>
                    <figure>
                         <img src="images/albums.svg" alt="Albums" style="width:75%" class="home statsicon">
                         <figcaption class="home figcap" id="album_number">${data[1]} Albums</figcaption>
                    </figure> 
                    <figure>
                         <img src="images/playlist.svg" alt="Playlist" style="width:75%" class="home statsicon">
                         <figcaption class="home figcap" id="artist_number">${data[3]} Artists</figcaption>
                    </figure>   
                    <figure>
                         <img src="images/genres.svg" alt="Genres" style="width:85%" class="home statsicon">
                         <figcaption class="home figcap" id="genre_number">${data[2]} Genres</figcaption>
                    </figure>                    
                </article>
                <p class="home" id="fasttitle"> Jump right into it </p>
                <article class="home" id="lists">
                    <article class="home" id="artists_list"> 
                        <p class="home" id="arttitle"> List of artists </p>
                        ${a_List}
                    </article>
                    <article class="home" id="genres_list"> 
                        <p class="home" id="gentitle"> List of genres </p>
                        ${gen_List}
                    </article>
                </article>
            </main>

            <aside class="home" id="favs">
            </aside>
        </section>
        <form action="/refresh" method="POST"><input type="submit" value="REFRESH"></form>
        <hr class="home">
        <footer class="home"> 
            <span class="home footer">@StefanoGonçalvesSimao </span> 
            <span class="home footer">Fri 01 Oct 2021</span> 
            <span class="home footer"><a href="https://en.wikipedia.org/wiki/Disclaimer" target="_blank" class="home">Legal Disclaimer</a></span>  
        </footer>
    </body>
    </html>`;
    fs.writeFile(`${outputPath}/index.html`, content, err => {
        if (err) {
            console.error(err);
            return;
        }
    })
}

function generateCSS(outputPath) {
    const content = `#player {
    text-align: center;
}

#player {
    display: grid;
    grid-template-columns: 8fr 2fr;
}

#player>header {
    grid-column: 1;
}

#player>section {
    grid-column: 1;
}

#player>aside {
    grid-column: 2;
    grid-row: 1/4;
}



#player header {
    display: flex;
    flex-direction: row;
    align-items: baseline;
}

#player header p {
    flex: 1;
}

#player header p.title {
    font-size: 2em;
}

#player section {
    display: flex;
    flex-direction: row;
    align-items: center;
}


#player section.seek {
    margin-top: 1em;
    justify-content: center;
}

#player section.seek p {
    margin: 1em;
}

#player section.seek p.elapsed {
    color: black;
}

#player section.seek p.remain {
    color: gray;
}

#player section.seek progress {
    width: 45vw;
    height: 32px;
}



#player section.play.buttons {
    justify-content: center;
}

#player button {
    border-radius: 50%;
    border-width: 10px;
}

#player button:hover {
    background-color: rgb(0, 132, 255);
}

#player button {
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
}

#player button#prev {
    background-image: url("images/prev.svg");
    display: none;
}

#player button#play {
    background-image: url("images/play.svg");
}

#player button#pause {
    background-image: url("images/pause.svg");
}

#player button#next {
    background-image: url("images/next.svg");
    display: none;
}

#player button#loud {
    background-image: url("images/loud.svg");
}

#player button#mute {
    background-image: url("images/mute.svg");
}

#player button#low {
    background-image: url("images/low.svg");
}


#player button.small {
    width: 75px;
    height: 75px;
}

#player button {
    width: 125px;
    height: 125px;
}

#player aside.volume button {
    width: 50px;
    height: 50px;
    background-size: 50%;
}


#player aside.volume {
    display: grid;
    grid-template-columns: 100px 100px;
    grid-template-rows: 2fr 1fr 5fr 1fr 2fr;
    align-content: space-around;
    align-items: center;
    justify-items: center;
    justify-content: start;
}

#player .volume button {
    border-width: 5px;
    width: 50px;
    height: 50px;
    display: flex;
    justify-items: center;
    align-items: center;
}

#player .volume button#mute {
    margin-left: 1em;
    grid-row: 3;
    grid-column: 1;
}

#player .volume button#loud {
    grid-row: 1;
    grid-column: 2;
}

#player .volume button#low {
    grid-row: 5;
    grid-column: 2;
}

#player .volume input[type=range] {
    grid-row: 3;
    grid-column: 2;
    transform: rotate(-90deg) translate(-85px, 65px);
    transform-origin: 0 0;
    width: 150px;
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

    #bigtitle {
        font-size: 5em;
        color: rgb(36, 96, 148);
    }

    footer {
        margin-top: auto;
        font-size: max(0.8vw, 1em);
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

    nav {
        border-right: 3px solid rgb(0, 0, 0);
        flex: 2;
        font-size: max(1.2vw, 1.2em);
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .link {
        border: 1px solid rgb(92, 70, 70)
    }

    .link:hover {
        background-color: rgba(43, 126, 98, 0.349);
        transition: all 0.25s;
    }

    aside {
        border-left: 3px solid rgb(0, 0, 0);
        flex: 2;
        font-size: max(1.2vw, 1.2em);
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    body>hr {
        background-color: black;
        border: none;
        height: 0.5px;
        border-radius: 85px;
    }

    #current {
        background-color: rgba(43, 126, 98, 0.349);
    }

    footer .footer {
        margin: 5px;
    }

    #playtitle,
    #fasttitle {
        font-size: max(2vw, 1.3em);
        border-top: 1px solid rgb(0, 0, 0);
    }

    #statstitle {
        font-size: max(2vw, 1.3em);
    }

    .favssong {
        font-size: max(0.8vw, 0.8em);
    }    

    #place {
        display: inline-block;
        height: 2vw;
    }

    #favs {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;
    }

    #stats {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .home.statsicon {
        padding: 2px;
        margin: auto;
    }

    .home.figcap,
    .home.fastlink {
        font-style: italic;
        padding: 2px;
        text-align: center;
        font-size: max(1.3vw, 1.0em);
    }

    .song_table {
        font-size: max(0.8vh, 1em);
        margin: 1px;
        padding: 1px;
    }

    .song {
        display: grid;
        word-breaK: break-word;
        grid-template-columns: 29% 8% 7% 6% 15% 10% 10% 8% 8%;
        align-items: center;
        border: 1px solid grey;
        background-color: rgba(196, 179, 179, 0.288);
        margin: 2px;
        margin-top: 3px;
        font-size: max(1.2vh, 0.8 vw);
    }

    .song>* {
        padding: 2px;
    }

    .song_table>header {
        display: grid;
        word-breaK: break-word;
        grid-template-columns: 28% 9% 7% 6% 15% 10% 10% 8%;
        align-items: center;
        border: 1px solid grey;
        background-color: rgba(221, 210, 48, 0.288);
        margin: 2px;
    }

    .song span progress {
        width: -webkit-fill-available;
    }

    .song>a>button,
    .song>a[rel="edit"],
    .song>a[rel="download"] {
        opacity: 0;
    }

    .song:hover>a>button,
    .song:hover>a[rel="edit"],
    .song:hover>a[rel="download"] {
        opacity: 100;
        cursor: pointer;
        width: 80%;
    }

    .playing {
        border: 1px solid rgb(10, 10, 10);
        background-color: rgba(177, 18, 18, 0.582);
    }

    #uptitle {
        font-size: 4vh;
        color: rgb(16, 32, 46);
        margin-bottom: 1em;
    }

    #upsec {
        display: grid;
        grid-template-columns: 3fr 5fr;
    }

    #label {
        margin-right: 2vw;
        margin-left: 2vw;
        font-size: 2vh;
    }

    #input,
    #dropdown,
    .upload#description,
    #qualityrange,
    #submit {
        margin-right: 2vw;
        font-size: 2vh;
    }

    #star {
        cursor: pointer;
        visibility: hidden;
    }

    #star::before {
        content: "\\2606";
        visibility: visible;
        font-size: 2.1vh;
        align-self: center;
    }

    #star:checked:before {
        content: "\\2605";
        visibility: visible;
        font-size: 2.1vh;
        align-self: center;
    }

    #dropdown:hover,
    .upload#description:hover,
    #qualityrange:hover {
        background-color: rgba(43, 126, 98, 0.349);
        transition: all 0.25s;
    }

    #labelS {
        margin-right: 2vw;
        margin-left: 2vw;
        font-size: 2vh;
    }

    #lists{
        display: grid;
        grid-template-columns: 2fr 2fr;
    }

    #artists_list,
    #genres_list {
        display: flex;
        flex-direction: column;
    }
    audio {
        width: 100%
    }

    #arttitle,
    #gentitle {
        font-size: max(1.2vw, 1.1em);
        border-bottom: 1px solid
    }`;

    fs.writeFile(`${outputPath}/style.css`, content, err => {
        if (err) {
            console.error(err);
            return;
        }
    });
}

function generateSongs(songs_List, gen_List_Side, outputPath){
    const content = `<html>
    <head>
        <title> Song Catalog </title>
        <meta name="author" content="Stefano Gonçalves Simao">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="style.css" rel="stylesheet"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Quicksand">
    </head>
    <body class="songs">
    <!-- Include here your songs table HTML, leaving placeholders
         so that the content can be dynamically generated -->
        <header class="songs" id="bigtitle"> Stefano's Music </header>
        <hr class="songs">
        <section class="songs">

            <nav class="songs">  <img src = "images/place.svg" alt="Place" class="songs" id="place"/>
                <a href="index.html" target="_blank" class="songs link" >Homepage</a>
                <a href="songs.html" target="_blank" class="songs link" id="current">Song catalog</a>
                <a href="player.html" target="_blank" class="songs link">Player Page</a>
                <a href="upload.html" target="_blank" class="songs link">Song Upload Form</a>                                
            </nav>

            <main class="song_table">
            
                <header>
                    <span></span>
                    <a href="songs.html?sort=filename">Filename</a>
                    <a href="songs.html?sort=duration">Duration (MM:SS)</a>
                    <a href="songs.html?sort=size">Size (MB)</a>
                    <a href="songs.html?sort=title">Title</a>
                    <a href="songs.html?sort=album">Album</a>
                    <a href="songs.html?sort=artist">Artist</a>
                    <a href="songs.html?sort=genre">Genre</a>
                </header>
                ${songs_List}
            </main>

            <aside class="songs" id='sidebar';> 
                ${gen_List_Side} 

            </aside>
        </section>
        <form action="/refresh" method="POST"><input type="submit" value="REFRESH and go back to Home"></form>
        <hr class="songs">
        <footer class="songs"> 
            <span class="songs footer">@StefanoGonçalvesSimao </span> 
            <span class="songs footer">Fri 01 Oct 2021</span> 
            <span class="songs footer"><a href="https://en.wikipedia.org/wiki/Disclaimer" target="_blank" class="songs">Legal Disclaimer</a></span>  
        </footer>
        </body>
    </html>`;
    fs.writeFile(`${outputPath}/songs.html`, content, err => {
        if (err) {
            console.error(err);
            return;
        }
    })
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

function songToHTML(data){
    let duration = format_seconds(Math.ceil(data.duration));
    return `<article class="song">
                <audio controls src=${basePath}${data["src"]}></audio>
                <span class="filename">${data["filename"]}</span>
                <span class="duration">${duration}</span>
                <span class="size">${data["size"]}</span>
                <span class="title">${data["title"]}</span>
                <span class="album">${data["album"]}</span>
                <span class="artist">${data["artist"]}</span>
                <span class="genre">${data["genre"]}</span>
                <a href=${basePath}${data["src"]} download=${data["filename"]}>
                <button type="button" class="download_button" >Download</button></a>
            </article>`;
}

function artListToHTML(data){
    let dataLower = data.toLowerCase();
    return `<a href="songs-artist-${dataLower}.html" target="_blank" class="home fastlink" >${data}</a>`
}

function genListToHTML(data){
    let dataLower = data.toLowerCase();
    return `<a href="songs-genre-${dataLower}.html" target="_blank" class="home fastlink" >${data}</a>`
}

function sidebarToHTMLGen(data){
    let dataLower = data.toLowerCase();
    return `<a href="songs-genre-${dataLower}.html" class="link">${data}</a>`;
}

function sidebarToHTMLArt(data){
    let dataLower = data.toLowerCase();
    return `<a href="./songs-artist-${dataLower}.html" class="link">${data}</a>`;
}

function generateSongsGenre(genre, songs_List, art_List_Side, outputPath ){
    const content = `<html>
    <head>
        <title> Song Catalog </title>
        <meta name="author" content="Stefano Gonçalves Simao">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="style.css" rel="stylesheet"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Quicksand">
    </head>
    <body class="songs">
    <!-- Include here your songs table HTML, leaving placeholders
         so that the content can be dynamically generated -->
        <header class="songs" id="bigtitle"> Stefano's Music </header>
        <hr class="songs">
        <section class="songs">

            <nav class="songs">  <img src = "images/place.svg" alt="Place" class="songs" id="place"/>
                <a href="index.html" target="_blank" class="songs link" >Homepage</a>
                <a href="songs.html" target="_blank" class="songs link" id="current">Song catalog</a>
                <a href="player.html" target="_blank" class="songs link">Player Page</a>
                <a href="upload.html" target="_blank" class="songs link">Song Upload Form</a>                                
            </nav>

            <main class="song_table">
            
                <header>
                    <span></span>
                    <a href="songs.html?sort=filename">Filename</a>
                    <a href="songs.html?sort=duration">Duration (MM:SS)</a>
                    <a href="songs.html?sort=size">Size (MB)</a>
                    <a href="songs.html?sort=title">Title</a>
                    <a href="songs.html?sort=album">Album</a>
                    <a href="songs.html?sort=artist">Artist</a>
                    <a href="songs.html?sort=genre">Genre</a>
                </header>
                ${songs_List}
            </main>

            <aside class="songs" id='sidebar';> 
                ${art_List_Side} 

            </aside>
        </section>
        <form action="/refresh" method="POST"><input type="submit" value="REFRESH and go back to Home"></form>
        <hr class="songs">
        <footer class="songs"> 
            <span class="songs footer">@StefanoGonçalvesSimao </span> 
            <span class="songs footer">Fri 01 Oct 2021</span> 
            <span class="songs footer"><a href="https://en.wikipedia.org/wiki/Disclaimer" target="_blank" class="songs">Legal Disclaimer</a></span>  
        </footer>
        </body>
    </html>`;
    fs.writeFile(`${outputPath}/songs-genre-${genre}.html`, content, err => {
        if (err) {
            console.error(err);
            return;
        }
    })
}

function generateSongsArtist(artist, songs_List, alb_List_Side, outputPath ){
    const content = `<html>
    <head>
        <title> Song Catalog </title>
        <meta name="author" content="Stefano Gonçalves Simao">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="style.css" rel="stylesheet"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Quicksand">
    </head>
    <body class="songs">
    <!-- Include here your songs table HTML, leaving placeholders
         so that the content can be dynamically generated -->
        <header class="songs" id="bigtitle"> Stefano's Music </header>
        <hr class="songs">
        <section class="songs">

            <nav class="songs">  <img src = "images/place.svg" alt="Place" class="songs" id="place"/>
                <a href="index.html" target="_blank" class="songs link" >Homepage</a>
                <a href="songs.html" target="_blank" class="songs link" id="current">Song catalog</a>
                <a href="player.html" target="_blank" class="songs link">Player Page</a>
                <a href="upload.html" target="_blank" class="songs link">Song Upload Form</a>                                
            </nav>

            <main class="song_table">
            
                <header>
                    <span></span>
                    <a href="songs.html?sort=filename">Filename</a>
                    <a href="songs.html?sort=duration">Duration (MM:SS)</a>
                    <a href="songs.html?sort=size">Size (MB)</a>
                    <a href="songs.html?sort=title">Title</a>
                    <a href="songs.html?sort=album">Album</a>
                    <a href="songs.html?sort=artist">Artist</a>
                    <a href="songs.html?sort=genre">Genre</a>
                </header>
                ${songs_List}
            </main>

            <aside class="songs" id='sidebar';> 
                ${alb_List_Side} 

            </aside>
        </section>
        <form action="/refresh" method="POST"><input type="submit" value="REFRESH and go back to Home"></form>
        <hr class="songs">
        <footer class="songs"> 
            <span class="songs footer">@StefanoGonçalvesSimao </span> 
            <span class="songs footer">Fri 01 Oct 2021</span> 
            <span class="songs footer"><a href="https://en.wikipedia.org/wiki/Disclaimer" target="_blank" class="songs">Legal Disclaimer</a></span>  
        </footer>
        </body>
    </html>`;
    fs.writeFile(`${outputPath}/songs-artist-${artist}.html`, content, err => {
        if (err) {
            console.error(err);
            return;
        }
    })
}

function sidebarToHTMLAlb(data){
    let dataLower = data.toLowerCase();
    return `<a href="./songs-album-${dataLower}.html" class="link">${data}</a>`;
}

function generateSongsAlbum(album, songs_List, outputPath){
    const content = `<html>
    <head>
        <title> Song Catalog </title>
        <meta name="author" content="Stefano Gonçalves Simao">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="style.css" rel="stylesheet"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Quicksand">
    </head>
    <body class="songs">
    <!-- Include here your songs table HTML, leaving placeholders
         so that the content can be dynamically generated -->
        <header class="songs" id="bigtitle"> Stefano's Music </header>
        <hr class="songs">
        <section class="songs">

            <nav class="songs">  <img src = "images/place.svg" alt="Place" class="songs" id="place"/>
                <a href="index.html" target="_blank" class="songs link" >Homepage</a>
                <a href="songs.html" target="_blank" class="songs link" id="current">Song catalog</a>
                <a href="player.html" target="_blank" class="songs link">Player Page</a>
                <a href="upload.html" target="_blank" class="songs link">Song Upload Form</a>                                
            </nav>

            <main class="song_table">
            
                <header>
                    <span></span>
                    <a href="songs.html?sort=filename">Filename</a>
                    <a href="songs.html?sort=duration">Duration (MM:SS)</a>
                    <a href="songs.html?sort=size">Size (MB)</a>
                    <a href="songs.html?sort=title">Title</a>
                    <a href="songs.html?sort=album">Album</a>
                    <a href="songs.html?sort=artist">Artist</a>
                    <a href="songs.html?sort=genre">Genre</a>
                </header>
                ${songs_List}
            </main>

            <aside class="songs" id='sidebar';> 
                <h5> Enjoy your music! </h5>

            </aside>
        </section>
        <form action="/refresh" method="POST"><input type="submit" value="REFRESH and go back to Home"></form>
        <hr class="songs">
        <footer class="songs"> 
            <span class="songs footer">@StefanoGonçalvesSimao </span> 
            <span class="songs footer">Fri 01 Oct 2021</span> 
            <span class="songs footer"><a href="https://en.wikipedia.org/wiki/Disclaimer" target="_blank" class="songs">Legal Disclaimer</a></span>  
        </footer>
        </body>
    </html>`;
    fs.writeFile(`${outputPath}/songs-album-${album}.html`, content, err => {
        if (err) {
            console.error(err);
            return;
        }
    })
}

function staticGeneration(inputPath, outputPath){
    if (!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath);
    }

    fs.copy('/Users/stefanosimao/ex4-node--stefanosimao/images', `${outputPath}/images`, function (err) {
        if (err){
            console.log('An error occured while copying the folder')
        }
    });
    fs.readFile(inputPath, function (err, songsJSON){
        if (err){
            console.log("Error when reading the folder");
            return;
        }

        let song_data = JSON.parse(songsJSON);
        generateCSS(outputPath);
        
        //---------------------Generate index.html---------------------
        let data = [];
        let genres = group_by(song_data, "genre");
        let albums = group_by(song_data, "album");
        let artists = group_by(song_data, "artist");

        //Song Number
        let s_Number = song_data.length;
        data.push(s_Number);

        //Album Number
        let al_Number = Object.keys(albums).length;
        data.push(al_Number);

        //Genre Number
        let gen_Number = Object.keys(genres).length;
        data.push(gen_Number);

        //Artist Number
        let art_Number =  Object.keys(artists).length;
        data.push(art_Number);

        //Artist list
        let a_List = ' ';
        for (let i = 0; i < Object.keys(artists).length; i++){
            a_List = a_List + artListToHTML(Object.keys(artists)[i]);
        }

        //Genre list
        let gen_List = ' ';
        for (let i = 0; i < Object.keys(genres).length; i++){
            gen_List = gen_List + genListToHTML(Object.keys(genres)[i]);
        }

        generateIndex(data, a_List, gen_List, outputPath);

        //---------------------Generate songs.html---------------------


        let songs_List = ' ';
        for (let i = 0; i < song_data.length; i++){
            songs_List = songs_List + songToHTML(song_data[i]);
        }

        let gen_List_Side = ' ';
        for (let i = 0; i < Object.keys(genres).length; i++){
            gen_List_Side = gen_List_Side + sidebarToHTMLGen(Object.keys(genres)[i]);
        }

        generateSongs(songs_List, gen_List_Side, outputPath);

        //----------------Generate songs-genre-*.html-----------------
        
        for (let i = 0; i < Object.keys(genres).length; i++){
    
            let searchQuery = {};
            searchQuery.genre = Object.keys(genres)[i];
            let songsToDisplay = find_by(song_data, searchQuery)
            let songs_List_byGen = ' ';
            for (let i = 0; i < songsToDisplay.length; i++){
                songs_List_byGen = songs_List_byGen + songToHTML(songsToDisplay[i]);
            }

            let artistsFromGenre = Object.keys(group_by(songsToDisplay, "artist"));
            let art_List_Side = ' ';
            for (let i = 0; i < artistsFromGenre.length; i++){
                art_List_Side = art_List_Side + sidebarToHTMLArt(artistsFromGenre[i]);
            }

            generateSongsGenre(Object.keys(genres)[i].toLowerCase(), songs_List_byGen, art_List_Side, outputPath);
        }

        //----------------Generate songs-artist-*.html-----------------
        
        for (let i = 0; i < Object.keys(artists).length; i++){
    
            let searchQuery = {};
            searchQuery.artist = Object.keys(artists)[i];
            let songsToDisplay = find_by(song_data, searchQuery)
            let songs_List_byArt = ' ';
            for (let i = 0; i < songsToDisplay.length; i++){
                songs_List_byArt = songs_List_byArt + songToHTML(songsToDisplay[i]);
            }

            let albumsFromArtist = Object.keys(group_by(songsToDisplay, "album"));
            let alb_List_Side = ' ';
            for (let i = 0; i < albumsFromArtist.length; i++){
                alb_List_Side = alb_List_Side + sidebarToHTMLAlb(albumsFromArtist[i]);
            }

            generateSongsArtist(Object.keys(artists)[i].toLowerCase(), songs_List_byArt, alb_List_Side, outputPath);
        }

        //----------------Generate songs-album-*.html-----------------
        
        for (let i = 0; i < Object.keys(albums).length; i++){
    
            let searchQuery = {};
            searchQuery.album = Object.keys(albums)[i];
            let songsToDisplay = find_by(song_data, searchQuery)
            let songs_List_byAlb = ' ';
            for (let i = 0; i < songsToDisplay.length; i++){
                songs_List_byAlb = songs_List_byAlb + songToHTML(songsToDisplay[i]);
            }

            generateSongsAlbum(Object.keys(albums)[i].toLowerCase(), songs_List_byAlb, outputPath);
        }
    });
}

staticGeneration(inputPath, outputPath);
console.log('static done');


module.exports.staticGeneration = staticGeneration;