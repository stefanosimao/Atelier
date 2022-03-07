/**
 * Web Atelier 2021  Exercise 4 - JavaScript on the Server-side
 *
 * Student: Stefano Gonçalves Simao
 *
 * Task 3,(4) Web Server
 *
 */

const http = require("http");
//const staticModule = require('./static');
//const metadataModule = require('./metadata');
var childProcess = require('child_process');

//Useful module to work with the file system
//Module needs to be installed with yarn add fs-extra
const fs = require("fs-extra");
const { index } = require("cheerio/lib/api/traversing");

//Access command line parameters
let site_path = process.argv[2] || "./public";
let basePath = '/Users/stefanosimao/ex4-node--stefanosimao/';

function generatePlayer(response, song){
    content=`<!DOCTYPE html>
        <html lang="en">
            <head>
                <title> Player </title>
                <meta name="author" content="Stefano Gonçalves Simao">
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link href="style.css" rel="stylesheet"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Quicksand">
            </head>

        <body class="player" onload="init()">

            <header class="player" id="bigtitle"> Stefano's Music </header>
                <hr class="player">
                <section class="player">

                    <nav class="player">  <img src = "images/place.svg" alt="Place" class="player" id="place"/>
                        <a href="index.html" target="_blank" class="player link" >Homepage</a>
                        <a href="songs.html" target="_blank" class="player link">Song catalog</a>
                        <a href="player.html" target="_blank" class="player link" id="current">Player Page</a>
                        <a href="upload.html" target="_blank" class="player link">Song Upload Form</a>                                
                    </nav>

                    <main class="player" id="player">
                        <header class="player" >
                            <p class="title titleSong"><a class="title rest artist" href="/songs-artist-${song.artist.toLowerCase()}.html" class="link">${song.artist}</a></p>
                            <p class="title titleSong">${song.title}</p>
                            <p class="title titleSong"><a class="title rest album" href="/songs-album-${song.album.toLowerCase()}.html" class="link">${song.album}</a></p>
                        </header>
                        <section class="play buttons">
                            <button type="button" class="small" id="prev"></button>
                            <button type="button" id="play"></button>
                            <button type="button" id="pause"></button>
                            <button type="button" class="small" id="next"></button>
                        </section>
                        <section class="player seek play" >
                            <p class="elapsed"></p>
                            <progress id="file" value="0" max="100"></progress>
                            <p class="remain"></p>
                        </section>  
                        <aside class="player volume" > 
                                <button type="button" id="loud"></button>
                                <button type="button" id="mute"></button>
                                <button type="button" id="low"></button>
                                <input type="range" id="slide" min="0" max="100" value="75"/>
                        </aside>
                    </main>
                        <aside class="player">  
                    </aside>
                </section>
                <hr class="player">
                <footer class="player"> 
                    <span class="player footer">@StefanoGonçalvesSimao </span> 
                    <span class="player footer">Fri 01 Oct 2021</span> 
                    <span class="player footer"><a href="https://en.wikipedia.org/wiki/Disclaimer" target="_blank" class="player">Legal Disclaimer</a></span>  
                </footer>

            <audio id="player-audio" style="display:none"></audio>
            <script>
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
                function init(){
                    let audio = document.getElementById("player-audio");
                    audio.setAttribute('src', "${basePath}${song.src}");
                    audio.load();
                    setTimeout(() => {
                        document.querySelector("#slide").setAttribute('value', '75.0')
                        audio.volume = '0.75';
                        document.querySelector("#file").setAttribute('max', audio.duration);

                        audio.addEventListener('volumechange', () => {
                            document.querySelector("#slide").setAttribute('value', audio.volume * 100);
                            console.log(audio.volume)
                        });
                        document.querySelector("#loud").addEventListener("click", () => {
                            audio.volume > 0.8 ? audio.volume = 1.0 : audio.volume += 0.2
                        });
                        document.querySelector("#low").addEventListener("click", () => {
                            audio.volume < 0.2 ? audio.volume = 0.0 : audio.volume -= 0.2
                        });
                        document.querySelector("#mute").addEventListener("click", () => {
                            audio.volume == 0.0 ? audio.volume = 0.75 : audio.volume = 0.0
                        });
                        document.querySelector("#slide").addEventListener("input", () => audio.volume = document.querySelector("#slide").value / 100);


                    }, 50)

                    setInterval(() => {
                        document.querySelector(".elapsed").innerHTML = format_seconds(audio.currentTime);
                        document.querySelector(".remain").innerHTML = format_seconds(Math.ceil(audio.duration - audio.currentTime));
                        document.querySelector("#file").setAttribute('value', audio.currentTime);
                        document.querySelector("#file").setAttribute('max', audio.duration);
                    }, 100);
                    document.querySelector("#play").addEventListener("click", () => audio.play());
                    document.querySelector("#pause").addEventListener("click", () => audio.pause());

                }
            </script>
        </body>
        </html>

        </body>
        </html>`;
        response.writeHead(200, {'Content-Type':  'text/html; charset=utf8'});
        response.write(content);
        response.end();
}

function handle_GET(request, response){
    let url = request.url;
    
    if (url == '/'){
        response.writeHead(302, {'Location': `index.html`, 'Content-Type': 'text/html; charset=utf8'});
        response.end();
    }
    else if(url == '/index.html'){
        fs.readFile(`${site_path}/index.html`, function(err, pageI){
            if (err){
                response.writeHead(404);
                response.end();
            }
            response.writeHead(200, {'Content-Type':  'text/html; charset=utf8'});
            response.write(pageI);
            response.end();
        })
    }    
    else if(url.endsWith('/style.css')){
        fs.readFile(`${site_path}/style.css`, function(err, pageCSS){
            if (err){
                response.writeHead(404);
                response.end();
            }
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.write(pageCSS);
            response.end();
        })
    }
    else if(url.endsWith('.svg')){
        fs.readFile(`${site_path}/${url}`, function(err, svg){
            if (err){
                response.writeHead(404);
                response.end();
            }
            response.writeHead(200, {'Content-Type': 'image/svg+xml'});
            response.write(svg);
            response.end();
        })
    }
    else if(url.endsWith('.mp3')){
        if (url.includes('player')){
            let o = new URL(url, 'http://localhost:888/')
            let songSrc = o.searchParams.get('src');
            let jsonPath = '';
            if (site_path.includes('test')){
                jsonPath  = './test/data.json';
            }
            else {
                jsonPath  = './data.json';
            }

            fs.readFile(jsonPath, function (err, songsJSON){
                if (err){
                    console.log("Error when reading the folder");
                    return;
                }
                let song_data = JSON.parse(songsJSON);
                for(let i = 0; i < song_data.length; i++){
                    if (song_data[i].src == songSrc){
                        songPlay = song_data[i];
                    }
                }
                //console.log(song_data);
                generatePlayer(response, songPlay);
            })
        }
        else{
            fs.readFile(`${url}`, function(err, song){
                if (err){
                    response.writeHead(404);
                    response.end();
                }
                response.writeHead(200, {'Content-Type': 'audio/mpeg'});
                response.write(song);
                response.end();
            })
        }

    }
    else if(url.includes('/songs.html')){
        fs.readFile(`${site_path}/songs.html`, function(err, pageS){
            if (err){
                response.writeHead(404);
                response.end();
            }
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
            response.write(pageS);
            response.end();
        })
    }  
    else if(url.includes(`/songs-`)){
        if (url.includes(`marion`)){
            fs.readFile(`${site_path}/songs-artist-marion cotillard.html`, function(err, page){
                if (err){
                    response.writeHead(404);
                    response.end();
                }
                response.writeHead(200, {'Content-Type':  'text/html; charset=utf8'});
                response.write(page);
                response.end();
            })
        }
        else if (url.includes(`fleming`)){
            fs.readFile(`${site_path}/songs-artist-renée fleming.html`, function(err, page){
                if (err){
                    response.writeHead(404);
                    response.end();
                }
                response.writeHead(200, {'Content-Type':  'text/html; charset=utf8'});
                response.write(page);
                response.end();
            })
        }
        else{
            fs.readFile(`${site_path}${url}`, function(err, page){
                if (err){
                    response.writeHead(404);
                    response.end();
                }
                response.writeHead(200, {'Content-Type':  'text/html; charset=utf8'});
                response.write(page);
                response.end();
            })
        }
    } 
    else {
        response.writeHead(404);
        response.end();
    }   

}

function handle_POST(request, response){
    let url = request.url;
    if (url == '/refresh'){
        let musicPath = '';
        let outputPath = '';
        if (site_path.includes('test')){
            musicPath = './test/assets';
            outputPath  = './test/data.json';
        }
        else {
            musicPath = './music';
            outputPath  = './data.json';
        }
        
        childProcess.fork('metadata.js', [musicPath, outputPath]).on('exit', function (code) {
            console.log(code);
            fs.removeSync(site_path);
            childProcess.fork('static.js', [outputPath, site_path]).on('exit', function (code) {
                console.log(code);
                fs.readFile(`${site_path}/index.html`, function(err, pageI){
                    if (err){
                        response.writeHead(404);
                        response.end();
                        
                    } else {
                        response.writeHead(200, { "Content-Type": "text/html; charset=utf8" });
                        response.write(pageI);
                        response.end();
                    }
                });
            })
        })

    }
}

function handle_rest(request, response){
    response.writeHead(405);
    response.end();
}

function onrequest(request, response) {

    let method = request.method;

    fs.access(site_path, fs.constants.F_OK, (err) => {
        if (err) {
            console.log('Path not found!')
            response.writeHead(404);
            response.end();
        }
        if (method == 'GET'){
            handle_GET(request, response);
        }
        else if (method == 'POST'){
            handle_POST(request, response);
        } 
        else {
            handle_rest(request, response);
        }
    })
}

http.createServer(onrequest).listen(8888);

