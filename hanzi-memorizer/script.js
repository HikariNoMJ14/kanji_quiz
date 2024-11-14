const NUM_CHOICES = 12;

document.addEventListener('DOMContentLoaded', () => {
    const levelOptionsContainer = document.getElementById('levelOptionsContainer');
    const gameTypeOptionsContainer = document.getElementById('gameTypeOptionsContainer');
    const levelOptions = document.getElementById('levelOptions');
    const gameTypeOptions = document.getElementById('gameTypeOptions');
    const startGameButton = document.getElementById('startGame');
    const gameArea = document.getElementById('gameArea');
    const hintElement = document.createElement('div');
    hintElement.id = 'hint';
    document.getElementById('app').insertBefore(hintElement, gameArea);

    let currentHint = null;
    let remainingHanzi = [];

    // Fetch the JSON data
    fetch('hanzi_data.json')
        .then(response => response.json())
        .then(data => {
            // Populate level options
            const levels = [...new Set(data.map(item => item.level))];
            levels.forEach(level => {
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.id = `level${level}`;
                radio.name = 'level';
                radio.value = level;
                const label = document.createElement('label');
                label.htmlFor = `level${level}`;
                label.textContent = `Level ${level}`;
                levelOptions.appendChild(radio);
                levelOptions.appendChild(label);
                levelOptions.appendChild(document.createElement('br'));
            });

            startGameButton.addEventListener('click', () => {
                const selectedLevel = document.querySelector('input[name="level"]:checked').value;
                const selectedGameType = document.querySelector('input[name="gameType"]:checked').value;
                startGame(data, selectedLevel, selectedGameType);
            });
        })
        .catch(error => console.error('Error loading JSON:', error));

    function startGame(data, level, gameType) {
        // Hide the radio buttons
        levelOptionsContainer.classList.add('hidden');
        gameTypeOptionsContainer.classList.add('hidden');
        startGameButton.classList.add('hidden');

        gameArea.innerHTML = ''; // Clear previous game
        remainingHanzi = shuffleArray(data.filter(item => item.level == level));
        displayNextHintAndCards(gameType);
    }

    function displayNextHintAndCards(gameType) {
        if (remainingHanzi.length === 0) {
            alert('Game Over! All hanzi have been displayed.');
            return;
        }

        // Choose a random hint
        currentHint = remainingHanzi.pop();
        hintElement.textContent = gameType === 'engToHanzi' ? currentHint.translations[0] : currentHint.hanzi;

        gameArea.innerHTML = ''; // Clear previous cards

        // Create choices
        const choices = [currentHint];
        while (choices.length < NUM_CHOICES && remainingHanzi.length > 0) {
            const randomChoice = remainingHanzi[Math.floor(Math.random() * remainingHanzi.length)];
            if (!choices.includes(randomChoice)) {
                choices.push(randomChoice);
            }
        }

        shuffleArray(choices).forEach(choice => {
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = gameType === 'engToHanzi' ? choice.hanzi : choice.translations[0];
            card.addEventListener('click', () => handleCardClick(choice, gameType));
            gameArea.appendChild(card);
        });
    }

    function handleCardClick(choice, gameType) {
        const isCorrect = (gameType === 'engToHanzi' && choice.hanzi === currentHint.hanzi) ||
                          (gameType === 'hanziToEng' && choice.translations[0] === currentHint.translations[0]);
        alert(isCorrect ? 'Correct' : 'Wrong');
        displayNextHintAndCards(gameType);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});