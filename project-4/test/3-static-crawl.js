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

    describe("crawling the song links", function () {

        before(function (done) {
            let attempts = 0;

            function check() {
                if (fs.existsSync("./test/static/")) {
                    done();
                } else {
                    console.log("Waiting for static folder");
                    attempts++;
                    if (attempts < 10) {
                        setTimeout(check, 500);
                    } else {
                        throw "Missing ./test/static/ folder";
                    }
                }
            }

            check();
        });


        describe("crawling", function () {

            let slideshow_path = "./test/static/";
            let dest = fs.readdirSync(slideshow_path).filter(f => f.endsWith(".html"));

            function check_html_links(html, i) {

                let page = fs.readFileSync(slideshow_path + html);
                const $ = cheerio.load(page);
                const links = Array.from($("a").map((i, a) => $(a).attr('href')));

                if (html == "index.html") {

                    it(`${html} should link to songs-artist-pentatonix.html `, function () {
                        links.some(l => l.endsWith("songs-artist-pentatonix.html")).should.be.true();
                    });
                    it(`${html} should link to songs-artist-tessa.html `, function () {
                        links.some(l => l.endsWith("songs-artist-tessa.html")).should.be.true();
                    });
                    it(`${html} should link to songs-artist-alex.html `, function () {
                        links.some(l => l.endsWith("songs-artist-alex.html")).should.be.true();
                    });
                    it(`${html} should link to songs-artist-moira.html `, function () {
                        links.some(l => l.endsWith("songs-artist-moira.html")).should.be.true();
                    });
                    it(`${html} should link to songs-artist-samantha.html `, function () {
                        links.some(l => l.endsWith("songs-artist-samantha.html")).should.be.true();
                    });
                    it(`${html} should link to songs-artist-renée fleming.html `, function () {
                        links.some(l => l.endsWith("songs-artist-renée fleming.html")).should.be.true();
                    });
                    it(`${html} should link to songs-artist-marion cotillard.html `, function () {
                        links.some(l => l.endsWith("songs-artist-marion cotillard.html")).should.be.true();
                    });
                    it(`${html} should link to songs-genre-pop.html `, function () {
                        links.some(l => l.endsWith("songs-genre-pop.html")).should.be.true();
                    });
                    it(`${html} should link to songs-genre-vocal.html `, function () {
                        links.some(l => l.endsWith("songs-genre-vocal.html")).should.be.true();
                    });
                    it(`${html} should link to songs-genre-opera.html `, function () {
                        links.some(l => l.endsWith("songs-genre-opera.html")).should.be.true();
                    });

                } else {

                    if (html == "songs.html") {

                        //with links pointing to the song tables for each genre of the collection.

                        it(`${html} should link to songs-genre-pop.html `, function () {
                            links.some(l => l.endsWith("songs-genre-pop.html")).should.be.true();
                        });
                        it(`${html} should link to songs-genre-vocal.html `, function () {
                            links.some(l => l.endsWith("songs-genre-vocal.html")).should.be.true();
                        });
                        it(`${html} should link to songs-genre-opera.html `, function () {
                            links.some(l => l.endsWith("songs-genre-opera.html")).should.be.true();
                        });

                    }


                    if (html.endsWith("-genre-pop.html")) {

                        //with links to the song tables pages which list the songs of the artists of the particular genre

                        it(`${html} should link to songs-artist-pentatonix.html `, function () {
                            links.some(l => l.endsWith("songs-artist-pentatonix.html")).should.be.true();
                        });


                    }

                    if (html.endsWith("-genre-vocal.html")) {

                        //with links to the song tables pages which list the songs of the artists of the particular genre

                        it(`${html} should link to songs-artist-tessa.html `, function () {
                            links.some(l => l.endsWith("songs-artist-tessa.html")).should.be.true();
                        });


                        it(`${html} should link to songs-artist-alex.html `, function () {
                            links.some(l => l.endsWith("songs-artist-alex.html")).should.be.true();
                        });


                        it(`${html} should link to songs-artist-moira.html `, function () {
                            links.some(l => l.endsWith("songs-artist-moira.html")).should.be.true();
                        });


                        it(`${html} should link to songs-artist-samantha.html `, function () {
                            links.some(l => l.endsWith("songs-artist-samantha.html")).should.be.true();
                        });


                        it(`${html} should link to songs-artist-marion cotillard.html `, function () {
                            links.some(l => l.endsWith("songs-artist-marion cotillard.html")).should.be.true();
                        });


                    }

                    if (html.endsWith("-genre-opera.html")) {

                        //with links to the song tables pages which list the songs of the artists of the particular genre

                        it(`${html} should link to songs-artist-renée fleming.html `, function () {
                            links.some(l => l.endsWith("songs-artist-renée fleming.html")).should.be.true();
                        });


                    }


                    if (html.endsWith("-artist-pentatonix.html")) {

                        //with links to the song tables pages which list the albums of the artists

                        it(`${html} should link to songs-album-numbers.html `, function () {
                            links.some(l => l.endsWith("songs-album-numbers.html")).should.be.true();
                        });


                    }

                    if (html.endsWith("-artist-tessa.html")) {

                        //with links to the song tables pages which list the albums of the artists

                        it(`${html} should link to songs-album-numbers.html `, function () {
                            links.some(l => l.endsWith("songs-album-numbers.html")).should.be.true();
                        });


                    }

                    if (html.endsWith("-artist-alex.html")) {

                        //with links to the song tables pages which list the albums of the artists

                        it(`${html} should link to songs-album-numbers.html `, function () {
                            links.some(l => l.endsWith("songs-album-numbers.html")).should.be.true();
                        });


                    }

                    if (html.endsWith("-artist-moira.html")) {

                        //with links to the song tables pages which list the albums of the artists

                        it(`${html} should link to songs-album-numbers.html `, function () {
                            links.some(l => l.endsWith("songs-album-numbers.html")).should.be.true();
                        });


                    }

                    if (html.endsWith("-artist-samantha.html")) {

                        //with links to the song tables pages which list the albums of the artists

                        it(`${html} should link to songs-album-numbers.html `, function () {
                            links.some(l => l.endsWith("songs-album-numbers.html")).should.be.true();
                        });


                    }

                    if (html.endsWith("-artist-renée fleming.html")) {

                        //with links to the song tables pages which list the albums of the artists

                        it(`${html} should link to songs-album-numbers.html `, function () {
                            links.some(l => l.endsWith("songs-album-numbers.html")).should.be.true();
                        });


                    }

                    if (html.endsWith("-artist-marion cotillard.html")) {

                        //with links to the song tables pages which list the albums of the artists

                        it(`${html} should link to songs-album-numbers.html `, function () {
                            links.some(l => l.endsWith("songs-album-numbers.html")).should.be.true();
                        });


                    }

                    it(`${html} should link to homepage index.html or /`, function () {
                        links.some(l => l.endsWith("index.html") || l == "/").should.be.true();
                    });

                }

            }

            dest.forEach(check_html_links)

        });
    });
});