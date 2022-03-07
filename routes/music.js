/**
 * Web Atelier 2021  Exercise 5 - Express and EJS
 *
 * Student: Stefano Gonçalves Simao
 *
 * /songs API router
 *
 * This module skeleton exports the routes for Task 1
 *
 * You can extend it to include the routes for Task 2
 *
 */

const express = require('express');
const router = express.Router();
module.exports = router;
const mp3Duration = require('mp3-duration');


const jsmediatags = require('jsmediatags');
const fs = require('fs-extra');

let done = false;
let data = [];

function getData() {
    return new Promise((resolve, reject) => {
        try { 
            if (done == true) {
                resolve();
            }
            else {
                fs.readJSON('./data.json', function (err, songData) {
                    if (err) {
                        console.log(err);
                    } else {
                        done = true;
                        data = songData;
                        //console.log(data);
                        resolve();
                    }
                });
            }
        }
        catch (err) {
            reject(err);
        }
    });
} 

function genID(){
    var charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + Date.now();
    var id = '';
    for (let i = 0; i < 24; i++) {
        id += charPool.charAt(Math.floor(Math.random() * charPool.length));
    }
    return id;
}

function uploadSong(audioFile, id, req, res) {
    fs.stat(`./music/${audioFile.name}`, function (err, stats) {
        if (err) {
            console.log("Error when reading the folder");
            return;
        }
        mp3Duration(`./music/${audioFile.name}`, (err, duration) => {
            if (err) {
                return console.log(err.message);
            }

            let songObj = {};
            songObj._id = id;
            songObj.title = " ";
            songObj.artist = " ";
            songObj.album = " ";
            songObj.genre = " ";
            songObj.desc = req.body.desc || " ";
            if (req.body.favourite == true || req.body.favourite == 'true') {
                songObj.favourite = true;
            } else if (req.body.favourite == false || req.body.favourite == 'false') {
                songObj.favourite = false;
            } else {
                songObj.favourite = false;
            }
            songObj.filename = " ";
            songObj.src = " ";
            songObj.duration = " ";
            songObj.size = stats.size;
            songObj.quality = req.body.quality || 5;
            jsmediatags.read(`./music/${audioFile.name}`, {
                onSuccess: function (tag) {
                    songObj.title = req.body.title || tag.tags.title;
                    songObj.artist = req.body.artist || tag.tags.artist;
                    songObj.album = req.body.album || tag.tags.album;
                    songObj.genre = req.body.genre || tag.tags.genre;
                    songObj.filename = audioFile.name;
                    songObj.src = `/music/${audioFile.name}`;
                    songObj.duration = duration;

                    data.push(songObj);

                    fs.writeJSON('./data.json', data, err => {
                        if (err) {
                            res.status(500).end();
                        }
                        else {
                            if (req.accepts("html")) {
                                res.redirect(302, '/songs')
                            } else {
                                res.type("application/json");
                                res.status(201).json(songObj).end();
                            }
                        }
                    })
                },
                onError: function (error) {
                    console.log('Error extracting metadata ', error.type, error.info);
                }
            });
        });
    });
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

router.get('/upload', function(req, res) {
    if (req.accepts("html")){
        res.render("upload");                      
    } else {
        res.type("application/json");
        res.status(200).send(data).end();
    }
});

router.get('/', function(req, res) {
    getData().then(() => {
        //console.log(data);
        if (data.length == 0){
            if (req.accepts("html")){
                let model = {song_List: [], side_List: [], side_Type: ' '};
                res.render("songs", model);
            } else {
                res.type("application/json");
                res.status(200).send(data).end();
            }
        }
        else{
            if (req.accepts("html")){
                let genres = group_by(data, "genre");
                for (let i = 0; i < data.length; i++){
                    if (typeof data[i].duration == 'number')
                    data[i].duration = format_seconds(Math.ceil(data[i].duration));       
                }
                if(Object.keys(req.query).length == 0){
                    let gen_List_Side = Object.keys(genres);
                    let model = {song_List: data, side_List: gen_List_Side, side_Type: 'genre'};
                    res.render("songs", model);
                }
                else if (Object.keys(req.query).length == 1){
                    if (Object.keys(req.query)[0] == 'genre') {
                        let searchQuery = {};
                        searchQuery.genre = req.query.genre;
                        let songsToDisplay = find_by(data, searchQuery);
                        let artistsFromGenre = Object.keys(group_by(songsToDisplay, "artist"));
                        let model = { song_List: songsToDisplay, side_List: artistsFromGenre, side_Type: 'artist' };
                        res.render("songs", model);
                    }
                    else if (Object.keys(req.query)[0] == 'artist') {
                        let searchQuery = {};
                        searchQuery.artist = req.query.artist;
                        let songsToDisplay = find_by(data, searchQuery);
                        let albumsFromArtist = Object.keys(group_by(songsToDisplay, "album"));
                        let model = { song_List: songsToDisplay, side_List: albumsFromArtist, side_Type: 'album' };
                        res.render("songs", model);
                    }
                    else if (Object.keys(req.query)[0] == 'album') {
                        let searchQuery = {};
                        searchQuery.album = req.query.album;
                        let songsToDisplay = find_by(data, searchQuery);
                        let model = { song_List: songsToDisplay, side_List: [], side_Type: 'enjoy' };
                        res.render("songs", model);

                    }
                }
                else{
                    let searchQuery = {};
                    Object.keys(req.query).forEach((query) =>{
                        searchQuery[query] = req.query[query];
                    })
                    let songsToDisplay = find_by(data, searchQuery);
                    let model = { song_List: songsToDisplay, side_List: [], side_Type: 'enjoy' };
                    res.render("songs", model);
                }
            } 
            else {
                res.type("application/json");
                res.status(200).send(data).end();
            }
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).end();
    });
});

router.post('/', function(req, res) {
    if (!req.files || Object.keys(req.files).length == 0) {
        //console.log(req.params);
        return res.status(400).send("The song file is missing!");
    }
    // else if (req.files.file.mimetype != 'audio/mpeg'){
    //     return res.status(400).send("Not an audio file!");
    // }
    else{
        if (!fs.existsSync("./music/")){
            fs.mkdirSync("./music/");       
        }       

        let audioFile = req.files.file;
        audioFile.mv((`./music/${audioFile.name}`), err => {
            if (err) {
                res.status(500).end();
            }
            else{
                getData().then(() => {
                    uploadSong(audioFile, genID(), req, res);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).end();
                });
            }
        });
    }

});

router.get('/:id/edit', function(req, res) {
    getData().then(() => {
        for (let i = 0; i < data.length; i++){
            if (data[i]._id == req.params.id){
                if (req.accepts("html")){
                    let genres = group_by(data, "genre");
                    let gen_List_Side = Object.keys(genres);
                    let model = {song_info: data[i], options: gen_List_Side, selected: data[i].genre};
                    res.render("edit", model);                      
                } else {
                    res.type("application/json");
                    res.status(200).send(data[i]).end();
                    return
                }
                
            }else{
                res.status(404).end();
            }
        }
        
    }).catch((err) => {
        console.log(err);
        res.status(500).end();
    });

});

router.get('/:id', function(req, res) {
    getData().then(() => {
        for (let i = 0; i < data.length; i++){
            if (data[i]._id == req.params.id){
                if (req.accepts("html")){
                    let model = {song_info: data[i]};
                    res.render("player", model);                      
                } else {
                    res.type("application/json");
                    res.status(200).send(data[i]).end();
                    return
                }
                
            } else {
                res.status(404).end();
            } 
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).end();
    });
});

router.put('/:id', function (req, res) {
    if (!req.files || Object.keys(req.files).length == 0) { 
        getData().then(() => {
            let match = -1;
            for (let i = 0; i < data.length; i++){
                if (data[i]._id == req.params.id){
                    match = i;
                }
            }
            if (match == -1){
                res.status(404).end();
            }
            else{
                data[match].title = req.body.title || data[match].title;
                data[match].artist = req.body.artist || data[match].artist;
                data[match].album = req.body.album || data[match].album;
                data[match].genre = req.body.genre || data[match].genre;
                data[match].desc = req.body.desc || data[match].desc;
                data[match].quality = req.body.quality || data[match].quality;
                if (req.body.favourite == true || req.body.favourite == 'true') {
                    data[match].favourite = true;
                } else if (req.body.favourite == false || req.body.favourite == 'false') {
                    data[match].favourite = false;
                } else{
                    data[match].favourite = false;
                }
                fs.writeJSON('./data.json', data, err => {
                    if (err) {
                        res.status(500).end();
                    }
                    else {
                        if (req.accepts("html")){
                            res.redirect(302, '/songs')  
                        } else {
                            res.type("application/json");
                            res.status(200).send(data[match]).end();
                        }    
                    }
                })
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    }
    else{
        if (req.files.file.mimetype != 'audio/mpeg'){
            return res.status(400).send("Not an audio file!");
        }
        else{
            let audioFile = req.files.file;
            getData().then(() => {
                let match = -1;
                for (let i = 0; i < data.length; i++){
                    if (data[i]._id == req.params.id){
                        match = i;
                    }
                }
                if (match == -1){
                    if (!fs.existsSync("./music/")){
                        fs.mkdirSync("./music/");       
                    } 
                    audioFile.mv((`./music/${audioFile.name}`), err => {
                        if (err) {
                            res.status(500).end();
                        }
                        else{
                            uploadSong(audioFile, req.params.id, req, res);
                        }
                    });

                }
                 else{
                    fs.unlink(`./${data[match].src}`, err =>{
                        if (err) {
                            console.log("Error on put unlink file");
                            res.status(500).end();
                        } else {
                            audioFile.mv((`./music/${audioFile.name}`), err => {
                                if (err) {
                                    res.status(500).end();
                                }
                                else{
                                    fs.stat(`./music/${audioFile.name}`, function (err, stats){
                                        if (err){
                                            console.log("Error when reading the folder");
                                            return;
                                        }
                                        mp3Duration(`./music/${audioFile.name}`, (err, duration) => {
                                            if (err) {
                                                return console.log(err.message);
                                            }
                                        
                                            data[match]._id = req.params.id;
                                            data[match].title = " ";
                                            data[match].artist = " ";
                                            data[match].album = " ";
                                            data[match].genre = " ";
                                            data[match].desc = req.body.desc || " ";
                                            if (req.body.favourite == true || req.body.favourite == 'true') {
                                                data[match].favourite = true;
                                            } else if (req.body.favourite == false || req.body.favourite == 'false') {
                                                data[match].favourite = false;
                                            }else{
                                                data[match].favourite = false;
                                            }
                                            data[match].filename = " ";
                                            data[match].src = " ";
                                            data[match].duration = " ";
                                            data[match].size = stats.size;
                                            data[match].quality = req.body.quality || 5;
                                            jsmediatags.read(`./music/${audioFile.name}`, {
                                                onSuccess: function(tag) {
                                                    data[match].title = req.body.title || tag.tags.title;
                                                    data[match].artist = req.body.artist || tag.tags.artist;
                                                    data[match].album = req.body.album || tag.tags.album;
                                                    data[match].genre = req.body.genre || tag.tags.genre;
                                                    data[match].filename = audioFile.name;
                                                    data[match].src = `/music/${audioFile.name}`;
                                                    data[match].duration = duration;

                                                    fs.writeJSON('./data.json', data, err => {
                                                        if (err) {
                                                            res.status(500).end();
                                                        }
                                                        else {
                                                            if (req.accepts("html")){
                                                                res.redirect(302, '/songs')  
                                                            } else {
                                                                res.type("application/json");
                                                                res.status(200).json(data[match]).end();
                                                            }   

                                                        }
                                                    })
                                                },
                                                onError: function(error) {
                                                    console.log('Error extracting metadata ', error.type, error.info);
                                                }
                                            });
                                        });
                                    });
                                }
                            });
                        }
                   })
                }    
            }).catch((err) => {
                console.log(err);
                res.status(500).end();
            });
        }

    }



});

router.delete('/:id', function (req, res) {
    getData().then(() => {
        let match = -1;
        for (let i = 0; i < data.length; i++){
            if (data[i]._id == req.params.id){
                match = i;
            }
        }
        if (match == -1){
            res.status(404).end();
        }
        else{
            fs.unlink(`./${data[match].src}`, err =>{
                if (err) {
                    console.log("Error on unlink file");
                    res.status(500).end();
                } 
                else {
                    data.splice(match, 1);
                    fs.writeJSON('data.json', data, err => {
                        if (err) {
                            res.status(500).end();
                        }
                        else {
                            if (req.accepts("html")){
                                res.status(204).end();  
                                //res.redirect('/songs');           
                            } else {
                                res.status(204).end();
                            }        
                        }
                    });
                }
            });
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).end();
    });

})


