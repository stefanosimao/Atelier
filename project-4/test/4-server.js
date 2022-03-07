const should = require('should');
const request = require('supertest')("http://localhost:8888");
const cheerio = require('cheerio');
const child_process = require('child_process');
const fs = require('fs-extra');

function run(cmd, cwd, done) {

    console.log(cmd);

    const exec = child_process.exec;
    return exec(cmd, { cwd }, (err, stdout, stderr) => {

            fs.writeFile("./server.log", `${cmd}

---- stdout ----

${stdout}

---- stderr ----

${stderr}

---- error ----

${err && err.message}

Note: the "Command failed" error is expected
      because the test will kill the server at the end`);

            if (typeof done == "function") {
                done(err, stdout, stderr);
            }
        //}
    });

}

describe('Task 3: Testing Web Server', function() {

    let mp3_links = [];

    before("start web server", function(done) {
        this.server_proc = run("node index.js ./test/static", __dirname + "/..");
        setTimeout(done, 1000); //wait for the server to start
    })

    describe('./test/static should exist', function() {
        it('./test/static should exist so the web server can read from it', function() {
            (function(){ fs.readdirSync("./test/static") }).should.not.throw();
        });
    });

    describe('GET /', function() {

        it('GET / redirects to index.html', function(done) {

            request
                .get('/')
                .send()
                .expect(302)
                .end(done);

        });

    });

    describe('GET .html requests', function() {

        function findDiff(str1, str2) {
            let diff = "";
            str2.split('').forEach(function(val, i) {
                if (val != str1.charAt(i))
                    diff += val;
            });
            return diff;
        }


        it('GET /index.html matches content of ./test/static/index.html file', function(done) {

            request
                .get('/index.html')
                .send()
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    else {

                        let html = new String(fs.readFileSync("./test/static/index.html"));

                        let web = new String(res.text);

                        let diff = findDiff(html, web);

                        should(diff).be.equal("");
                        should(html.length).be.equal(web.length);

                        //look for the <audio src></audio> links
                        const $ = cheerio.load(res.text);
                        mp3_links = Array.from($("audio").map((i, a) => $(a).attr('src')));

                        if (mp3_links.length == 0) return done();

                        let c = 0;
                        let errors = [];

                        //check that the server returns the mp3 files linked from the page
                        mp3_links.forEach(mp3 => {

                            let url = ("/" + mp3).replace("//","/");

                            console.log("GET " + url);

                            request
                                .get(url)
                                .send()
                                .expect(200)
                                .end((err, res) => {
                                    if (err) {
                                        err.message += " during GET /" + mp3 + "\n";
                                        errors.push(err);
                                    }

                                    c++;
                                    if (c == mp3_links.length) {
                                        if (errors.length > 0) done(new Error(errors));
                                        else done();
                                    }

                                });

                        });

                    }
                });

        });


        it('GET /songs.html matches content of ./test/static/songs.html file', function(done) {

            request
                .get('/songs.html')
                .send()
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    else {

                        let html = new String(fs.readFileSync("./test/static/songs.html"));

                        let web = new String(res.text);

                        let diff = findDiff(html, web);

                        should(diff).be.equal("");
                        should(html.length).be.equal(web.length);

                        //look for the <audio src></audio> links
                        const $ = cheerio.load(res.text);
                        mp3_links = Array.from($("audio").map((i, a) => $(a).attr('src')));

                        if (mp3_links.length == 0) return done();

                        let c = 0;
                        let errors = [];

                        //check that the server returns the mp3 files linked from the page
                        mp3_links.forEach(mp3 => {

                            let url = ("/" + mp3).replace("//","/");

                            console.log("GET " + url);

                            request
                                .get(url)
                                .send()
                                .expect(200)
                                .end((err, res) => {
                                    if (err) {
                                        err.message += " during GET /" + mp3 + "\n";
                                        errors.push(err);
                                    }

                                    c++;
                                    if (c == mp3_links.length) {
                                        if (errors.length > 0) done(new Error(errors));
                                        else done();
                                    }

                                });

                        });

                    }
                });

        });


        it('GET /songs-album-numbers.html matches content of ./test/static/songs-album-numbers.html file', function(done) {

            request
                .get('/songs-album-numbers.html')
                .send()
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    else {

                        let html = new String(fs.readFileSync("./test/static/songs-album-numbers.html"));

                        let web = new String(res.text);

                        let diff = findDiff(html, web);

                        should(diff).be.equal("");
                        should(html.length).be.equal(web.length);

                        //look for the <audio src></audio> links
                        const $ = cheerio.load(res.text);
                        mp3_links = Array.from($("audio").map((i, a) => $(a).attr('src')));

                        if (mp3_links.length == 0) return done();

                        let c = 0;
                        let errors = [];

                        //check that the server returns the mp3 files linked from the page
                        mp3_links.forEach(mp3 => {

                            let url = ("/" + mp3).replace("//","/");

                            console.log("GET " + url);

                            request
                                .get(url)
                                .send()
                                .expect(200)
                                .end((err, res) => {
                                    if (err) {
                                        err.message += " during GET /" + mp3 + "\n";
                                        errors.push(err);
                                    }

                                    c++;
                                    if (c == mp3_links.length) {
                                        if (errors.length > 0) done(new Error(errors));
                                        else done();
                                    }

                                });

                        });

                    }
                });

        });


        it('GET /songs-artist-tessa.html matches content of ./test/static/songs-artist-tessa.html file', function(done) {

            request
                .get('/songs-artist-tessa.html')
                .send()
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    else {

                        let html = new String(fs.readFileSync("./test/static/songs-artist-tessa.html"));

                        let web = new String(res.text);

                        let diff = findDiff(html, web);

                        should(diff).be.equal("");
                        should(html.length).be.equal(web.length);

                        //look for the <audio src></audio> links
                        const $ = cheerio.load(res.text);
                        mp3_links = Array.from($("audio").map((i, a) => $(a).attr('src')));

                        if (mp3_links.length == 0) return done();

                        let c = 0;
                        let errors = [];

                        //check that the server returns the mp3 files linked from the page
                        mp3_links.forEach(mp3 => {

                            let url = ("/" + mp3).replace("//","/");

                            console.log("GET " + url);

                            request
                                .get(url)
                                .send()
                                .expect(200)
                                .end((err, res) => {
                                    if (err) {
                                        err.message += " during GET /" + mp3 + "\n";
                                        errors.push(err);
                                    }

                                    c++;
                                    if (c == mp3_links.length) {
                                        if (errors.length > 0) done(new Error(errors));
                                        else done();
                                    }

                                });

                        });

                    }
                });

        });


        it('GET /songs-artist-alex.html matches content of ./test/static/songs-artist-alex.html file', function(done) {

            request
                .get('/songs-artist-alex.html')
                .send()
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    else {

                        let html = new String(fs.readFileSync("./test/static/songs-artist-alex.html"));

                        let web = new String(res.text);

                        let diff = findDiff(html, web);

                        should(diff).be.equal("");
                        should(html.length).be.equal(web.length);

                        //look for the <audio src></audio> links
                        const $ = cheerio.load(res.text);
                        mp3_links = Array.from($("audio").map((i, a) => $(a).attr('src')));

                        if (mp3_links.length == 0) return done();

                        let c = 0;
                        let errors = [];

                        //check that the server returns the mp3 files linked from the page
                        mp3_links.forEach(mp3 => {

                            let url = ("/" + mp3).replace("//","/");

                            console.log("GET " + url);

                            request
                                .get(url)
                                .send()
                                .expect(200)
                                .end((err, res) => {
                                    if (err) {
                                        err.message += " during GET /" + mp3 + "\n";
                                        errors.push(err);
                                    }

                                    c++;
                                    if (c == mp3_links.length) {
                                        if (errors.length > 0) done(new Error(errors));
                                        else done();
                                    }

                                });

                        });

                    }
                });

        });


        it('GET /songs-genre-opera.html matches content of ./test/static/songs-genre-opera.html file', function(done) {

            request
                .get('/songs-genre-opera.html')
                .send()
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    else {

                        let html = new String(fs.readFileSync("./test/static/songs-genre-opera.html"));

                        let web = new String(res.text);

                        let diff = findDiff(html, web);

                        should(diff).be.equal("");
                        should(html.length).be.equal(web.length);

                        //look for the <audio src></audio> links
                        const $ = cheerio.load(res.text);
                        mp3_links = Array.from($("audio").map((i, a) => $(a).attr('src')));

                        if (mp3_links.length == 0) return done();

                        let c = 0;
                        let errors = [];

                        //check that the server returns the mp3 files linked from the page
                        mp3_links.forEach(mp3 => {

                            let url = ("/" + mp3).replace("//","/");

                            console.log("GET " + url);

                            request
                                .get(url)
                                .send()
                                .expect(200)
                                .end((err, res) => {
                                    if (err) {
                                        err.message += " during GET /" + mp3 + "\n";
                                        errors.push(err);
                                    }

                                    c++;
                                    if (c == mp3_links.length) {
                                        if (errors.length > 0) done(new Error(errors));
                                        else done();
                                    }

                                });

                        });

                    }
                });

        });


        it('GET /songs-artist-marion cotillard.html matches content of ./test/static/songs-artist-marion cotillard.html file', function(done) {

            request
                .get('/songs-artist-marion cotillard.html')
                .send()
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    else {

                        let html = new String(fs.readFileSync("./test/static/songs-artist-marion cotillard.html"));

                        let web = new String(res.text);

                        let diff = findDiff(html, web);

                        should(diff).be.equal("");
                        should(html.length).be.equal(web.length);

                        //look for the <audio src></audio> links
                        const $ = cheerio.load(res.text);
                        mp3_links = Array.from($("audio").map((i, a) => $(a).attr('src')));

                        if (mp3_links.length == 0) return done();

                        let c = 0;
                        let errors = [];

                        //check that the server returns the mp3 files linked from the page
                        mp3_links.forEach(mp3 => {

                            let url = ("/" + mp3).replace("//","/");

                            console.log("GET " + url);

                            request
                                .get(url)
                                .send()
                                .expect(200)
                                .end((err, res) => {
                                    if (err) {
                                        err.message += " during GET /" + mp3 + "\n";
                                        errors.push(err);
                                    }

                                    c++;
                                    if (c == mp3_links.length) {
                                        if (errors.length > 0) done(new Error(errors));
                                        else done();
                                    }

                                });

                        });

                    }
                });

        });


        it('GET /songs-genre-pop.html matches content of ./test/static/songs-genre-pop.html file', function(done) {

            request
                .get('/songs-genre-pop.html')
                .send()
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    else {

                        let html = new String(fs.readFileSync("./test/static/songs-genre-pop.html"));

                        let web = new String(res.text);

                        let diff = findDiff(html, web);

                        should(diff).be.equal("");
                        should(html.length).be.equal(web.length);

                        //look for the <audio src></audio> links
                        const $ = cheerio.load(res.text);
                        mp3_links = Array.from($("audio").map((i, a) => $(a).attr('src')));

                        if (mp3_links.length == 0) return done();

                        let c = 0;
                        let errors = [];

                        //check that the server returns the mp3 files linked from the page
                        mp3_links.forEach(mp3 => {

                            let url = ("/" + mp3).replace("//","/");

                            console.log("GET " + url);

                            request
                                .get(url)
                                .send()
                                .expect(200)
                                .end((err, res) => {
                                    if (err) {
                                        err.message += " during GET /" + mp3 + "\n";
                                        errors.push(err);
                                    }

                                    c++;
                                    if (c == mp3_links.length) {
                                        if (errors.length > 0) done(new Error(errors));
                                        else done();
                                    }

                                });

                        });

                    }
                });

        });


        it('GET /songs-artist-moira.html matches content of ./test/static/songs-artist-moira.html file', function(done) {

            request
                .get('/songs-artist-moira.html')
                .send()
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    else {

                        let html = new String(fs.readFileSync("./test/static/songs-artist-moira.html"));

                        let web = new String(res.text);

                        let diff = findDiff(html, web);

                        should(diff).be.equal("");
                        should(html.length).be.equal(web.length);

                        //look for the <audio src></audio> links
                        const $ = cheerio.load(res.text);
                        mp3_links = Array.from($("audio").map((i, a) => $(a).attr('src')));

                        if (mp3_links.length == 0) return done();

                        let c = 0;
                        let errors = [];

                        //check that the server returns the mp3 files linked from the page
                        mp3_links.forEach(mp3 => {

                            let url = ("/" + mp3).replace("//","/");

                            console.log("GET " + url);

                            request
                                .get(url)
                                .send()
                                .expect(200)
                                .end((err, res) => {
                                    if (err) {
                                        err.message += " during GET /" + mp3 + "\n";
                                        errors.push(err);
                                    }

                                    c++;
                                    if (c == mp3_links.length) {
                                        if (errors.length > 0) done(new Error(errors));
                                        else done();
                                    }

                                });

                        });

                    }
                });

        });


        it('GET /songs-genre-vocal.html matches content of ./test/static/songs-genre-vocal.html file', function(done) {

            request
                .get('/songs-genre-vocal.html')
                .send()
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    else {

                        let html = new String(fs.readFileSync("./test/static/songs-genre-vocal.html"));

                        let web = new String(res.text);

                        let diff = findDiff(html, web);

                        should(diff).be.equal("");
                        should(html.length).be.equal(web.length);

                        //look for the <audio src></audio> links
                        const $ = cheerio.load(res.text);
                        mp3_links = Array.from($("audio").map((i, a) => $(a).attr('src')));

                        if (mp3_links.length == 0) return done();

                        let c = 0;
                        let errors = [];

                        //check that the server returns the mp3 files linked from the page
                        mp3_links.forEach(mp3 => {

                            let url = ("/" + mp3).replace("//","/");

                            console.log("GET " + url);

                            request
                                .get(url)
                                .send()
                                .expect(200)
                                .end((err, res) => {
                                    if (err) {
                                        err.message += " during GET /" + mp3 + "\n";
                                        errors.push(err);
                                    }

                                    c++;
                                    if (c == mp3_links.length) {
                                        if (errors.length > 0) done(new Error(errors));
                                        else done();
                                    }

                                });

                        });

                    }
                });

        });


        it('GET /songs-artist-pentatonix.html matches content of ./test/static/songs-artist-pentatonix.html file', function(done) {

            request
                .get('/songs-artist-pentatonix.html')
                .send()
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    else {

                        let html = new String(fs.readFileSync("./test/static/songs-artist-pentatonix.html"));

                        let web = new String(res.text);

                        let diff = findDiff(html, web);

                        should(diff).be.equal("");
                        should(html.length).be.equal(web.length);

                        //look for the <audio src></audio> links
                        const $ = cheerio.load(res.text);
                        mp3_links = Array.from($("audio").map((i, a) => $(a).attr('src')));

                        if (mp3_links.length == 0) return done();

                        let c = 0;
                        let errors = [];

                        //check that the server returns the mp3 files linked from the page
                        mp3_links.forEach(mp3 => {

                            let url = ("/" + mp3).replace("//","/");

                            console.log("GET " + url);

                            request
                                .get(url)
                                .send()
                                .expect(200)
                                .end((err, res) => {
                                    if (err) {
                                        err.message += " during GET /" + mp3 + "\n";
                                        errors.push(err);
                                    }

                                    c++;
                                    if (c == mp3_links.length) {
                                        if (errors.length > 0) done(new Error(errors));
                                        else done();
                                    }

                                });

                        });

                    }
                });

        });


    });

    after("stop web server", function(done) {

        setTimeout(()=>{console.log("Attempting to stop the server"); this.server_proc.kill('SIGKILL'); done()}, 500);

    });

});