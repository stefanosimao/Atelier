/**
 * Web Atelier 2021 3 - Object-Oriented JavaScript
 *
 * Student: Stefano Gonçalves Simao
 *
 */

/* *************************************************************** */
/* ** REPLACE THIS FILE WITH YOUR OWN script.js FROM EXERCISE 2 ** */
/* *************************************************************** */

/**
 * @param {number} s - A time as the number of seconds.
 * @return {string} A string which represents the number of minutes followed by the remaining seconds
 *  with the M:SS format. If the input value is negative, the resulting string should be in -M:SS format.
 * SS indicates that if the number of seconds is less than 10, it should be padded with a 0 character.
 */
function format_seconds(s) {
    if (typeof s != 'number' || Number.isNaN(s)) {
        return '?:??';
    }

    if (s == 0 || s == 00 || s < 1 && s > 0 || s > -1 && s < 0) {
        return '0:00';
    }

    if (s > 0) {
        var minutes = Math.trunc(s / 60);
        var seconds = Math.trunc(s % 60);
        if (seconds <= 9) {
            seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
    }

    if (s < 0) {
        var minutes = Math.abs(Math.trunc(s / 60));
        var seconds = Math.abs(Math.trunc(s % 60));
        if (seconds <= 9) {
            seconds = '0' + seconds;
        }
        return '-' + minutes + ':' + seconds;
    }
}


/**
 * @param {number[]} a - The array of numbers.
 * @param {number} c - The scalar multiplier.
 * @return {number[]} An array computed by multiplying each element of the input array `a`
 * with the input scalar value `c`.
 */

// 

function scalar_product(a, c) {
    if (!(a instanceof Array) || arguments.length == 1) {
        return undefined;
    }

    if (c == undefined) {
        return a
    }

    return a.map((x) => {
        return x * c
    });


}


/**
 * @param {number[]} a - The first array of numbers.
 * @param {number[]} b - The second array of numbers.
 * @return {number} A value computed by summing the products of each pair
 * of elements of its input arrays `a`, `b` in the same position.
 */
function inner_product(a, b) {
    if (!(a instanceof Array) ||
        !(b instanceof Array) ||
        a.length != b.length) {
        return undefined;
    }

    var sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += a[i] * b[i];

    }
    return sum;
}


/**
 * @param {array} a - The array.
 * @param {function} mapfn - The function for the map step.
 * @param {function} [reducefn= function(x,y) { return x+y; }] - The
 * function for the reduce step.
 * @param {string} [seed=""] - The accumulator for the reduce step.
 * @return {*} The reduced value after the map and reduce steps.
 */
function mapReduce(a, f, combine, seed) {

    if (!(a instanceof Array) || (typeof f !== 'function')) {
        return undefined;
    }


    if (typeof combine !== "undefined") {
        if (typeof combine !== 'function') {
            return undefined;
        }
    } else {
        function combine(a, b) {
            return a + b;
        }
    }

    if (typeof seed === "undefined") {
        return "";
    }



    return a.map(f).reduce(combine, seed);
}




/**
 * @param {integer} x - The first integer.
 * @param {integer} y - The second integer.
 * @param {integer} [step=1] - The value to add at each step.
 * @return {integer[]} An array containing numbers x, x+step, … last, where:
 *    - last equals x + n*step for some n,
 *    - last <= y < last + step if step > 0 and
 *    - last + step < y <= last if step < 0.
 */
function range(x, y, step) {
    if (step === undefined) {
        step = 1;
    }

    if (step === 0 || isNaN(x) || isNaN(y) ||
        typeof step !== "number" || typeof x !== "number" ||
        typeof y !== "number" || isNaN(step)) {
        return undefined;
    }

    var array = [];
    var last = x;
    var index = 0;
    if (x < y) {

        if (step > 0) {
            while (last <= y) {
                array[index] = last;
                last = last + step;
                index++;
            }
        } else if (step < 0) {
            return [];
        }

    } else if (x > y) {

        if (step > 0) {
            return [];
        }
        while (last >= y) {
            array[index] = last;
            last = last + step;
            index++;
        }
    } else if (x == y) {

        return [x];
    }
    return array;
}


/**
 * @param {number[]} a - The first array of numbers.
 * @param {number[]} b - The second array of numbers.
 * @return {number[]} An array with the elements found both in `a` and `b`.
 */
function array_intersect(a, b) {
    if (!(a instanceof Array) || !(b instanceof Array)) {
        return undefined;
    }

    let intersect = a.filter(x => b.includes(x));
    x => (x>3)
    let gt3 = a.filter(x => (x>3));
    return intersect;
}


/**
 * @param {number[]} a - The first array of numbers.
 * @param {number[]} b - The second array of numbers.
 * @return {number[]} An array with the elements found in `a` but not in `b`.
 */
function array_difference(a, b) {
    if (!(a instanceof Array) || !(b instanceof Array)) {
        return undefined;
    }

    let difference = a.filter(x => !(array_intersect(a, b).includes(x)));

    return difference;
}


//--------------------------------------------------------------------------------------
// Task 2
//--------------------------------------------------------------------------------------

/**
 * @param {number[]} a - The array over which to iterate.
 * @return {function} - call this function to retrieve the next element of the array. The function throws an error if called again after it reaches the last element.
 */
function iterator(a) {
    if (!(a instanceof Array)) {
        return undefined;
    }
    //local variable (outer function)
    var index = 0;

    //inner function
    return function next(b) {
        if (b == undefined) {
            if (index != a.length) {
                index++;
                return a[index - 1];
            } else {
                throw 'No more  values left in the array';
            }
        }

        if (b instanceof Array) {
            a = b;
            index = 0;
            return next;
        }

        if (typeof b === 'number') {
            index = index + b;
            return index;
        }
    }
}





//--------------------------------------------------------------------------------------
// Task 3
//--------------------------------------------------------------------------------------

/**
 * @param {dom} dom_audio - Reference to the `<audio>` element.
 * @param {URL[]} song_urls - An Array of song URLs, whose values can be passed to the <audio src> attribute.
 * @param {Boolean} volume - If true (default), initialize and show the volume control buttons.
 * @return {function} A function which can be called with a new `song_urls` Array to replace the current playlist.
 */
function init_player(dom_audio, song_urls, volume) {
    let nextS = iterator(song_urls);
    dom_audio.setAttribute('src', nextS());
    dom_audio.load();
    dom_audio.addEventListener('canplay', () => console.log("You can start listening"));

    function continuePlay() {
        if (dom_audio.ended) {
            nextSong(true);
            dom_audio.play();
        }
    }

    let index = 0;

    let songName = song_data.filter(x => {return x.src == song_urls[0];})[0].title;

    setTimeout(() => {
        //document.querySelector(".titleSong").innerText = dom_audio.src.substring(dom_audio.src.lastIndexOf('/') + 1, dom_audio.src.lastIndexOf('.'));
        document.querySelector(".titleSong").innerText = songName;
        document.querySelector("#slide").setAttribute('value', '75.0')
        dom_audio.volume = '0.75';
        document.querySelector("#file").setAttribute('max', dom_audio.duration);

        if (!volume) {
            document.querySelector("#loud").style.display = 'none';
            document.querySelector("#low").style.display = 'none';
            document.querySelector("#mute").style.display = 'none';
            document.querySelector("#slide").style.display = 'none';
        }
        dom_audio.addEventListener('volumechange', () => {
            document.querySelector("#slide").setAttribute('value', dom_audio.volume * 100);
            console.log(dom_audio.volume)
        });
        document.querySelector("#loud").addEventListener("click", () => {
            dom_audio.volume > 0.8 ? dom_audio.volume = 1.0 : dom_audio.volume += 0.2
        });
        document.querySelector("#low").addEventListener("click", () => {
            dom_audio.volume < 0.2 ? dom_audio.volume = 0.0 : dom_audio.volume -= 0.2
        });
        document.querySelector("#mute").addEventListener("click", () => {
            dom_audio.volume == 0.0 ? dom_audio.volume = 0.75 : dom_audio.volume = 0.0
        });
        document.querySelector("#slide").addEventListener("input", () => dom_audio.volume = document.querySelector("#slide").value / 100);


    }, 50)

    setInterval(() => {
        //document.getElementsByClassName('elapsed')[0].innerHTML = format_seconds(dom_audio.currentTime);
        document.querySelector(".elapsed").innerHTML = format_seconds(dom_audio.currentTime);
        document.querySelector(".remain").innerHTML = format_seconds(Math.ceil(dom_audio.duration - dom_audio.currentTime));
        continuePlay();
        document.querySelector("#file").setAttribute('value', dom_audio.currentTime);
        document.querySelector("#file").setAttribute('max', dom_audio.duration);
    }, 100);

    document.querySelector("#play").addEventListener("click", () => dom_audio.play());
    document.querySelector("#pause").addEventListener("click", () => dom_audio.pause());


    function nextSong(paused) {
        try {
            dom_audio.setAttribute('src', nextS());
            index += 1;
            document.querySelector(".titleSong").innerText = song_data.filter(x => {return x.src == song_urls[index];})[0].title;

            //document.querySelector(".titleSong").innerText = dom_audio.src.substring(dom_audio.src.lastIndexOf('/') + 1, dom_audio.src.lastIndexOf('.'));
            if (!paused) {
                dom_audio.play();
            }

        } catch (err) {
            dom_audio.setAttribute('src', nextS(song_urls)());
            index = 0;
            document.querySelector(".titleSong").innerText = song_data.filter(x => {return x.src == song_urls[index];})[0].title;
            //document.querySelector(".titleSong").innerText = dom_audio.src.substring(dom_audio.src.lastIndexOf('/') + 1, dom_audio.src.lastIndexOf('.'));
            if (!paused) {
                dom_audio.play();
            }
        }
    }

    function prevSong(paused) {
        let newI = nextS(-2);
        if (newI >= 0) {
            dom_audio.setAttribute('src', nextS());
            index += -1;
            document.querySelector(".titleSong").innerText = song_data.filter(x => {return x.src == song_urls[index];})[0].title;
            //document.querySelector(".titleSong").innerText = dom_audio.src.substring(dom_audio.src.lastIndexOf('/') + 1, dom_audio.src.lastIndexOf('.'));
            if (!paused) {
                dom_audio.play();
            }
        } else {
            dom_audio.setAttribute('src', nextS(song_urls)());
            index = 0;
            document.querySelector(".titleSong").innerText = song_data.filter(x => {return x.src == song_urls[index];})[0].title;
            //document.querySelector(".titleSong").innerText = dom_audio.src.substring(dom_audio.src.lastIndexOf('/') + 1, dom_audio.src.lastIndexOf('.'));
            if (!paused) {
                dom_audio.play();
            }
        }
    }

    document.querySelector("#next").addEventListener("click", () => nextSong(dom_audio.paused));
    document.querySelector("#prev").addEventListener("click", () => prevSong(dom_audio.paused));

    return function replace(a) {
        init_player(dom_audio, a, volume);
    }
}


//--------------------------------------------------------------------------------------
// Task 4
//--------------------------------------------------------------------------------------

/**
 * @param {String} text - The mini markdown text string.
 * @return {String} The corresponding HTML representation.
 */
function mini_md(text) {
    const htmlText = text
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/(\n)(\n)/gim, '$1</p><p></p><p>$2')
        .replace(/(^\n)(\D*)(\n$)/gim, '<p>$1$2$3</p>')
        .replace(/(<p>\n)(\D*)(\n$)/gim, '$1$2$3</p>')
        .replace(/(<\/h1>)(\n)(<\/p>)/gim, '$1$2')

    return htmlText;
}