window.addEventListener('load', () => {
  const bird = document.querySelector('.game__bird');
  const gameElement = document.querySelector('.game');
  const gameOverOverlay = document.querySelector('.gameOver__overlay');
  const scoreElement = document.querySelector('.game__score');
  const bestRecordElement = document.querySelector('.main__recordContainer');
  const tryAgainButton = document.querySelector('.gameOver__overlay__button');

  let birdBottom = 260;
  let birdLeft = 160;
  const gab = 160;
  let gameOverStatus = false;
  let currentScore = 0;

  function startGame() {
    bird.style.bottom = birdBottom + 'px';
    bird.style.left = birdLeft + 'px';
    scoreElement.innerText = currentScore;
    getBestRecord();
  }

  function handleGravity() {
    if (birdBottom > 0) {
      birdBottom -= 3;
      bird.style.bottom = birdBottom + 'px';
    }
  }

  function jump() {
    if (birdBottom < 660) {
      birdBottom += 50;
      bird.style.bottom = birdBottom + 'px';
    }
  }

  function bindTryAgainClick() {
    tryAgainButton.addEventListener('click', () => {
      window.location.reload();
    });
  }

  function bindJumpKey() {
    window.addEventListener('keyup', (event) => {
      if (event.keyCode === 32) {
        if (!gameOverStatus) {
          jump();
          return;
        }

        window.location.reload();
      }
    })
  }

  function bindEvents() {
    bindTryAgainClick();
    bindJumpKey();
  }

  function handleIncreaseScore() {
    currentScore += 20;
    scoreElement.innerText = currentScore;
  }

  function generatePipes() {
    let obstacleLeft = 500;
    let randomHeight = Math.random() * 60;
    let obstacleBottom = randomHeight;

    const bottomPipe = document.createElement('div');
    const topPipe = document.createElement('div');

    bottomPipe.classList.add('game__bottom__pipe');
    topPipe.classList.add('game__top__pipe');

    gameElement.appendChild(bottomPipe);
    gameElement.appendChild(topPipe);

    bottomPipe.style.left = obstacleLeft + 'px';
    bottomPipe.style.bottom = obstacleBottom + 'px';
    topPipe.style.left = obstacleLeft + 'px';
    topPipe.style.bottom = obstacleBottom + gab + bottomPipe.offsetHeight  + 'px';

    function moveObstacle() {
      if (!gameOverStatus) {
        obstacleLeft -= 2;
        bottomPipe.style.left = obstacleLeft + 'px';
        topPipe.style.left = obstacleLeft + 'px';
      }

      const passedAnObstacle = obstacleLeft === 100;

      if (passedAnObstacle) {
        handleIncreaseScore();
      }

      const obstacleIsOutOfView = obstacleLeft < -60;

      if (obstacleIsOutOfView) {
        clearInterval(obstacleInterval);
        gameElement.removeChild(bottomPipe);
        gameElement.removeChild(topPipe);
      }

      const birdHitPipeHorizontally = obstacleLeft > 120 && obstacleLeft < 220 && birdLeft === 160;
      const birdHitPipeVertically = (birdBottom < obstacleBottom + bottomPipe.offsetHeight || birdBottom > obstacleBottom + bottomPipe.offsetHeight + gab - 45);
      const birdHitGround = birdBottom < 150;

      if ((birdHitPipeHorizontally && birdHitPipeVertically) || birdHitGround) {
        console.log('game over');
        handleGameOver();
        clearInterval(gravityInterval);
        clearInterval(obstacleInterval);
      }
    }

    const obstacleInterval = setInterval(moveObstacle, 20);
    if (!gameOverStatus) {
      setTimeout(generatePipes, 3000);
    }
  }

  function handleGameOver() {
    gameOverStatus = true;

    gameOverOverlay.style.display = 'flex';

    handleSaveBestRecord();

  }

  function handleSaveBestRecord() {
    const bestRecord = window.localStorage.getItem('fb-best-record');

    if (currentScore > bestRecord) {
      window.localStorage.setItem('fb-best-record', currentScore);
    }
  }

  function getBestRecord() {
    const bestRecord = window.localStorage.getItem('fb-best-record');

    if (bestRecord) {
      bestRecordElement.innerText = `Best record: ${bestRecord}`
    }
  }

  const gravityInterval = setInterval(handleGravity, 20);
  bindEvents();
  generatePipes();
  startGame();
});
