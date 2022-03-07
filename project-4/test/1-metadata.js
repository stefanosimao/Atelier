const should = require('should');
const fs = require('fs-extra');

const child_process = require('child_process');


function run(cmd, cwd, done) {

    console.log(cmd);

    const exec = child_process.exec;
    exec(cmd, {cwd}, (err, stdout, stderr) => {
        fs.writeFile("./metadata.log", `${cmd}

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


describe('Task 1: Testing Song Metadata Extractor', function() {

    describe('node metadata.js ./test/assets ./test/data.json', function() {

        before("cleanup", function() {
            let path = "./test/data.json";
            if( fs.existsSync( path ) ) fs.removeSync(path);
        })

        it("Input should exist, output should not", function() {

            (function(){ fs.readdirSync("./test/assets") }).should.not.throw();
            should(fs.readdirSync("./test/assets").length > 0).be.ok;
            (function(){ fs.readJSONSync("./test/data.json") }).should.throw();

        });

        it("output should exist after running", function(done) {

            run("node metadata.js ./test/assets ./test/data.json", __dirname+"/..", ()=>{
                (function(){ fs.readJSONSync("./test/data.json") }).should.not.throw();

                done();
            });

        });

        it("output Array should contain as many objects as there are .mp3 files listed in the input folder", function() {
            let src = fs.readdirSync("./test/assets");
            let data = fs.readJSONSync("./test/data.json")

            src=src.filter(f=>f.endsWith(".mp3"));

            src.length.should.be.equal(data.length);
        });

        fs.readdirSync("./test/assets").filter(f=>f.endsWith(".mp3")).forEach((i)=>{
            it(`song "${i}" should be listed`, function() {
                let data = fs.readJSONSync("./test/data.json")

                function check_if_object_contains_song(o) {
                    return (o.filename == i && o.src == "test/assets/" + i);
                }

                data.some(check_if_object_contains_song).should.be.true();

            });
        });

        fs.readdirSync("./test/assets").filter(f=>f.endsWith(".mp3")).forEach((i)=>{
            let {size} = fs.statSync("./test/assets/"+i);
            it(`song "${i}" should have size ${size}`, function() {
                let data = fs.readJSONSync("./test/data.json");
                should(data.find(x=>x.filename == i).size).be.equal(size);
            });
        });


[{"filename":"five.mp3","title":"Counting to twelve"},{"filename":"one.mp3","title":"One"},{"filename":"four.mp3","title":"Four"},{"filename":"three.mp3","title":"Three"},{"filename":"two.mp3","title":"Two"},{"filename":"six.mp3","title":"Six"},{"filename":"seven.mp3","title":"Seven"}].forEach(i=>{

    it(`song "${i.filename}" should have title "${i.title}"`, function() {
        let data = fs.readJSONSync("./test/data.json");
        should(data.find(x=>x.filename == i.filename).title).be.equal(i.title);
    });

}); //forEach


[{"filename":"five.mp3","artist":"Pentatonix"},{"filename":"one.mp3","artist":"Tessa"},{"filename":"four.mp3","artist":"Alex"},{"filename":"three.mp3","artist":"Moira"},{"filename":"two.mp3","artist":"Samantha"},{"filename":"six.mp3","artist":"Renée Fleming"},{"filename":"seven.mp3","artist":"Marion Cotillard"}].forEach(i=>{

    it(`song "${i.filename}" should have artist "${i.artist}"`, function() {
        let data = fs.readJSONSync("./test/data.json");
        should(data.find(x=>x.filename == i.filename).artist).be.equal(i.artist);
    });

}); //forEach


[{"filename":"five.mp3","genre":"Pop"},{"filename":"one.mp3","genre":"Vocal"},{"filename":"four.mp3","genre":"Vocal"},{"filename":"three.mp3","genre":"Vocal"},{"filename":"two.mp3","genre":"Vocal"},{"filename":"six.mp3","genre":"Opera"},{"filename":"seven.mp3","genre":"Vocal"}].forEach(i=>{

    it(`song "${i.filename}" should have genre "${i.genre}"`, function() {
        let data = fs.readJSONSync("./test/data.json");
        should(data.find(x=>x.filename == i.filename).genre).be.equal(i.genre);
    });

}); //forEach


[{"filename":"five.mp3","album":"Numbers"},{"filename":"one.mp3","album":"Numbers"},{"filename":"four.mp3","album":"Numbers"},{"filename":"three.mp3","album":"Numbers"},{"filename":"two.mp3","album":"Numbers"},{"filename":"six.mp3","album":"Numbers"},{"filename":"seven.mp3","album":"Numbers"}].forEach(i=>{

    it(`song "${i.filename}" should have album "${i.album}"`, function() {
        let data = fs.readJSONSync("./test/data.json");
        should(data.find(x=>x.filename == i.filename).album).be.equal(i.album);
    });

}); //forEach


    });

});