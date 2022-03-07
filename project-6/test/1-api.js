

const should = require('should');
const request = require('supertest')("http://localhost:8888");


function anyStatus(a) {
    return (res) => {
        if (a.indexOf(res.status) == -1) throw new Error(`Received ${res.status}; Expected ${a.join(" or ")}`);
    }
}

describe('Task 1. Testing API', function() {

    const oldID = '5f453b89e54198d2284adb76';

    let _id;

    function explainTestTitle(t) {
        t.test.title = t.test.title.replace(' picture', ` picture with _id='${_id}'`);
    }

    let song_desc = 'test song';

    function validateNewSongDefaults(song) {
        song.src.should.be.exactly('/music/'+song.filename);
        song.favourite.should.be.exactly(false, 'by default favourite should be false');
        song.quality.should.be.exactly(5, 'by default quality should be 5');
    }

    let initialSize;

    let newSong;

    describe('POST /songs', function() {

        it('check initial picture collection size', function(done) {

            request
                .get('/songs/')
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json')
                .end((err, res) => {
                    if (err) return done(err);

                    const pictures = JSON.parse(res.text);
                    //check the initial size of the content present in the server
                    initialSize = pictures.length;
                    this.test.title = `check initial picture collection size (${initialSize})`;
                    done();
                });
        });

        it('should create a new song if the request data is valid', function(done) {

            request
                .post('/songs')
                // .field("title", "One")
                .field("desc", song_desc)
                // .field("artist", "Tessa")
                // .field("genre", "Vocal")
                // .field("album", "Numbers")
                .attach("file", __dirname + '/assets/one.mp3')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json')
                .expect(201)
                .end(function(err, res) {
                    if (err) return done(err);

                    //console.log(res.text);

                    const song = JSON.parse(res.text);

                    // console.log(song);

                    _id = song._id; //grab the id for checking if we can read this
                    _id.should.not.be.undefined();

                    should(song.title).be.equal("One");
                    should(song.artist).be.equal("Tessa");
                    should(song.filename).be.equal("one.mp3");
                    should(song.src).be.equal("/music/one.mp3");
                    should(song.genre).be.equal("Vocal");
                    should(song.album).be.equal("Numbers");
                    should(song.desc).be.equal(song_desc);
                    validateNewSongDefaults(song);

                    done();
                });
        });



        it(`new song should be listed`, function(done) {

            request
                .get('/songs/')
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json')
                .end((err, res) => {
                    if (err) return done(err);

                    const songs = JSON.parse(res.text);

                    _id.should.not.be.undefined();
                    this.test.title = `new song with _id='${_id}' should be listed`;

                    songs.should.be.not.empty();
                    songs.map((o) => o._id).should.containEql(_id);
                    newSong = songs.find((o) => o._id == _id);
                    should(newSong).not.be.undefined();

                    should(newSong.title).be.equal("One");
                    should(newSong.artist).be.equal("Tessa");
                    should(newSong.filename).be.equal("one.mp3");
                    should(newSong.src).be.equal("/music/one.mp3");
                    should(newSong.genre).be.equal("Vocal");
                    should(newSong.album).be.equal("Numbers");
                    validateNewSongDefaults(newSong);

                    initialSize.should.be.equal(songs.length - 1);

                    done();
                });
        });

        it('new song should be downloaded', function(done) {

            this.test.title += " from " + newSong.src;

            request
                .get(newSong.src)
                .send()
                .expect(200)
                .expect('Content-Type', /audio/, 'it should respond with Content-Type: audio/mpeg')
                .expect('Content-Length', '4355') //TODO
                .end(done);
        });

        it('should get a 400 Bad Request if file is missing from upload', function(done) {

            request
                .post('/songs')
                .send()
                .expect(400, done);

        });

    });

    describe('GET /songs/:id', function() {

        it(`the new song metadata should be found`, function(done) {

            explainTestTitle(this);

            request
                .get('/songs/' + _id)
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json')
                .end(function(err, res) {
                    if (err) return done(err);

                    const song = JSON.parse(res.text);

                    should(song._id).be.equal(_id);
                    should(song.title).be.equal("One");
                    should(song.artist).be.equal("Tessa");
                    should(song.filename).be.equal("one.mp3");
                    should(song.src).be.equal("/music/one.mp3");
                    should(song.genre).be.equal("Vocal");
                    should(song.album).be.equal("Numbers");

                    done();
                });
        });

        it('a random song should be not found ', function(done) {

            request
                .get('/songs/' + Math.random())
                .send()
                .expect(404, done);
        });
    });

    describe('PUT /songs/:id', function() {

        it(`the new song should be found before updating it`, function(done) {

            explainTestTitle(this);

            request
                .get('/songs/' + _id)
                .send()
                .expect(200, done);
        });

        let updated_title = "updated title - " + Math.random().toString(36).slice(2);
        let updated_desc = "updated description - " + Math.random().toString(36).slice(2);

        let updated_song;

        it('updating the new song should change its title and description', function(done) {

            explainTestTitle(this);

            request
                .put('/songs/' + _id)
                .set('Accept', 'application/json')
                .field("title", updated_title)
                .field("desc", updated_desc)
                .field("favourite", true)
                .attach("file", __dirname + '/assets/two.mp3')
                .expect(anyStatus([200,302]))
                .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json')
                .end(function(err, res) {
                    if (err) return done(err);

                    const song = JSON.parse(res.text);
                    song.title.should.be.exactly(updated_title);
                    song.desc.should.be.exactly(updated_desc);
                    should(song.favourite).be.true();
                    song.src.should.be.exactly("/music/"+song.filename);

                    updated_song = song;

                    done();
                });
        });

        it('the updated song should change its title and description', function(done) {

            explainTestTitle(this);

            request
                .get('/songs/' + _id)
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json')
                .end(function(err, res) {
                    if (err) return done(err);

                    const song = JSON.parse(res.text);
                    song.title.should.be.exactly(updated_title);
                    song.desc.should.be.exactly(updated_desc);
                    song.favourite.should.be.exactly(true);
                    song.src.should.be.exactly("/music/"+song.filename);

                    done();
                });
        });

        it(`the updated song should be downloadable`, function(done) {

            this.test.title += " with GET "+updated_song.src;

            request
                .get(updated_song.src)
                .send()
                .expect(200)
                .expect('Content-Type', /audio/, 'it should respond with Content-Type: audio/mpeg')
                .expect('Content-Length', '4358') //TODO
                .end(done);

        });

        it('previous new song can no longer be downloaded', function(done) {

            this.test.title += " from " + newSong.src;

            request
                .get(newSong.src)
                .send()
                .expect(404, done)
        });

        let newID = '5f428bb8fa5445f1c9ee013b';

        it(`cannot create a new song given the id='${newID}' without uploading files`, function(done) {

            request
                .put('/songs/' + newID)
                .field("quality", Math.round(Math.random()*10))
                .field("desc", updated_desc)
                .field("favourite", true)
                .expect(anyStatus([400,404]))
                .end(done)

        });

        let newsng;

        it(`create a new song given the id='${newID}'`, function(done) {

            request
                .put('/songs/' + newID)
                .set('Accept', 'application/json')
                .field("title", song_desc)
                .field("desc", updated_desc)
                .field("favourite", true)
                .attach("file", __dirname + '/assets/three.mp3')
                .expect(anyStatus([201,302]))
                .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json')
                .end(function(err, res) {
                    if (err) return done(err);

                    const song = JSON.parse(res.text);
                    song.title.should.be.exactly(song_desc);
                    song.desc.should.be.exactly(updated_desc);
                    should(song.favourite).be.true();
                    song.src.should.be.exactly("/music/"+song.filename);

                    newsng = song;

                    done();
                });

        });

        it('new song should be downloaded', function(done) {

            this.test.title += " with GET "+newsng.src;

            request
                .get(newsng.src)
                .send()
                .expect(200)
                .expect('Content-Type', /audio/, 'it should respond with Content-Type: audio/mpeg')
                .expect('Content-Length', '4566') //TODO
                .end(done);
        });

        let songs;

        it('all listed songs should be downloadable', function(done) {

            request
                .get('/songs/')
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json')
                .end((err, res) => {
                    if (err) return done(err);

                    songs = JSON.parse(res.text);

                    this.test.title = `check current picture collection size (${songs.length} >= 2)`;

                    should(songs.length >= 2).be.true();
                    done();
                });
        });

        it('all listed songs should be downloadable', function(done) {

            let c = 0;
            let errors = [];

            songs.forEach(s=>{

                request
                    .get(s.src)
                    .send()
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            err.message += " during GET " + s.src + "\n";
                            errors.push(err);
                        }

                        c++;
                        if (c == songs.length) {
                            if (errors.length > 0) done(new Error(errors));
                            else done();
                        }

                    });
            }); //forEach
        });


        it(`cleanup newly put song`, function(done) {

            request
                .delete('/songs/' + newID)
                .send()
                .expect(204, done);

        });


        it(`newly put deleted song should no longer be downloadable`, function(done) {

            request
                .get(newsng.src)
                .send()
                .expect(404, done);

        });


        it('a random song cannot be put without a file upload ', function(done) {

            request
                .put('/songs/' + Math.random())
                .set('Accept', 'application/json')
                .send()
                .expect(anyStatus([400,404]))
                .end(done)
        });

    });



    describe('DELETE /songs/:id', function() {

        it(`the new song should be found before deleting it`, function(done) {

            explainTestTitle(this);

            request
                .get('/songs/' + _id)
                .send()
                .expect(200, done);
        });

        it('deleting the new song should make it gone', function(done) {

            explainTestTitle(this);

            request
                .delete('/songs/' + _id)
                .send()
                .expect(204, done);
        });

        it('the deleted new song should be not found ', function(done) {

            explainTestTitle(this);

            request
                .get('/songs/' + _id)
                .send()
                .expect(404, done);

        });

        it('the deleted updated new song should no longer be downloadable ', function(done) {

            request
                .get('/music/two.mp3')
                .send()
                .expect(404, done);
        });

        it('deleting the new song again should be not found ', function(done) {
            request
                .delete('/songs/' + _id)
                .send()
                .expect(404, done);
        });

        it('deleted new song should no longer be listed', function(done) {

            request
                .get('/songs/')
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json')
                .end((err, res) => {
                    if (err) return done(err);

                    explainTestTitle(this);

                    const songs = JSON.parse(res.text);

                    songs.map((o) => o._id).should.not.containEql(_id);
                    let newSong = songs.find((o) => o._id == _id);
                    should(newSong).be.undefined;

                    initialSize.should.be.equal(songs.length, 'the song collection size should shrink back to the original one');

                    done();
                });
        });
    });

});