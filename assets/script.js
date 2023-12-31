document.addEventListener("DOMContentLoaded", function () {
    // DOM elements for the start quiz page
    const startButton = document.getElementById('start-button');
    const startQuizPage = document.getElementById('start-quiz-page');
    const highScoresContainer = document.getElementById('high-scores-container');
    const highScoresList = document.getElementById('high-scores-list');

    // DOM elements for the question and timer page
    const questionPage = document.getElementById('question-page');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const timer = document.getElementById('timer');

    // DOM elements for the game over and save score page
    const gameOverPage = document.getElementById('game-over-page');
    const scoreDisplay = document.getElementById('score');
    const initialsInput = document.getElementById('initials');
    const saveScoreButton = document.getElementById('save-score');
    const gameOverContainer = document.getElementById('game-over-container');

    const savedInitials = localStorage.getItem('initials');
    const savedScore = localStorage.getItem('score');
    const savedScores = JSON.parse(localStorage.getItem('scores')) || [];

    // Display saved initials and their highest scores if available
    if (savedScores.length > 0) {
        savedScores.forEach((record) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${record.initials}: ${record.score}`;
            highScoresList.appendChild(listItem);
        });
        highScoresContainer.style.display = 'block';
    }

    // Quiz questions and state
    const questions = [
        {
            question: 'What does HTML stand for?',
            options: ['A) Hyper Text Markup Language',
                    'B) High-Level Text Machine Language',
                    'C) Hyperlinks and Text Markup Language',
                    'D) Home Tool Markup Language'],
            correctAnswer: 0
        },
        {
            question: 'In JavaScript, which keyword is used to declare a variable?',
            options: ['A) var',
                'B) let',
                'C) const',
                'D) declare'],
            correctAnswer: 0
        },
        {
            question: 'Which CSS property is used to control the spacing between elements?',
            options: ['A) margin',
                'B) padding',
                'C) border',
                'D) spacing'],
            correctAnswer: 1
        },
        {
            question: 'What does the acronym API stand for in programming?',
            options: ['A) Application Process Interface',
            'B) Advanced Programming Interface',
            'C) Algorithmic Programming Integration',
            'D) Application Programming Interface'],
            correctAnswer: 3
        },
        // Add more questions here
    ];

    let currentQuestionIndex = 0;
    let timeLeft = 60; // Initial time in seconds
    let score = 0;

    // Display saved initials and scores if available
    if (savedInitials && savedScore) {
        const listItem = document.createElement('li');
        listItem.textContent = `${savedInitials}: ${savedScore}`;
        highScoresList.appendChild(listItem);
        highScoresContainer.style.display = 'block';
    }

    const clearScoresButton = document.getElementById('clear-scores');

    clearScoresButton.addEventListener('click', () => {

        localStorage.removeItem('scores');
        
        highScoresList.innerHTML = '';

        highScoresContainer.style.display = 'none';
    });

    function startQuiz() {
        const confirmStart = confirm('Start quiz?');
        if (confirmStart) {
            startQuizPage.style.display = 'none';
            questionPage.style.display = 'block';
            displayQuestion(currentQuestionIndex);
            startTimer();
        }
    }

    function displayQuestion(index) {
        const currentQuestion = questions[index];
        questionText.textContent = currentQuestion.question;
        optionsContainer.innerHTML = '';
    
        currentQuestion.options.forEach((option, i) => {
            const optionButton = document.createElement('button');
            optionButton.classList.add('option');
            optionButton.textContent = option;
            optionButton.addEventListener('click', () => checkAnswer(i));
            optionsContainer.appendChild(optionButton);
        });
    }

    function checkAnswer(selectedIndex) {
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedIndex === currentQuestion.correctAnswer) {
            score++; // Increment the score
        } else {
            timeLeft -= 10; // Subtract time for incorrect answer
        }
        currentQuestionIndex++;
    
        if (currentQuestionIndex < questions.length) {
            displayQuestion(currentQuestionIndex);
        } else {
            endGame();
        }
    }

    function startTimer() {
        const timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timer.textContent = `Time: ${timeLeft}s`;
            } else {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        questionPage.style.display = 'none';
        gameOverPage.style.display = 'block';
        scoreDisplay.textContent = score;
    }

    function reloadPage() {
        window.location.reload();
    }

    saveScoreButton.addEventListener('click', () => {
        // Save the score and initials as an object
        const initials = initialsInput.value;
        const record = { initials, score };

        // Push the record to the array of saved scores
        savedScores.push(record);

        // Save the updated array to local storage
        localStorage.setItem('scores', JSON.stringify(savedScores));

        // Reload the page
        reloadPage();
    });

    startButton.addEventListener('click', startQuiz);
});