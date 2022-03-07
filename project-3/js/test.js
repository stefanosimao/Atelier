describe('Task 1', function() {
    describe('group_by', function() {

        it('missing key should be grouped under undefined', function() {

            let data = [{ "a": "a42", "b": "b42" }, { "a": "a41", "b": "b41" }, { "a": "a42", "b": "b41" }];

            let result = group_by(data, "c");

            should(result[undefined].length).be.equal(3);

            result[undefined].should.containEql(data[0]);
            result[undefined].should.containEql(data[1]);
            result[undefined].should.containEql(data[2]);

        });

        it('should contain the right values', function() {

            let data = [{ "a": "a42", "b": "b42" }, { "a": "a41", "b": "b41" }, { "a": "a42", "b": "b41" }];

            let result = group_by(data, "a");

            result["a42"].should.containEql({ "a": "a42", "b": "b42" });
            result["a42"].should.containEql({ "a": "a42", "b": "b41" });
            result["a42"].should.not.containEql({ "a": "a41", "b": "b42" });
            result["a42"].should.not.containEql({ "a": "a41", "b": "b41" });

            result["a41"].should.not.containEql({ "a": "a42", "b": "b42" });
            result["a41"].should.not.containEql({ "a": "a42", "b": "b41" });
            result["a41"].should.not.containEql({ "a": "a41", "b": "b42" });
            result["a41"].should.containEql({ "a": "a41", "b": "b41" });

            result = group_by(data, "b");

            result["b42"].should.containEql({ "a": "a42", "b": "b42" });
            result["b42"].should.not.containEql({ "a": "a42", "b": "b41" });
            result["b42"].should.not.containEql({ "a": "a41", "b": "b42" });
            result["b42"].should.not.containEql({ "a": "a41", "b": "b41" });

            result["b41"].should.not.containEql({ "a": "a42", "b": "b42" });
            result["b41"].should.containEql({ "a": "a42", "b": "b41" });
            result["b41"].should.not.containEql({ "a": "a41", "b": "b42" });
            result["b41"].should.containEql({ "a": "a41", "b": "b41" });

        });
        it('should contain the right keys', function() {

            let data = [{ "a": "a42", "b": "b42" }, { "a": "a41", "b": "b41" }, { "a": "a42", "b": "b41" }];

            let result = group_by(data, "a");

            should(Object.keys(result).length).be.equal(2);

            result.should.have.keys("a42", "a41");
            result.should.not.have.keys("b42", "b41");

            result = group_by(data, "b");

            result.should.not.have.keys("a42", "a41");
            result.should.have.keys("b42", "b41");

        });

        it('objects should be indexed without copying them', function() {

            let o1 = { "a": "a42", "b": "b42" };
            let o2 = { "a": "a41", "b": "b41" };
            let o3 = { "a": "a42", "b": "b41" };

            let data = [o1, o2, o3];

            let result = group_by(data, "c");

            should(result[undefined].length).be.equal(3);

            result[undefined].should.containEql(data[0]);
            result[undefined].should.containEql(data[1]);
            result[undefined].should.containEql(data[2]);

            result[undefined].should.containEql(o1);
            result[undefined].should.containEql(o2);
            result[undefined].should.containEql(o3);

            o1.c = "extra";
            o2.d = "extra";
            o3.e = "extra";

            result[undefined].should.containEql(o1);
            result[undefined].should.containEql(o2);
            result[undefined].should.containEql(o3);

        });
    });

    describe('find_by', function() {
        it('single field', function() {

            let data = [{ "a": "a42", "b": "b42" }, { "a": "a41", "b": "b41" }, { "a": "a42", "b": "b41" }];

            let result = find_by(data, { "b": "b42" });

            should(Array.isArray(result)).be.ok();

            result.length.should.be.equal(1);

            result.should.containEql({ "a": "a42", "b": "b42" });

            result = find_by(data, { "a": "a42" });

            should(Array.isArray(result)).be.ok();

            result.length.should.be.equal(2);

            result.should.containEql({ "a": "a42", "b": "b42" });
            result.should.containEql({ "a": "a42", "b": "b41" });
            result.should.not.containEql({ "a": "a41", "b": "b41" });

        });
        it('two fields', function() {

            let data = [{ "a": "a42", "b": "b42", "c": "c42" }, { "a": "a41", "b": "b41", "c": "c42" }, { "a": "a42", "b": "b41", "c": "c43" }];

            let result = find_by(data, { "a": "a42", "b": "b42" });

            should(Array.isArray(result)).be.ok();

            result.length.should.be.equal(1);

            result.should.containEql({ "a": "a42", "b": "b42", "c": "c42" });
            result.should.not.containEql({ "a": "a42", "b": "b41", "c": "c43" });
            result.should.not.containEql({ "a": "a41", "b": "b41", "c": "c42" });

            result = find_by(data, { "b": "b41", "c": "c42" });

            should(Array.isArray(result)).be.ok();

            result.length.should.be.equal(1);

            result.should.not.containEql({ "a": "a42", "b": "b42", "c": "c42" });
            result.should.not.containEql({ "a": "a42", "b": "b41", "c": "c43" });
            result.should.containEql({ "a": "a41", "b": "b41", "c": "c42" });


            result = find_by(data, { "x": "x41", "c": "c42" });

            should(Array.isArray(result)).be.ok();

            result.length.should.be.equal(0);

        });
        it('three fields', function() {

            let data = [{ "a": "a42", "b": "b42", "c": "c42" }, { "a": "a41", "b": "b41", "c": "c42" }, { "a": "a42", "b": "b41", "c": "c43" }];

            let result = find_by(data, { "a": "a42", "b": "b42", "c": "c42" });

            should(Array.isArray(result)).be.ok();

            result.length.should.be.equal(1);

            result.should.containEql({ "a": "a42", "b": "b42", "c": "c42" });
            result.should.not.containEql({ "a": "a42", "b": "b41", "c": "c43" });
            result.should.not.containEql({ "a": "a41", "b": "b41", "c": "c42" });

            result = find_by(data, { "a": "a41", "b": "b41", "c": "c42" });

            should(Array.isArray(result)).be.ok();

            result.length.should.be.equal(1);

            result.should.not.containEql({ "a": "a42", "b": "b42", "c": "c42" });
            result.should.not.containEql({ "a": "a42", "b": "b41", "c": "c43" });
            result.should.containEql({ "a": "a41", "b": "b41", "c": "c42" });


            result = find_by(data, { "x": "x41", "b": "b40", "c": "c42" });

            should(Array.isArray(result)).be.ok();

            result.length.should.be.equal(0);

        });
        it('undefined fields', function() {

            let data = [{ "a": "a42", "b": "b42", "c": "c42" }, { "a": "a41", "b": "b41", "c": "c42" }, { "a": "a42", "b": "b41", "c": "c43" }];

            let result = find_by(data, { "a": "a42", "b": undefined, "c": undefined });

            should(Array.isArray(result)).be.ok();

            result.length.should.be.equal(2);

            result.should.containEql({ "a": "a42", "b": "b42", "c": "c42" });
            result.should.containEql({ "a": "a42", "b": "b41", "c": "c43" });
            result.should.not.containEql({ "a": "a41", "b": "b41", "c": "c42" });

            result = find_by(data, { "a": undefined, "b": undefined, "c": undefined });

            should(Array.isArray(result)).be.ok();

            result.length.should.be.equal(3);

            result.should.containEql({ "a": "a42", "b": "b42", "c": "c42" });
            result.should.containEql({ "a": "a42", "b": "b41", "c": "c43" });
            result.should.containEql({ "a": "a41", "b": "b41", "c": "c42" });

            result = find_by(data, { });

            result.length.should.be.equal(3);

            result.should.containEql({ "a": "a42", "b": "b42", "c": "c42" });
            result.should.containEql({ "a": "a42", "b": "b41", "c": "c43" });
            result.should.containEql({ "a": "a41", "b": "b41", "c": "c42" });

        });
        it('null fields', function() {

            let data = [{ "a": "a42", "b": "b42", "c": "c42" }, { "a": "a41", "b": "b41", "c": "c42" }, { "a": "a42", "b": "b41", "c": "c43" }];

            let result = find_by(data, { "a": "a42", "b": null, "c": null });

            should(Array.isArray(result)).be.ok();

            result.length.should.be.equal(2);

            result.should.containEql({ "a": "a42", "b": "b42", "c": "c42" });
            result.should.containEql({ "a": "a42", "b": "b41", "c": "c43" });
            result.should.not.containEql({ "a": "a41", "b": "b41", "c": "c42" });

            result = find_by(data, { "a": null, "b": null, "c": null });

            should(Array.isArray(result)).be.ok();

            result.length.should.be.equal(3);

            result.should.containEql({ "a": "a42", "b": "b42", "c": "c42" });
            result.should.containEql({ "a": "a42", "b": "b41", "c": "c43" });
            result.should.containEql({ "a": "a41", "b": "b41", "c": "c42" });

            result = find_by(data, { });

            result.length.should.be.equal(3);

            result.should.containEql({ "a": "a42", "b": "b42", "c": "c42" });
            result.should.containEql({ "a": "a42", "b": "b41", "c": "c43" });
            result.should.containEql({ "a": "a41", "b": "b41", "c": "c42" });

        });
    });
});

describe('Task 5', function() {
    describe('Playlist Object', function() {

        it('checking methods', function() {

            let pl = new Playlist([]);

            should(pl.toJSON).be.Function();
            should(pl.load).be.Function();
            should(pl.next).be.Function();
            should(pl.prev).be.Function();
            should(pl.appendSong).be.Function();
            should(pl.toHTML).be.Function();

        });

        it('checking fields defaults', function() {

            let pl = new Playlist([]);

            should(pl.repeat).be.false();
            should(pl.index).be.equal(0);
            should(pl.songs.length).be.equal(0);
            should(pl.songs).be.Array();

        });
    });
    describe('playlist advancement', function() {
        it('next without repeat', function() {

            let pl = new Playlist(["music/one.mp3","music/two.mp3","music/three.mp3"]);

            should(pl.next()).be.equal("music/two.mp3");
            should(pl.next()).be.equal("music/three.mp3");
            should(pl.next()).be.equal(undefined);
            should(pl.next()).be.equal(undefined);

        });
        it('next with repeat', function() {

            let pl = new Playlist(["music/one.mp3","music/two.mp3","music/three.mp3"], true);

            should(pl.next()).be.equal("music/two.mp3");
            should(pl.next()).be.equal("music/three.mp3");
            should(pl.next()).be.equal("music/one.mp3");
            should(pl.next()).be.equal("music/two.mp3");
            should(pl.next()).be.equal("music/three.mp3");

        });

        it('prev without repeat', function() {

            let pl = new Playlist(["music/one.mp3","music/two.mp3","music/three.mp3"]);

            should(pl.prev()).be.equal(undefined);
            should(pl.prev()).be.equal(undefined);

            should(pl.next()).be.equal("music/one.mp3");
            should(pl.next()).be.equal("music/two.mp3");
            should(pl.next()).be.equal("music/three.mp3");
            should(pl.prev()).be.equal("music/two.mp3");
            should(pl.prev()).be.equal("music/one.mp3");
            should(pl.prev()).be.equal(undefined);

        });

        it('prev with repeat', function() {

            let pl = new Playlist(["music/one.mp3","music/two.mp3","music/three.mp3"], true);

            should(pl.prev()).be.equal("music/three.mp3");
            should(pl.prev()).be.equal("music/two.mp3");
            should(pl.prev()).be.equal("music/one.mp3");
            should(pl.prev()).be.equal("music/three.mp3");
            should(pl.prev()).be.equal("music/two.mp3");
            should(pl.prev()).be.equal("music/one.mp3");

        });

        it('next prev mix', function() {

            let pl = new Playlist(["music/one.mp3","music/two.mp3","music/three.mp3"]);

            should(pl.next()).be.equal("music/two.mp3");
            should(pl.prev()).be.equal("music/one.mp3");
            should(pl.next()).be.equal("music/two.mp3");
            should(pl.prev()).be.equal("music/one.mp3");
            should(pl.next()).be.equal("music/two.mp3");
            should(pl.next()).be.equal("music/three.mp3");
            should(pl.prev()).be.equal("music/two.mp3");
            should(pl.next()).be.equal("music/three.mp3");

        });

        it('next mix with repeat change', function() {

            let pl = new Playlist(["music/one.mp3","music/two.mp3","music/three.mp3"]);

            pl.repeat = false;

            should(pl.next()).be.equal("music/two.mp3");
            should(pl.next()).be.equal("music/three.mp3");
            should(pl.next()).be.equal(undefined);

            pl.repeat = true;

            should(pl.next()).be.equal("music/one.mp3");
            should(pl.next()).be.equal("music/two.mp3");
            should(pl.next()).be.equal("music/three.mp3");
            should(pl.next()).be.equal("music/one.mp3");
            should(pl.next()).be.equal("music/two.mp3");
            should(pl.next()).be.equal("music/three.mp3");


        });
    });

    describe('playlist JSON serialization', function() {

        it('save', function() {

            let pl = new Playlist(["music/one.mp3","music/two.mp3","music/three.mp3"]);

            let json = pl.toJSON();

            should(JSON.parse(json)).not.throw();

            let o = JSON.parse(json);

            should(o.songs).be.Array();
            should(o.songs.length).be.equal(3);
            should(o.songs).containEql("music/one.mp3");
            should(o.songs).containEql("music/two.mp3");
            should(o.songs).containEql("music/three.mp3");
            should(o.index).be.equal(0);
            should(o.repeat).be.equal(false);


        });
        it('load', function() {

            let pl = new Playlist(["music/one.mp3","music/two.mp3","music/three.mp3"], true);

            pl.next();

            let json = pl.toJSON();

            let pl1 = new Playlist();

            pl1.load(json);

            should(pl1.index).be.equal(pl.index);
            should(pl1.repeat).be.equal(pl.repeat);
            should(pl1.songs.length).be.equal(pl.songs.length);

            pl.songs.forEach((s,i)=>{
                should(pl1.songs[i]).be.equal(pl.songs[i]);
            })

        });

        it('fail silently when loading garbage', function() {

            let pl1 = new Playlist();

            should(pl1.load("this string is NOT json")).not.throw();

        });

        it('preserve existing state when loading garbage', function() {

            let pl1 = new Playlist(["music/one.mp3"],true);

            should(pl1.load("this string is NOT json")).not.throw();

            should(pl1.songs.length).be.equal(1);
            should(pl1.index).be.equal(0);
            should(pl1.songs).be.containEql("music/one.mp3");
            should(pl1.repeat).be.true();

        });

        it('preserve existing state when loading invalid JSON', function() {

            let pl1 = new Playlist(["music/one.mp3"],true);

            should(pl1.load('{"json": true}')).not.throw();

            should(pl1.songs.length).be.equal(1);
            should(pl1.index).be.equal(0);
            should(pl1.songs).be.containEql("music/one.mp3");
            should(pl1.repeat).be.true();

        });

    });


    describe('playlist append', function() {

        it('append', function() {

            let pl = new Playlist(["music/one.mp3"], true);

            should(pl.songs.length).be.equal(1);

            pl.appendSong("music/two.mp3");

            should(pl.songs.length).be.equal(2);

            pl.appendSong("music/three.mp3");

            should(pl.songs.length).be.equal(3);

        });

        it('append should not affect position', function() {

            let pl = new Playlist(["music/one.mp3"], true);

            should(pl.songs.length).be.equal(1);
            should(pl.index).be.equal(0);

            pl.appendSong("music/two.mp3");

            should(pl.songs.length).be.equal(2);
            should(pl.index).be.equal(0);

            pl.appendSong("music/three.mp3");

            should(pl.songs.length).be.equal(3);
            should(pl.index).be.equal(0);

            should(pl.next()).be.equal("music/two.mp3");
            should(pl.next()).be.equal("music/three.mp3");
            should(pl.next()).be.equal("music/one.mp3")

        });

    });

});