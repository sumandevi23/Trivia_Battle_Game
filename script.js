
let selectedCategory = '';
let selectedDifficulty = '';
let quizQuestions = [];
let questionIndex = 0;
let playerOne = '';
let playerTwo = '';
let playerOneScore = 0;
let playerTwoScore = 0;

function startGame() {
    playerOne = document.getElementById('player1').value;
    playerTwo = document.getElementById('player2').value;
    updatePlaceholders();
    document.getElementById('form').style.display = 'none';
    fetchCategories();
}

function updatePlaceholders() {
    document.getElementById('player1-answer').placeholder = `${playerOne}'s Answer`;
    document.getElementById('player2-answer').placeholder = `${playerTwo}'s Answer`;
}

function fetchCategories() {
    const apiUrl = `https://the-trivia-api.com/v2/categories`
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const categoriesContainer = document.getElementById('container');
            categoriesContainer.innerHTML = '';
            for (let category in data) {
                const button = document.createElement('button');
                button.innerText = capitalizeFirstLetter(category);
                button.onclick = () => selectCategory(category);
                categoriesContainer.appendChild(button);
            }
            document.getElementById('section').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            alert('Failed to fetch categories. Please try again later.');
        });
}

function selectCategory(category) {
    selectedCategory = category;
    document.getElementById('section').style.display = 'none';
    document.getElementById('selection2').style.display = 'block';
}

function selectDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    document.getElementById('selection2').style.display = 'none';
    document.getElementById('area').style.display = 'block';
    document.getElementById('title').innerText = `${capitalizeFirstLetter(selectedCategory)} ${capitalizeFirstLetter(selectedDifficulty)} Questions`;
    fetchQuestions();
}

function fetchQuestions() {
    const apiUrl = `https://the-trivia-api.com/v2/questions?categories=${selectedCategory}&limit=6&difficulty=${selectedDifficulty}`;
    console.log(`Fetching questions from: ${apiUrl}`);
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched questions:', data); // Debugging: Log the fetched questions
            quizQuestions = data;
            questionIndex = 0;
            showQuestion();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            alert('Failed to fetch questions. Please try again later.');
        });
}

function showQuestion() {
    if (questionIndex < quizQuestions.length) {
        const currentQuestion = quizQuestions[questionIndex].question;
        document.getElementById('question').innerText = currentQuestion.text;
        document.getElementById('player1-answer').value = '';
        document.getElementById('player2-answer').value = '';
        document.getElementById('feedback').innerText = '';
    } else {
        document.getElementById('question').innerText = "Game Over!";
        document.getElementById('feedback').innerText = '';
    }
}

function submitAnswers() {
    const player1Answer = document.getElementById('player1-answer').value;
    const player2Answer = document.getElementById('player2-answer').value;
    const correctAnswer =  quizQuestions[questionIndex].correctAnswer;

    let feedback = '';
    if (player1Answer.toLowerCase() === correctAnswer.toLowerCase()) {
        feedback += `${playerOne} got it right! `;
        playerOneScore++;
    } else {
        feedback += `${playerOne} got it wrong. `;
    }

    if (player2Answer.toLowerCase() === correctAnswer.toLowerCase()) {
        feedback += `${playerTwo} got it right!`;
        playerTwoScore++;
    } else {
        feedback += `${playerTwo} got it wrong.`;
    }

    document.getElementById('feedback').innerText = feedback;
    updateScore();
}

function nextQuestion() {
    questionIndex++;
    showQuestion();
}

function updateScore() {
    document.getElementById('score').innerText = `${playerOne}: ${playerOneScore} - ${playerTwo}: ${playerTwoScore}`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};