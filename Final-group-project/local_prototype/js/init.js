/**
 * This function set an event listener on the submit button for the new quiz
 */
function setEventFormRequest() {
    let submit_button = document.getElementById("submit");
    submit_button.addEventListener("click", function () {
        let form_data = new FormData(document.querySelector("form"));
        fetch("/quizForm", { method: "POST", body: form_data })
    });
}

function setEventAddQuestion() {
    document.getElementById("addQuestion").addEventListener("click", function () {
        let form = document.querySelector("form");
        form.querySelectorAll("button").forEach(e => {
            e.disabled = true;
        });
        form.innerHTML += addQuestion(document.querySelectorAll("h3").length);
        setEventRemoveQuestion();
    })
}

function setEventRemoveQuestion() {
    let form = document.querySelector("form");
    let buttons = form.querySelectorAll("button")
    buttons[buttons.length - 1].addEventListener("click", function () {
        this.parentElement.remove();
        try{
            buttons[buttons.length - 2].disabled = false;
            setEventRemoveQuestion();
        } catch{

        }               
    })
}

