/**
 * Web Atelier 2021  Exercise 5 - Express and EJS
 *
 * Student: Stefano Gonçalves Simao
 *
 * Router auto-loader
 *
 * (You may be asked to explain what this module does)
 *
 */

const fs = require('fs');

// dirEntries = [ 'home.js', 'index.js', 'music.js', 'playlist.js' ]
const dirEntries = fs.readdirSync(__dirname);
// /Users/stefanosimao/5-express-stefanosimao/routes/
const base = __dirname + '/';
const routers = {};

try {
    dirEntries.forEach(function(dirEntry) {
        const stats = fs.statSync(base + dirEntry);
        //try to load router of dir
        try {
            if (stats.isDirectory()) {
                // load module
                const router = require(base + dirEntry + '/router');
                //add router to our list of routers;
                routers[dirEntry] = router;

            } else {
                // load module
                const router = require(base + dirEntry);
                //add router to our list of routers;
                routers[dirEntry.replace(/.js$/,"")] = router;
            }
        } catch (err) {
            console.log('Could not get router for ' + dirEntry);
            console.log(err.toString() + err.stack);
        }
    });
} catch (err) {
    console.log('Error while loading routers');
    console.log(err.stack);
    //We don't know what happened, export empty object
    routers = {}
} finally {
    //console.log(routers);
    module.exports = routers;
}