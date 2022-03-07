let socket = io();
let quiz = {};
let shuffle = -1;
let current_question = -1000;
let editing_ids = [];
let timer_on = true;
let host = "false";
var gameLive = false;
var quizLive = false;
var gameLiveId = null;
let stop_timer = false;
let players_list = [];

const navPathnameRouter = {
    "/hostGame": serveHost,
    "/joinGame": serveJoin,
    "/createQuiz": serveCreateQuiz,
    "/": toIndex
}

let initialized = false;

function init() {
    history.pushState({ urlPath: "/" }, null, window.location.origin);
    if (localStorage.getItem("dark") == "true") {
        darkMode();
        document.querySelector("footer").querySelector("input").checked = true;
    }
    init_socket();
    initializeNavEventListeners();
}

function initializeNavEventListeners() {
    document.querySelectorAll('a').forEach(elem => {
        if (elem.id != "home" || !initialized) {
            elem.addEventListener('click', event => {
                event.preventDefault();       
                let url = new URL(window.location.href)
                try {
                    url = new URL(event.currentTarget.href);
                } catch (error) {
                }
                
                if (navPathnameRouter[url.pathname] !== undefined) {
                    let frag = window.location.hash;
                    if (frag == "#hostGame/edit" && url.pathname == "/") {
                        document.querySelector('#overlay p').innerHTML = 'Please use the cancel button!';
                        on();
                    }
                    else {
                        if (url.pathname == "/hostGame") {
                            if (!gameLive) { // If there is a game that is already playing, we can't host another.
                                socket.emit('refresh_list');
                                history.pushState({ urlPath: "/hostGame" }, null, window.location.origin + "/#hostGame");
                            }
                        } else if (url.pathname == "/") {
                            history.pushState({ urlPath: "/" }, null, window.location.origin);
                        } else if (url.pathname == "/joinGame") {
                            history.pushState({ urlPath: "/joinGame" }, null, window.location.origin + "/#joinGame");
                        } else if (url.pathname == "/createQuiz") {
                            history.pushState({ urlPath: "/createQuiz" }, null, window.location.origin + "/#createQuiz");
                        }
                        if (url.pathname == "/hostGame" && gameLive) {
                            document.querySelector('#overlay p').innerHTML = "Game already underway";
                            on();
                        } else {
                            navPathnameRouter[url.pathname]();
                        }

                    }
                }
            });
        }
    });
    initialized = true;
}

function serveCreateQuiz() {
    document.querySelector('#overlay').removeEventListener("click", serveCreateQuiz)
    if (window.location.hash != "#createQuiz") {
        history.pushState({ urlPath: "/createQuiz" }, null, window.location.origin + "/#createQuiz");
    }
    document.getElementsByTagName("title")[0].innerHTML = 'Create Quiz';
    let main = document.querySelector("main");
    main.className = "create";
    main.innerHTML = ejs.views_createquiz();
    setEventRemoveQuestion();
    setEventAddQuestion();
    setEventCancel();
    setEventFormRequest();
}

function checkEditingIds() {
    for (let i in editing_ids) {
        let editing = document.getElementById(editing_ids[i]);
        let edit_button = editing.getElementsByClassName('edit')[0];
        edit_button.replaceWith(edit_button.cloneNode(true));
        editing.getElementsByClassName('edit')[0].addEventListener('click', () => {
            document.querySelector('#overlay p').innerHTML = 'Someone else is editing this quiz!';
            on();
        })
        let delete_button = editing.getElementsByClassName('delete')[0];
        delete_button.replaceWith(delete_button.cloneNode(true));
        editing.getElementsByClassName('delete')[0].addEventListener('click', () => {
            document.querySelector('#overlay p').innerHTML = 'Someone else is editing this quiz!';
            on();
        })
        let playgame_button = editing.getElementsByClassName('playgame')[0];
        playgame_button.replaceWith(playgame_button.cloneNode(true));
        editing.getElementsByClassName('playgame')[0].addEventListener('click', () => {
            document.querySelector('#overlay p').innerHTML = 'Someone else is editing this quiz!';
            on();
        })
    }
}

function checkGameLiveId() {
    if (gameLiveId != null) {
        let editing = document.getElementById(gameLiveId);
        let edit_button = editing.getElementsByClassName('edit')[0];
        edit_button.replaceWith(edit_button.cloneNode(true));
        editing.getElementsByClassName('edit')[0].addEventListener('click', () => {
            document.querySelector('#overlay p').innerHTML = 'Someone else is editing this quiz!';
            on();
        })
        let delete_button = editing.getElementsByClassName('delete')[0];
        delete_button.replaceWith(delete_button.cloneNode(true));
        editing.getElementsByClassName('delete')[0].addEventListener('click', () => {
            document.querySelector('#overlay p').innerHTML = 'Someone else is editing this quiz!';
            on();
        })
    }
}

function checkGameLive() {
    if (gameLive) {
        let buttons = document.getElementsByClassName("playgame");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].replaceWith(buttons[i].cloneNode(true));
            buttons[i].addEventListener("click", function () {
                document.querySelector('#overlay p').innerHTML = 'Another game has been started!';
                on();
            })
        }
    }
}

function serveHost() {
    fetch('/hostGame').then(res => {
        return res.json();
    }).then(res => {
        if (res.length == 0) {
            document.querySelector('#overlay p').innerHTML = "First add a quiz!";
            on();
            document.querySelector('#overlay').addEventListener("click", serveCreateQuiz)
        }
        let main = document.querySelector("main");
        main.innerHTML = ejs.views_hostgame({
            quiz: res
        });
        main.className = "host";
        document.getElementsByTagName("title")[0].innerHTML = 'Start Game';
        setEventEditQuiz();
        setEventDeleteQuiz();
        setEventPlayQuiz();

        checkEditingIds();
        checkGameLive();
        checkGameLiveId();

    }).catch(err => {
        console.log('Got a fetch error', err);
    })
}

function serveJoin() {
    fetch('/joinGame').then(res => {
        return res.json();
    }).then(res => {
        if (res) {
            let main = document.querySelector("main");
            main.innerHTML = ejs.views_joingame();
            main.className = "join";
            main.querySelector("form").addEventListener("submit", event => {
                event.preventDefault();
            })
            setEventUsername();
            document.getElementsByTagName("title")[0].innerHTML = 'Join Game';
        } else {
            history.pushState({ urlPath: "/" }, null, window.location.origin);
            document.querySelector('#overlay p').innerHTML = "No game available!";
            on();
        }
    }).catch(err => {
        console.log('Got a fetch error', err);
    })
}

function toIndex() {
    document.querySelector('#overlay').removeEventListener("click", toIndex)
    document.getElementsByTagName("title")[0].innerHTML = 'USIHoot';
    let main = document.querySelector("main");
    main.className = "index";
    main.innerHTML = ejs.views_index();
    history.pushState({ urlPath: "/" }, null, window.location.origin);
    initializeNavEventListeners();
}

function setEventAddQuestion() {
    document.getElementById("addQuestion").addEventListener("click", function () {
        let form = document.querySelector("form");
        const parser = new DOMParser();
        let parsed = parser.parseFromString(ejs.views_newquestion({ "i": document.querySelectorAll("h3").length }), "text/html");
        form.appendChild(parsed.lastChild.lastChild.firstChild);
        setEventRemoveQuestion();
    })
}

function setEventRemoveQuestion(all = false) {
    let form = document.querySelector("form");
    let buttons = form.querySelectorAll("button")
    if (all) {
        buttons.forEach(e => {
            e.addEventListener("click", function () { removeQuestion(e) });
        })
    } else {
        buttons[buttons.length - 1].addEventListener("click", function () { removeQuestion(this) });
    }
}

function removeQuestion(e) {
    let form = document.querySelector("form");
    let i = parseInt(e.parentElement.id.replace("article_", ""));
    let input_fields = form.querySelectorAll("input");
    let values = retrieveFields(input_fields, i);
    updateFields(input_fields, i, values);
    form.lastElementChild.remove();
}

function retrieveFields(array, index) {
    let result = [];
    for (let i = 6 * (index + 1); i < array.length; i++) {
        result.push({ value: array[i].value, class: array[i].className });
    }
    return result;
}

function updateFields(array, index, values) {
    for (let i = 0; i < values.length; i++) {
        array[6 * index + i].value = values[i].value;
        array[6 * index + i].className = values[i].class;
    }
}

function setEventFormRequest(request = "post", quizID = "") {
    let submit_button = document.getElementById("submit");
    submit_button.addEventListener("click", function () {
        let input_fields = document.querySelectorAll("input");
        let complete = true;
        if (input_fields.length >= 5) {
            for (let i = 0; i < input_fields.length; i++) {
                removeSpacesBeforeInputFields(input_fields[i]);
                if (input_fields[i].value == "") {
                    complete = false;
                    input_fields[i].className = "invalid";
                } else {
                    input_fields[i].className = "";
                }
            }
            if (complete) {
                let form_data = new FormData(document.querySelector("form"));
                if (request == "post") {
                    fetch("/quizForm", { method: "POST", body: form_data }).then(() => {
                        toIndex();
                    });
                } else {
                    fetch("/quizForm/" + quizID, { method: "PUT", body: form_data }).then(() => {
                        socket.emit("stop_edit", { id: quizID });
                        serveHost();
                        history.pushState({ urlPath: "/" }, null, window.location.origin);
                    });
                }
            } else {
                document.querySelector('#overlay p').innerHTML = "Not all fields are filled!";
                on();
            }
        } else {
            document.querySelector('#overlay p').innerHTML = "Please add at least one question.";
            on();
            document.getElementById("addQuestion").click();
        }
    });
}

function removeSpacesBeforeInputFields(field) {
    if (field.value.startsWith(" ")) {
        let str = field.value;
        while (str[0] == " ") {
            str = str.slice(1);
        }
        field.value = str;
    }
}

function setEventCancel() {
    document.getElementById("cancel").addEventListener("click", toIndex);
}

function setEventUsername() {
    document.querySelector("button").addEventListener("click", function () {
        if (quizLive) {
            document.querySelector('#overlay p').innerHTML = "Quiz already underway. Sorry :(";
            on();
            return;
        } 
        host = "false";
        removeSpacesBeforeInputFields(document.querySelector("input"));
        let form_data = new FormData(document.querySelector("form"));
        fetch("/game/joinGame", { method: "POST", body: form_data }).then(res => {
            return res.json()
        }).then(body => {
            if (body.msg != "Good luck!") {
                document.querySelector('#overlay p').innerHTML = body.msg;
                on();
                if (body.msg == "No games available!") {
                    document.querySelector('#overlay').addEventListener("click", toIndex)
                }
            } else {
                let home = document.getElementById("home");
                home.replaceWith(home.cloneNode(true))
                quiz = body.quiz;
                localStorage.setItem("username", document.querySelector("input").value);
                let main = document.querySelector("main");
                main.className = "waiting";
                main.innerHTML = ejs.views_waitingroom();
                socket.emit('ingame_player', { username: form_data.get('username')});
                history.pushState({ urlPath: "/" }, null, window.location.origin + "/#waitingRoom");
            }
        });
    });
}

function setEventEditQuiz() {
    let buttons = document.getElementsByClassName("edit");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            let quizID = this.parentElement.parentElement.id;
            fetch("/quizForm/" + quizID).then(res => {
                return res.json();
            }).then(body => {
                history.pushState({ urlPath: "/" }, null, window.location.origin + "/#hostGame/edit");
                document.getElementsByTagName("title")[0].innerHTML = 'Edit Quiz';
                let main = document.querySelector("main");
                main.className = "create";
                main.innerHTML = ejs.views_editquiz(body);
                socket.emit("start_edit", { id: quizID });
                setEventRemoveQuestion(true);
                setEventAddQuestion();
                document.getElementById("cancel").addEventListener("click", function () {
                    socket.emit("stop_edit", { id: quizID });
                    serveHost()
                    history.pushState({ urlPath: "/" }, null, window.location.origin + "/#hostGame");
                });
                setEventFormRequest("put", quizID);
            }).catch(err => {
                console.log("Problem while fetching:", err);
            })
        })
    }
}

function setEventDeleteQuiz() {
    let buttons = document.getElementsByClassName("delete");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            let quizID = this.parentElement.parentElement.id;
            fetch("/quizForm/" + quizID, { method: "DELETE" }).then(res => {
                if (res.status == 204) {
                    this.parentElement.parentElement.remove();
                    updateQuizNumbers();
                } else {
                    console.log("Something went wrong");
                }
            }).catch(err => {
                console.log("Problem while fetching:", err)
            });
        })
    }
}

function updateQuizNumbers() {
    let p = document.querySelector("main").querySelectorAll("p");
    for (let i = 0; i < p.length; i++) {
        p[i].innerText = "Quiz " + (i + 1);
    }
}

function setEventPlayQuiz() {
    let buttons = document.getElementsByClassName("playgame");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            let home = document.getElementById("home");
            home.replaceWith(home.cloneNode(true))
            host = "true";
            let quizID = this.parentElement.parentElement.id;
            gameLive = true;
            gameLiveId = quizID;
            console.log(gameLiveId);
            fetch("/game/createGame/" + quizID).then(res => {
                return res.json();
            }).then(body => {
                // This body is not needed ->Lovnesh
                history.pushState({ urlPath: "/" }, null, window.location.origin + "/#lobby");
                socket.emit('game_started', {id: quizID});
                players_list = body.Players;
                quiz = body.Quiz;
                current_question = body.current_question_index;
                shuffle = body.shuffle[current_question];
                let main = document.querySelector("main");
                main.className = "lobby";
                main.innerHTML = ejs.views_lobby({ users: body.Players });
                music();
                let button = document.getElementById("lobby_start");
                button.addEventListener('click', event => {
                    if (players_list.length > 0) {
                        event.preventDefault();
                        socket.emit("startQuiz", {});
                        let q = quiz.questions[current_question];
                        let array = createAnswersArray(q.wrong_answers, q.right_answer, shuffle);
                        let seconds = 10 + q.difficulty * 5;
                        generateQuestionPage(q.q, array, seconds, false)
                        history.pushState({ urlPath: "/" }, null, window.location.origin + "/#hostSideQuiz");
                    }
                });

            }).catch(err => {
                gameLive = false;
                gameLiveId = null;
                console.log("Problem while fetching:", err)
            });
        })
    }
}

function generateQuestionPage(q, array, seconds, isplayer = true) {
    let main = document.querySelector("main");
    main.className = "question";
    main.innerHTML = ejs.views_question({ question: q, answers: array });
    countdown(seconds);
    if (isplayer) {
        setEventsAnswer();
    }
}

function createAnswersArray(array_wrong, str_correct, index_correct) {
    let array = [];
    array_wrong.forEach(e => {
        array.push(e);
    });
    array.splice(index_correct, 0, str_correct);
    return array;
}

function setEventsAnswer() {
    let main = document.querySelector("main");
    let buttons = main.querySelectorAll("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            document.querySelector("audio").play();
            this.className = "clicked ";
            let div = document.getElementById("answer_grid");
            div.replaceWith(div.cloneNode(true));
            timer_on = false;
            if (shuffle == i) {
                socket.emit('correct answer', localStorage.getItem('username'), current_question);
            } else {
                socket.emit('wrong answer', current_question);
            }
        })
    }
}

function countdown(seconds) {
    timer_on = true;
    stop_timer = false;
    let timerElement = document.getElementById("timer");
    let setDate = new Date();
    let begin = setDate.getTime();
    let end = begin + 1000 * seconds;
    let timer = setInterval(function () {
        if (stop_timer) {
            clearInterval(timer);
        }
        let date = new Date();
        let s = date.getTime();

        let diff = end - s;
        timerElement.innerText = Math.abs(Math.round(diff / 1000));
        if (diff <= 0) {
            clearInterval(timer);
            let main = document.querySelector("main");
            if (timer_on && window.location.hash.startsWith("#playerSideQuiz")) {
                main.replaceWith(main.cloneNode(true));
                socket.emit('wrong answer', current_question);
            }
        }
    }, 250);
}

function sortPlayerList(players) {
    // players -> array of object player
    // player {username: string, points: number}
    players.sort(function (a, b) {
        return b.points - a.points;
    });
}

function rankByName(players, name) {
    return players.indexOf(players.find(({ username }) => username === name)) + 1;
}

socket.on('connect', () => {
    console.log("socket connected");
    socket.emit('checkGameStatus', {});
});

function init_socket() {

    socket.on('currentGameStatus', (statusGame, statusQuiz) => {
        gameLive = statusGame;
        quizLive = statusQuiz;
    });

    socket.on("disconnect", () => {
        console.log("Browser disconnected");
        toIndex();
        document.querySelector('#overlay p').innerHTML = 'You disconnected from the server!';
        on();
    });

    socket.on('latest_list', msg => {
        editing_ids = msg.list;
    })

    socket.on('quiz.created', (new_quiz) => {
        let frag = window.location.hash;
        if (frag == "#hostGame") {
            let main = document.querySelector("main");
            let new_j = main.childElementCount == 1 ? 1 : parseInt(main.lastElementChild.querySelector("p").innerText.replace("Quiz ", "")) + 1;
            document.querySelector("main").insertAdjacentHTML('beforeend', ejs.views_hostgameOne({
                e: new_quiz,
                j: new_j
            }));
            main.replaceWith(main.cloneNode(true));
            setEventEditQuiz();
            setEventDeleteQuiz();
            setEventPlayQuiz();
            checkEditingIds();
        }
    });

    socket.on('quiz.deleted', (deleted_quiz) => {
        let frag = window.location.hash;
        if (frag == "#hostGame") {
            let article = document.getElementById(deleted_quiz.value._id);
            if (article != null) {
                article.parentNode.removeChild(article);
            }
            updateQuizNumbers();
        }
    });

    socket.on('quiz.modified', (msg) => {
        let frag = window.location.hash;
        if (frag == "#hostGame") {
            let id = msg.id;
            let new_quiz = msg.quiz;
            let main = document.querySelector("main");
            let old_element = document.getElementById(id);
            let old_j = parseInt(old_element.innerText.replace("Quiz ", ""));
            let before = old_element.previousElementSibling;
            old_element.parentNode.removeChild(old_element);

            before.insertAdjacentHTML('afterend', ejs.views_hostgameOne({
                e: new_quiz,
                j: old_j
            }));
            main.replaceWith(main.cloneNode(true));
            setEventEditQuiz();
            setEventDeleteQuiz();
            setEventPlayQuiz();
            checkEditingIds();

        }
    });

    socket.on('editing', (msg) => {
        editing_ids.push(msg.id);
        let frag = window.location.hash;
        if (frag == "#hostGame") {
            let editing = document.getElementById(msg.id);
            let edit_button = editing.getElementsByClassName('edit')[0];
            edit_button.replaceWith(edit_button.cloneNode(true));
            editing.getElementsByClassName('edit')[0].addEventListener('click', () => {
                document.querySelector('#overlay p').innerHTML = 'Someone else is editing this quiz!';
                on();
            })
            let delete_button = editing.getElementsByClassName('delete')[0];
            delete_button.replaceWith(delete_button.cloneNode(true));
            editing.getElementsByClassName('delete')[0].addEventListener('click', () => {
                document.querySelector('#overlay p').innerHTML = 'Someone else is editing this quiz!';
                on();
            })
            let playgame_button = editing.getElementsByClassName('playgame')[0];
            playgame_button.replaceWith(playgame_button.cloneNode(true));
            editing.getElementsByClassName('playgame')[0].addEventListener('click', () => {
                document.querySelector('#overlay p').innerHTML = 'Someone else is editing this quiz!';
                on();
            })
        }
    });

    socket.on('stop_editing', (msg) => {
        editing_ids.splice(editing_ids.indexOf(msg.id), 1);
        let frag = window.location.hash;
        if (frag == "#hostGame") {
            let main = document.querySelector("main");
            main.replaceWith(main.cloneNode(true));
            setEventEditQuiz();
            setEventDeleteQuiz();
            setEventPlayQuiz();
            checkEditingIds();
        }
    });

    socket.on('game_in_progress', (msg) => {
        gameLive = true;
        gameLiveId = msg.id;
        let frag = window.location.hash;
        if (frag == "#hostGame") {
            let main = document.querySelector("main");
            main.replaceWith(main.cloneNode(true));
            setEventEditQuiz();
            setEventDeleteQuiz();
            checkGameLive();
            checkGameLiveId();
        }
    })

    socket.on('next question for players', (ca_pos, current_index) => {
        shuffle = ca_pos;
        current_question = current_index;
        let q = quiz.questions[current_question];
        let array = createAnswersArray(q.wrong_answers, q.right_answer, shuffle);
        let seconds = 10 + q.difficulty * 5;
        generateQuestionPage(q.q, array, seconds);
    });

    socket.on('new_player', (players) => {
        players_list = players;
        let frag = window.location.hash;
        if (frag == "#lobby") {
            document.getElementById("connected").innerText = "Players connected: " + players.length;
            document.querySelector("ul").innerHTML = ejs.views_includes_playersinlobby({ users: players });
        }
    })

    socket.on('ending_the_game', p => {
        let gId = gameLiveId;
        let frag = window.location.hash;
        if (frag.startsWith("#hostSideQuiz") || frag.startsWith("#playerSideQuiz")) {
            sortPlayerList(p);
            let rank = rankByName(p, localStorage.getItem("username"))
            let main = document.querySelector("main");
            if (frag == "#hostSideQuiz") {
                main.className = "podium";
                main.innerHTML = ejs.views_podium({ players: p });
                let back_to_title_player = document.querySelector('button');
                back_to_title_player.addEventListener('click', (event) => {
                    event.preventDefault();         
                    fetch("/game/exitGame/" + gId).then(res => {                        
                        toIndex();
                    })
                });
            } else {
                main.className = "rank";
                main.innerHTML = ejs.views_rank({ position: rank, total: p.length });
                let back_to_title_player = document.getElementById('rank_leave');
                back_to_title_player.addEventListener('click', (event) => {
                    event.preventDefault();
                    toIndex();
                });
            }
        }
        initialized = false;
        gameLive = false;
        gameLiveId = null;    
        quizLive = false;
        if (frag == "#hostGame") {
            let main = document.querySelector("main");
            main.replaceWith(main.cloneNode(true));
            setEventEditQuiz();
            setEventDeleteQuiz();
            setEventPlayQuiz();
            checkEditingIds()
        }

        if (frag == "#joinGame") {
            toIndex();
        }
    })

    socket.on('host_disconnected', () => {
        fetch("/game/exitGame/" + gameLiveId).then(res => {
            initialized = false
            gameLive = false;
            gameLiveId = null;
            quizLive = false;
            let frag = window.location.hash;
            if (frag.startsWith("#hostSideQuiz") || frag.startsWith("#playerSideQuiz") || frag.startsWith("#waitingRoom")){
                toIndex();
                document.querySelector('#overlay p').innerHTML = 'The host left the game!';
                on();
            }

        })

    })

    socket.on('renderQuizzes', (ca) => {
        quizLive = true;
        let frag = window.location.hash;
        if (frag == "#waitingRoom") {
            shuffle = ca;
            current_question = 0;
            let q = quiz.questions[current_question];
            let array = createAnswersArray(q.wrong_answers, q.right_answer, shuffle);
            let seconds = 10 + q.difficulty * 5;
            generateQuestionPage(q.q, array, seconds);
            history.pushState({ urlPath: "/" }, null, window.location.origin + "/#playerSideQuiz");
        }
    })

    socket.on('eliminate_player', (msg)=>{
        players_list.splice(players_list.indexOf(msg.username), 1);
        let frag = window.location.hash;
        if (frag == "#lobby") {
            document.getElementById("connected").innerText = "Players connected: " + players_list.length;
            document.querySelector("ul").innerHTML = ejs.views_includes_playersinlobby({ users: players_list });
        }
        else{
            if (players_list.length == 0){
                fetch("/game/exitGame/" + gameLiveId).then(res => {
                    initialized = false;
                    gameLive = false;
                    gameLiveId = null;
                    quizLive = false;
                    if (frag.startsWith("#hostSideQuiz") || frag.startsWith("#playerSideQuiz") || frag.startsWith("#waitingRoom")) {
                        toIndex();
                        document.querySelector('#overlay p').innerHTML = 'All the players left the game!';
                        on();
                    }

                })
            }
        }
    })

    socket.on("show correct answer", () => {
        stop_timer = true;
        setTimeout(() => {
            document.getElementById("timer").innerText = "0";
            let main = document.querySelector("main");
            let buttons = main.querySelectorAll("button");
            for (let i = 0; i < buttons.length; i++) {
                if (i == shuffle) {
                    buttons[i].className += "correct";
                } else {
                    buttons[i].className += "wrong";
                }
            }
            let frag = window.location.hash;
            if (frag.startsWith("#hostSideQuiz")) {
                let button = document.getElementById("timer")
                button.innerText = "Next";
                button.className = "timer_next";
                button.addEventListener("click", function () {
                    socket.emit("goToLeaderboard");
                })
            }
        }, 250);
    });

    socket.on("showLeaderboard", (players) => {
        let frag = window.location.hash;
        if (frag.startsWith("#hostSideQuiz")) {
            sortPlayerList(players.players);
            let main = document.querySelector('main');
            main.className = "top_players";
            main.innerHTML = ejs.views_topplayers({ players: players.players });
            let button = main.querySelector('button');
            button.addEventListener('click', event => {
                event.preventDefault();
                if (frag == "#hostSideQuiz") {
                    socket.emit('next question', {});
                } else {
                    document.querySelector('#overlay p').innerHTML = "Wait for the host to click next...";
                    on();
                }
            });
        }
        if (frag.startsWith("#playerSideQuiz")) {
            let main = document.querySelector('main');
            main.className = "waiting";
            main.innerHTML = ejs.views_waitingscreen();
        }
    });

    socket.on("next question for players", (ca_pos, current_index, isHost) => {
        let frag = window.location.hash;
        shuffle = ca_pos;
        current_question = current_index;
        let q = quiz.questions[current_question];
        let array = createAnswersArray(q.wrong_answers, q.right_answer, shuffle);
        let seconds = 10 + q.difficulty * 5;
        if (frag == "playerSideQuiz") {
            generateQuestionPage(q.q, array, seconds);
        }
        if (frag == "#hostSideQuiz") {
            generateQuestionPage(q.q, array, seconds, false);
        }
    })
}


//overlay functions
function on() {
    document.getElementById("overlay").className = "display_overlay";
}

function off() {
    document.getElementById("overlay").className = "hide_overlay";
}
