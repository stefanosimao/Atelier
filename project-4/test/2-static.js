const should = require('should');
const fs = require('fs-extra');
const cheerio = require('cheerio');
const child_process = require('child_process');



function run(cmd, cwd, done) {

    console.log(cmd);

    const exec = child_process.exec;
    exec(cmd, { cwd }, (err, stdout, stderr) => {
        fs.writeFile("./static.log", `${cmd}

---- stdout ----

${stdout}

---- stderr ----

${stderr}

---- error ----

${err && err.message}`);
        if (typeof done == "function") {
            done(err, stdout, stderr);
        }
    });

}


describe('Task 2: Testing Site Generator', function () {

    describe('node static.js ./test/data.json ./test/static', function () {

        before("cleanup", function () {
            fs.removeSync("./test/static");
        })

        it("Input should exist, output should not", function () {

            (function () { fs.readJSONSync("./test/data.json") }).should.not.throw();
            should(fs.readJSONSync("./test/data.json").length > 0).be.ok;
            (function () { fs.readdirSync("./test/static") }).should.throw();

        });

        it("Output should exist after running", function (done) {

            run("node static.js ./test/data.json ./test/static", __dirname + "/..", () => {
                (function () { fs.readdirSync("./test/static") }).should.not.throw();

                done();
            });

        });

        it("output folder should contain non-empty index.html", function () {
            let html = new String(fs.readFileSync("./test/static/index.html"));

            should(html.length > 0).be.true();
        });

        it("output folder should contain non-empty songs.html", function () {
            let html = new String(fs.readFileSync("./test/static/songs.html"));

            should(html.length > 0).be.true();
        });

        it("output folder should contain non-empty songs-artist-pentatonix.html", function () {
            let html = new String(fs.readFileSync("./test/static/songs-artist-pentatonix.html"));

            should(html.length > 0).be.true();
        });

        it("output folder should contain non-empty songs-artist-tessa.html", function () {
            let html = new String(fs.readFileSync("./test/static/songs-artist-tessa.html"));

            should(html.length > 0).be.true();
        });

        it("output folder should contain non-empty songs-artist-alex.html", function () {
            let html = new String(fs.readFileSync("./test/static/songs-artist-alex.html"));

            should(html.length > 0).be.true();
        });

        it("output folder should contain non-empty songs-artist-moira.html", function () {
            let html = new String(fs.readFileSync("./test/static/songs-artist-moira.html"));

            should(html.length > 0).be.true();
        });

        it("output folder should contain non-empty songs-artist-samantha.html", function () {
            let html = new String(fs.readFileSync("./test/static/songs-artist-samantha.html"));

            should(html.length > 0).be.true();
        });

        it("output folder should contain non-empty songs-artist-renée fleming.html", function () {
            let html = new String(fs.readFileSync("./test/static/songs-artist-renée fleming.html"));

            should(html.length > 0).be.true();
        });

        it("output folder should contain non-empty songs-artist-marion cotillard.html", function () {
            let html = new String(fs.readFileSync("./test/static/songs-artist-marion cotillard.html"));

            should(html.length > 0).be.true();
        });

        it("output folder should contain non-empty songs-genre-pop.html", function () {
            let html = new String(fs.readFileSync("./test/static/songs-genre-pop.html"));

            should(html.length > 0).be.true();
        });

        it("output folder should contain non-empty songs-genre-vocal.html", function () {
            let html = new String(fs.readFileSync("./test/static/songs-genre-vocal.html"));

            should(html.length > 0).be.true();
        });

        it("output folder should contain non-empty songs-genre-opera.html", function () {
            let html = new String(fs.readFileSync("./test/static/songs-genre-opera.html"));

            should(html.length > 0).be.true();
        });

        it("output folder should contain non-empty songs-album-numbers.html", function () {
            let html = new String(fs.readFileSync("./test/static/songs-album-numbers.html"));

            should(html.length > 0).be.true();
        });


    });

});
