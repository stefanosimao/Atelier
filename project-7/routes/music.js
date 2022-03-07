/**
 * Web Atelier 2021  Exercise 6 - MongoDB
 *
 * Student: Stefano Gonçalves Simao
 *
 * /songs API router
 *
 *
 */

  /**
   * TODO: REPLACE WITH THE music.js FILE FROM YOUR PREVIOUS ASSIGNMENT
   * THEN REWRITE TO READ/WRITE TO THE DATABASE INSTEAD OF THE data.json FILE
   */

const express = require('express');
const router = express.Router();
module.exports = router;

const mp3Duration = require('mp3-duration');
const jsmediatags = require('jsmediatags');
const fs = require('fs-extra');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

const model = require('../models').model;


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

function uploadSong(audioFile, req, res, id) {
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
            (typeof id !== 'undefined') ? songObj._id = new ObjectId(id) : null;
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

                    model.music.insertOne(songObj).then(result => {
                        if (req.accepts("html")) {
                            res.redirect(302, '/songs')
                        } else {
                            res.type("application/json");
                            //console.log(songObj);
                            res.status(201).json(songObj).end();
                        }

                    }).catch((err) => {
                        console.log(err);
                        res.status(500).end();
                    });
                },
                onError: function (error) {
                    console.log('Error extracting metadata ', error.type, error.info);
                }
            });
        });
    });
}

function processData(data) {
    console.log(data);
    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].missing_file == true) {
            data.splice(i, 1);
        }
    }
    console.log(data);
    return data;
}

router.get('/upload', function(req, res) {
    model.music.find().toArray().then(data => {
        let genres = group_by(data, "genre");
        let gen_List_Side = Object.keys(genres);
        let model = { options: gen_List_Side };
        if (req.accepts("html")){
            res.render("upload", model);                      
        } else {
            res.type("application/json");
            res.status(200).send(model).end();
        }
            
    }).catch((err) => {
        console.log(err);
        res.status(500).end();
    });
});

function renderSongs(res, req, model){
    if (req.accepts("html")) {
        res.render("songs", model);
    } else {
        res.type("application/json");
        res.status(200).send(model.song_List).end();
    }
}

router.get('/', function(req, res) {
    if (Object.keys(req.query).length == 0) {
        model.music.find().toArray().then(dbData => {
            if (dbData.length == 0) {
                let model = { song_List: [], side_List: [], side_Type: 'enjoy' };
                renderSongs(res, req, model);
            }
            data = processData(dbData);
            let genres = group_by(data, "genre");
            let gen_List_Side = Object.keys(genres);
            let model = { song_List: data, side_List: gen_List_Side, side_Type: 'genre' };
            renderSongs(res, req, model);
            //renderSongs(res, req, data);
        }).catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    }
    else if (Object.keys(req.query).length == 1) {
        if (Object.keys(req.query)[0] == 'genre') {
            let update = {};
            update.genre = req.query.genre;
            //console.log(update);
            model.music.find(update).toArray().then(dbData => {
                data = processData(dbData);
                let artistsFromGenre = Object.keys(group_by(data, "artist"));
                let model = { song_List: data, side_List: artistsFromGenre, side_Type: 'artist' };
                renderSongs(res, req, model);
            }).catch((err) => {
                console.log(err);
                res.status(500).end();
            });
        }
        else if (Object.keys(req.query)[0] == 'artist') {
            let update = {};
            update.artist = req.query.artist;
            model.music.find(update).toArray().then(dbData => {
                data = processData(dbData);
                let albumsFromArtist = Object.keys(group_by(data, "album"));
                let model = { song_List: data, side_List: albumsFromArtist, side_Type: 'album' };
                renderSongs(res, req, model);
            }).catch((err) => {
                console.log(err);
                res.status(500).end();
            });
        }
        else if (Object.keys(req.query)[0] == 'album') {
            let update = {};
            update.album = req.query.album;
            model.music.find(update).toArray().then(dbData => {
                data = processData(dbData);
                let model = { song_List: data, side_List: [], side_Type: 'enjoy' };
                renderSongs(res, req, model);
            }).catch((err) => {
                console.log(err);
                res.status(500).end();
            });
        }
    }
    else {
        let update = {};
        Object.keys(req.query).forEach((query) => {
            update[query] = req.query[query];
        })
        model.music.find(update).toArray().then(data => {
            let model = { song_List: data, side_List: [], side_Type: 'enjoy' };
            renderSongs(res, req, model);
        }).catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    }
});

router.post('/', function(req, res) {
    if (!req.files || Object.keys(req.files).length == 0) {
        console.log(req.params);
        return res.status(400).send("The song file is missing!");
    }
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
                uploadSong(audioFile, req, res);
            }
        });
    }

});

router.get('/:id/edit', function(req, res) {
    let filter = { _id: new ObjectId(req.params.id) };
    model.music.findOne(filter).then(oneData => {
        if (req.accepts("html")){
            model.music.find({}).toArray().then(data => {
                let genres = group_by(data, "genre");
                let gen_List_Side = Object.keys(genres);
                let model = {song_info: oneData, options: gen_List_Side, selected: oneData.genre};
                res.render("edit", model);
            })              
        } else {
            res.type("application/json");
            res.status(200).send(oneData).end();
            return
        }
    }).catch((err) => {
        console.log(err);
        res.status(404).end();
    });

});

router.get('/:id', function(req, res) {
    if (ObjectId.isValid(req.params.id)){
        let filter = { _id: new ObjectId(req.params.id) };
        model.music.findOne(filter).then(data => {
            if (data == null){
                res.status(404).end();
            }
            else{
                if (req.accepts("html")){
                    let model = {song_info: data};
                    res.render("player", model);                      
                } else {
                    res.type("application/json");
                    res.status(200).send(data).end();

                }

            }     
        }).catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    } else{
        res.status(404).end();
    }

});

router.delete('/:id', function (req, res) {
    //console.log(req.params.id)
    if (ObjectId.isValid(req.params.id)){
        //console.log('isvalid')
        let filter = { _id: new ObjectId(req.params.id) };
        model.music.findOne(filter).then(result1 => {
            //console.log(result1)
            if (result1 == null) {
                res.status(404).end();
            } else {
                //console.log(result);
                model.music.deleteOne(filter).then(result=>{
                    fs.unlink(`./${result1.src}`, err =>{
                        if (err) {
                            console.log("Error on unlink file");
                            res.status(500).end();
                        } else{
                            //console.log('OOOOOO')
                            if (req.accepts("html")) {
                                res.status(204).end();  
                                //res.redirect('/songs'); 
                            } else {
                                res.status(204).end();
                            }
                        }
                    });
                });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    }
    else{
        res.status(404).end();
    }
})

router.put('/:id', function (req, res) {
    if (ObjectId.isValid(req.params.id)){
        let filter = { _id: new ObjectId(req.params.id) };
        if (!req.files || Object.keys(req.files).length == 0) { 
            model.music.findOne(filter).then(result => {
                if (result == null) {
                    res.status(404).end();
                } 
                else{
                    let song_data = {};
                    song_data.title = req.body.title || result.title;
                    song_data.artist = req.body.artist || result.artist;
                    song_data.album = req.body.album || result.album;
                    song_data.genre = req.body.genre || result.genre;
                    song_data.desc = req.body.desc || result.desc;
                    song_data.quality = parseInt(req.body.quality) || result.quality;
                    if (req.body.favourite == true || req.body.favourite == 'true') {
                        song_data.favourite = true;
                    } else {
                        song_data.favourite = false;
                    } 
                    song_data.filename = result.filename;
                    song_data.src = result.src;
                    song_data.duration = result.duration;
                    song_data.size = result.size;

                    const update = {
                        $set: song_data
                    }
                    model.music.updateOne(filter, update).then(result=>{
                        if (req.accepts("html")){
                            res.redirect(302, '/songs')  
                        } else {
                            song_data._id = req.params.id;
                            res.type("application/json");
                            res.status(200).send(song_data).end();
                        }    
                    });
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
                model.music.findOne(filter).then(result => {
                    if (result == null) {
                        if (!fs.existsSync("./music/")){
                            fs.mkdirSync("./music/");       
                        }       

                        let audioFile = req.files.file;
                        audioFile.mv((`./music/${audioFile.name}`), err => {
                            if (err) {
                                res.status(500).end();
                            }
                            else{
                                uploadSong(audioFile, req, res, req.params.id);
                            }
                        });
                    } 
                    else{
                        fs.unlink(`./${result.src}`, err =>{
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
                                            
                                                let songObj = {};
                                                //songObj._id = genID();
                                                songObj.title = " ";
                                                songObj.artist = " ";
                                                songObj.album = " ";
                                                songObj.genre = " ";
                                                songObj.desc = req.body.desc || " ";
                                                if (req.body.favourite == true || req.body.favourite == 'true') {
                                                    songObj.favourite = true;
                                                } else if (req.body.favourite == false || req.body.favourite == 'false') {
                                                    songObj.favourite = false;
                                                } else{
                                                    songObj.favourite = false;
                                                }
                                                songObj.filename = " ";
                                                songObj.src = " ";
                                                songObj.duration = " ";
                                                songObj.size = stats.size;
                                                songObj.quality = req.body.quality || 5;
                                                jsmediatags.read(`./music/${audioFile.name}`, {
                                                    onSuccess: function(tag) {
                                                        songObj.title = req.body.title || tag.tags.title;
                                                        songObj.artist = req.body.artist || tag.tags.artist;
                                                        songObj.album = req.body.album || tag.tags.album;
                                                        songObj.genre = req.body.genre || tag.tags.genre;
                                                        songObj.filename = audioFile.name;
                                                        songObj.src = `/music/${audioFile.name}`;
                                                        songObj.duration = duration;

                                                        const update = {
                                                            $set: songObj
                                                        }
                                                        model.music.updateOne(filter, update).then(result=>{
                                                            if (req.accepts("html")){
                                                                res.redirect(302, '/songs')  
                                                            } else {
                                                                songObj._id = req.params.id;
                                                                res.type("application/json");
                                                                res.status(200).json(songObj).end();
                                                            }    

                                                        }).catch((err) => {
                                                            console.log(err);
                                                            res.status(500).end();
                                                        });
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
    }
    else{
        res.status(404).end();
    }



});