/**
 * Web Atelier 2021  Exercise 6 - MongoDB
 *
 * Student: __STUDENT NAME__
 *
 * Task 1. Database Tests
 *
 */

 const should = require('should');
 const request = require('supertest')("http://localhost:8888");

 const models = require('../models').model;

 const ObjectId = require('mongodb').ObjectId;


 describe('Task 1. Database', function() {

     //block the tests until the model connects to the database
     before(function(done){

         let attempts = 0;

         function check() {
             if (models.db && models.music) {
                 done();
             } else {
                 console.log("Trying to connect")
                 attempts++;
                 if (attempts < 10) {
                     setTimeout(check, 500);
                 } else {
                     throw "Unable to connect the test to the database";
                 }
             }
         }

         check();

     });


     describe('POST /songs', function() {

         let initialSize;

         let _id;

         let _api;

         const title = "Database Test Title";
         const artist = "Database Test Artist";

         it('check initial music collection size', function(done) {

             models.music.find({}).toArray().then(a=>{

                 initialSize = a.length;

             }).then(done,done);

         });

         it('should create a new song if the request data is valid', function(done) {

             request
                 .post('/songs')
                 .field("title", title)
                 .attach("file", __dirname + '/assets/four.mp3')
                 .set('Accept', 'application/json')
                 .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json')
                 .expect(201)
                 .end(function(err, res) {
                     if (err) return done(err);

                     //console.log(res.text);

                     const song = JSON.parse(res.text);
                     _id = song._id; //grab the id for checking if we can read this
                     _id.should.not.be.undefined();

                     _api = song;

                     done();
                 });
         });

         it('check music collection size after creation', function(done) {

             models.music.find({}).toArray().then(a=>{

                 should(initialSize + 1 == a.length).be.true();

             }).then(done,done);

         });

         it('check new picture database object', function(done) {

             models.music.find({_id: new ObjectId(_id)}).toArray().then(a=>{

                 let _db = a[0];

                 should(_db).be.not.undefined();

                 //check that the API object matches the database object
                 should(_db.title == _api.title).be.true();
                 should(_db.desc == _api.desc).be.true();
                 should(_db.favourite == _api.favourite).be.true();
                 should(_db.filename == _api.filename).be.true();
                 should(_db.artist == _api.artist).be.true();
                 should(_db.album == _api.album).be.true();
                 should(_db.genre == _api.genre).be.true();
                 should(_db.quality == _api.quality).be.true();

             }).then(done,done);

         });

         it('modify object author field and check it can be read from the API', function(done) {

             models.music.updateOne({_id: new ObjectId(_id)}, {$set:{artist}}).then(result=>{

                 should(result.modifiedCount).be.equal(1);

                 request
                     .get('/songs/' + _id)
                     .set('Accept', 'application/json')
                     .send()
                     .expect(200)
                     .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json')
                     .end(function(err, res) {
                         if (err) return done(err);

                         const song = JSON.parse(res.text);
                         should(song.artist == artist).be.true();

                         done();
                     });

             });

         });

         it('delete object from the API and check it is no longer in the database', function(done){

             request
                 .delete('/songs/' + _id)
                 .send()
                 .expect(204)
                 .end(function(err, res) {
                     if (err) return done(err);

                 models.music.find({_id: new ObjectId(_id)}).toArray().then(a=>{

                         should(a.length).be.equal(0);

                     }).then(done);
                 });

         });
     });

 });