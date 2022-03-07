/**
 * Web Atelier 2021  Exercise 4 - JavaScript on the Server-side
 *
 * Student: Stefano Gonçalves Simao
 *
 * Task 1 - MP3 Metadata Extractor
 *
 */

const fs = require("fs-extra");
const  jsmediatags = require("jsmediatags");
const mp3Duration = require('mp3-duration');

var myArgs = process.argv.slice(2);
let musicPath = './music';
let outputPath = './data.json';

if (myArgs.length == 2){
    musicPath = myArgs[0];
    outputPath = myArgs[1];
}
else if(myArgs.length == 1){
    musicPath = myArgs[0];
}


// ---SYNCHRONOUS---
// let result = [];
// let musicSrc = musicPath.substring(2);
// let songs = fs.readdirSync(musicPath);
// for (let i = 0; i < songs.length; i ++){
//     var stats = fs.statSync(`${musicPath}/${songs[i]}`);
//     let songObj = {};
//     songObj.title = " ";
//     songObj.artist = " ";
//     songObj.album = " ";
//     songObj.genre = " ";
//     songObj.filename = " ";
//     songObj.src = " ";
//     songObj.size = stats.size;
//     jsmediatags.read(`${musicPath}/${songs[i]}`, {
//         onSuccess: function(tag) {
//             songObj.title = tag.tags.title;
//             songObj.artist = tag.tags.artist;
//             songObj.album = tag.tags.album;
//             songObj.genre = tag.tags.genre;
//             songObj.filename = songs[i];
//             songObj.src = `${musicSrc}/${songs[i]}`;

//             result.push(songObj);
//             if (result.length == songs.length){
//                 fs.writeFile(outputPath, JSON.stringify(result), err => {
//                     if (err) {
//                         console.error(err)
//                         return
//                     }
//                 })
//             }
//         },
//         onError: function(error) {
//             console.log('Error extracting metadata for', songObject, error.type, error.info);
//         }
//     });
    
// }

// ---ASYNCHRONOUS---

function metadataGeneration(musicPath, outputPath){
    
    let result = [];
    let musicSrc = musicPath.substring(2);
    fs.readdir(musicPath, function (err, songs){
        if (err){
            console.log("Error when reading the folder");
            return;
        }
        for (let i = 0; i < songs.length; i ++){

            fs.stat(`${musicPath}/${songs[i]}`, function (err, stats){
                if (err){
                    console.log("Error when reading the folder");
                    return;
                }
                mp3Duration(`${musicPath}/${songs[i]}`, (err, duration) => {
                    if (err) {
                        return console.log(err.message);
                    }
                
                    let songObj = {};
                    songObj.title = " ";
                    songObj.artist = " ";
                    songObj.album = " ";
                    songObj.genre = " ";
                    songObj.filename = " ";
                    songObj.src = " ";
                    songObj.duration = " ";
                    songObj.size = stats.size;
                    jsmediatags.read(`${musicPath}/${songs[i]}`, {
                        onSuccess: function(tag) {
                            songObj.title = tag.tags.title;
                            songObj.artist = tag.tags.artist;
                            songObj.album = tag.tags.album;
                            songObj.genre = tag.tags.genre;
                            songObj.filename = songs[i];
                            songObj.src = `${musicSrc}/${songs[i]}`;
                            songObj.duration = duration;

                            result.push(songObj);
                            if (result.length == songs.length){
                                fs.writeFile(outputPath, JSON.stringify(result), err => {
                                    if (err) {
                                        console.error(err)
                                        
                                    }
                                })
                            }
                        },
                        onError: function(error) {
                            console.log('Error extracting metadata ', error.type, error.info);
                        }
                    });
                });
            });
        }
    })
}

metadataGeneration(musicPath, outputPath);
module.exports.metadataGeneration = metadataGeneration;