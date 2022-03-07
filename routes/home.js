const express = require('express');
const router = express.Router();
module.exports = router;
const fs = require('fs-extra');

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

router.get('/', function(req, res) {
    fs.readFile('./data.json', function (err, data){
        if (err){
            res.status(404).end();
        }
        else {
            let song_data = JSON.parse(data);
            if (song_data.length == 0){
                if (req.accepts("html")){
                    let model = {data: [], a_List: [], gen_List: [], fav_List: []};
                    res.render("homepage", model);
                } else {
                    res.type("application/json");
                    res.status(200).send(data).end();
                }
            }
            else{
                let stats = [];
                let song_data = JSON.parse(data);
                let genres = group_by(song_data, "genre");
                let albums = group_by(song_data, "album");
                let artists = group_by(song_data, "artist");
                let favourites = [];
                for (let i = 0; i < song_data.length; i++){
                    if (song_data[i].favourite == true){
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
                let art_Number =  Object.keys(artists).length;
                stats.push(art_Number);

                //Artist list
                let a_List = Object.keys(artists);

                //Genre list
                let gen_List = Object.keys(genres);

                let model = {data: stats, a_List: a_List, gen_List: gen_List, fav_List: favourites};

                if (req.accepts("html")){
                    res.render("homepage", model);
                } else {
                    res.type("application/json");
                    res.status(200).send(data).end();
                }
            }
            
        }
    });
});
