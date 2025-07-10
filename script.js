let score = 0;
let missed = 0;
let spawnInterval;
let spawnTimer;
let gameTimer;
let timeLeft = 60;
let countdownTimer;

function getRandomLetter() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  return letters[Math.floor(Math.random() * letters.length)];
}

function spawnBalloon() {
  const letter = getRandomLetter();
  const colors = ['red', 'green', 'blue', 'orange', 'purple', 'yellow'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const balloon = $('<div class="balloon"></div>').text(letter).css({
    backgroundColor: randomColor
  });

  const leftPos = Math.random() * ($(window).width() - 50);
  balloon.css({ left: leftPos + 'px', bottom: '0px' });

  $('#gameArea').append(balloon);

  balloon.animate({ bottom: '100%' }, 5000, function () {
    if (!$(this).data('popped')) {
      missed++;
      score = Math.max(0, score - 1);
      $('#missed').text('Missed: ' + missed);
      $('#score').text('Score: ' + score);
    }
    $(this).remove();
  });

  balloon.attr('data-letter', letter);
  balloon.data('popped', false);
}

function startGame() {
  score = 0;
  missed = 0;
  timeLeft = 60;

  $('#score').text('Score: ' + score);
  $('#missed').text('Missed: ' + missed);
  $('#timer').text('Time: ' + timeLeft);

  spawnTimer = setInterval(spawnBalloon, spawnInterval);

  gameTimer = setTimeout(endGame, 60000); // TIMER

  countdownTimer = setInterval(function () {
    timeLeft--;
    $('#timer').text('Time: ' + timeLeft);
  }, 1000);
}

function endGame() {
  clearInterval(spawnTimer);
  clearTimeout(gameTimer);
  clearInterval(countdownTimer);
  $('.balloon').remove();

  $('#finalScore').text('Your Score: ' + score);
  $('#finalMissed').text('Missed: ' + missed);
  $('#endScreen').fadeIn();
}

$(document).on('keypress', function (e) {
  const pressedKey = e.key.toLowerCase();

  $('.balloon').each(function () {
    if ($(this).attr('data-letter') === pressedKey && !$(this).data('popped')) {
      $(this).data('popped', true);
      $(this).stop().remove();
      score++;
      $('#score').text('Score: ' + score);
    }
  });
});

$('#retryBtn').on('click', function () {
  $('#endScreen').fadeOut();
  $('#difficultyMenu').fadeIn();
  $('.diff-btn').prop('disabled', false);
  setupDifficultyButtons();
});

function setupDifficultyButtons() {
  $('.diff-btn').off('click').on('click', function () {
    spawnInterval = parseInt($(this).attr('data-speed'));
    $('#difficultyMenu').fadeOut();
    $('#endScreen').fadeOut();
    $('.diff-btn').prop('disabled', true);
    startGame();
  });
}

setupDifficultyButtons();
