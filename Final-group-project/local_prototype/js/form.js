function addQuestion(i) {
    let output = `
        <article id="article_${i}">
            <h3>Question ${i + 1}</h3>
            <button type="button" id="remove_button"></button>

            <label for="question_${i}">Question:</label>
            <input type="text" name="question_${i}" id="question_${i}">

            <label for="correct_${i}">Correct answer:</label>
            <input type="text" name="correct_${i}" id="correct_${i}">

            <label for="wrong0_${i}">Wrong answer:</label>
            <input type="text" name="wrong0_${i}" id="wrong0_${i}">

            <label for="wrong1_${i}">Wrong answer:</label>
            <input type="text" name="wrong1_${i}" id="wrong1_${i}">

            <label for="wrong2_${i}">Wrong answer:</label>
            <input type="text" name="wrong2_${i}" id="wrong2_${i}">

            <label for="difficulty_${i}">Difficulty:</label>
            <input type="range" name="difficulty_${i}" id="difficulty_${i}" min="0" max="2">
        </article>`;
    return output;
}