/**
 * Web Atelier 2021  Exercise 6 - MongoDB
 *
 * Student: Stefano Gonçalves Simao
 *
 * Task 2
 *
 */

const fs = require('fs-extra');
const { model } = require('.');
const mp3Duration = require('mp3-duration');
const jsmediatags = require('jsmediatags');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;


function array_intersect(a, b) {
    if (!(a instanceof Array) || !(b instanceof Array)) {
        return undefined;
    }

    let intersect = a.filter(x => b.includes(x));
    return intersect;
}

function array_difference(a, b) {
    if (!(a instanceof Array) || !(b instanceof Array)) {
        return undefined;
    }

    let difference = a.filter(x => !(array_intersect(a, b).includes(x)));

    return difference;
}

module.exports.check = function (db_pictures, folder) {
    let missing_file = [];
    let missing_object = [];
    let files_db = [];
    return new Promise((resolve, reject) => {
        try{
            db_pictures.find({}).toArray()
            .then(data => {
                fs.readdir(folder).then((filenames) => {
                    for (let i = 0; i < data.length; i++) {
                        files_db.push(data[i].filename);
                        if (filenames.includes(data[i].filename)) {
                            if (data[i].missing_file == true) {
                                //data[i].missing_file = false;
                                const update = {
                                    $set: {'missing_file': false}
                                }
                                db_pictures.updateOne({ _id: data[i]._id }, update).then(result => {
                                    //console.log(result);
                                });
                            }
                        } else {
                            //data[i].missing_file = true;
                            missing_file.push(data[i]._id);
                            const update = {
                                $set: { 'missing_file': true }
                            }
                            db_pictures.updateOne({ _id: data[i]._id }, update).then(result => {
                                //console.log(result);
                            });
                        }
                    }

                    return [[...new Set(files_db)], missing_file, filenames];
                })
                .then((result) => {
                    let third = function(resolve1, reject1){
                        try {
                            files_db = result[0];
                            missing_file = result[1];
                            filenames = result[2];
                            let count = 0;
                            for (let i = 0; i < filenames.length; i++) {
                                if (!files_db.includes(filenames[i])) {
                                    fs.stat(`${folder}/${filenames[i]}`, function (err, stats) {
                                        if (err) {
                                            console.log("Error when reading the folder");
                                            return;
                                        }
                                        mp3Duration(`${folder}/${filenames[i]}`, (err, duration) => {
                                            if (err) {
                                                return console.log(err.message);
                                            }

                                            let songObj = {};
                                            //songObj._id = new ObjectId(genId());
                                            songObj.title = " ";
                                            songObj.artist = " ";
                                            songObj.album = " ";
                                            songObj.genre = " ";
                                            songObj.desc = " ";
                                            songObj.favourite = false;
                                            songObj.filename = " ";
                                            songObj.src = " ";
                                            songObj.duration = " ";
                                            songObj.size = stats.size;
                                            songObj.quality = 5;
                                            jsmediatags.read(`${folder}/${filenames[i]}`, {
                                                onSuccess: function (tag) {
                                                    songObj.title = tag.tags.title;
                                                    songObj.artist = tag.tags.artist;
                                                    songObj.album = tag.tags.album;
                                                    songObj.genre = tag.tags.genre;
                                                    songObj.filename = filenames[i];
                                                    songObj.src = `/music/${filenames[i]}`;
                                                    songObj.duration = duration;

                                                    db_pictures.insertOne(songObj).then(res => {
                                                        count++;
                                                        missing_object.push(res.insertedId);
                                                        if (count == filenames.length) {
                                                            result.push(missing_object);
                                                            resolve1(result);
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
                                else {
                                    count++;
                                    if (count == filenames.length) {
                                        result.push(missing_object);
                                        resolve1(result);
                                    }
                                }
                            }
                        }
                        catch(err){
                            reject1(err);
                        }
                    }

                    let p = new Promise(third);

                    p.then(res => {
                        //console.log(res);
                        missing_file = res[1];
                        missing_object = res[3];
                        let all_ids = [];
                        db_pictures.find().toArray().then((data) =>{
                            for (let i = 0; i < data.length; i++){
                                all_ids.push(data[i]._id.toString());
                            }
                            missing_file_string = missing_file.map(e => e.toString());
                            missing_object_string = missing_object.map(e => e.toString());
                            let temp = array_difference(all_ids, missing_file_string);
                            object_file_ok = array_difference(temp, missing_object_string);
                        let final = {};
                        final.missing_object = missing_object_string;
                        final.missing_file = missing_file_string;
                        final.object_file_ok = object_file_ok;
                        resolve(final);
                        });

                    })
                })
            }).catch((err) => {
                console.log(err);
            })
        }
        catch (err) {
            reject(err);
        }

    }); //new Promise

}
