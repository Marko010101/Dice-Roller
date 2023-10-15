'use strict';

// Selecting elements
const body = document.querySelector('body');
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const mainTag = document.querySelector('main');

// Selecting classes for modal
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');

let scores, currentScore, activePlayer, playing;

// Initialize rollingTimes outside the autoPlayer function
let rollingTimes = Math.trunc(Math.random() * 5) + 2;

// Starting conditions
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  // Reset total scores
  score0El.textContent = 0;
  score1El.textContent = 0;

  // Reset current scores
  current0El.textContent = 0;
  current1El.textContent = 0;

  // Add the first player as active, remove winner class, and hide the dice
  player1El.classList.remove('player--active');
  player0El.classList.add('player--active');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  diceEl.classList.add('hidden');
};
init();
const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');

  if (activePlayer === 1 && playing) {
    rollingTimes = Math.trunc(Math.random() * 6) + 1;
    console.log(`I am planning to roll ${rollingTimes}-times`);
    // Disable "Hold" button for player--1
    document.getElementById('btnHold').disabled = true;
    setTimeout(autoPlayer, 700);
  } else {
    // Enable "Hold" button for player--0
    document.getElementById('btnHold').disabled = false;
  }
};

const simulateDiceRoll = function () {
  const diceForAuto = Math.trunc(Math.random() * 6) + 1;
  // console.log(diceForAuto);
  // Display the dice
  diceEl.classList.remove('hidden');
  diceEl.src = `dice-${diceForAuto}.png`;

  if (diceForAuto !== 1) {
    // Add the rolled value to the current score
    currentScore += diceForAuto;
    document.getElementById(`current--${activePlayer}`).textContent =
      currentScore;
    // Decrease rollingTimes and continue the autoPlayer function with a delay
    rollingTimes--;
    setTimeout(autoPlayer, 700);
  } else {
    // If rolled 1, switch to the other player and continue after a delay
    switchPlayer();
    setTimeout(autoPlayer, 700);
  }
};

const autoPlayer = function () {
  // Check if player--1 is active and the game is still ongoing
  if (player1El.classList.contains('player--active') && playing) {
    if (rollingTimes > 0) {
      simulateDiceRoll();
    } else {
      // If rollingTimes is 0, disable the "Hold" button for player--1
      document.getElementById('btnHold').disabled = true;
      // Programmatically trigger a click event on the "Hold" button
      const clickEvent = new Event('click', {
        bubbles: true,
        cancelable: true,
      });
      document.getElementById('btnHold').dispatchEvent(clickEvent);
    }
  }
};

// Rolling dice functionality
btnRoll.addEventListener('click', function () {
  if (playing && player0El.classList.contains('player--active')) {
    const dice = Math.trunc(Math.random() * 6) + 1;

    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;

    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchPlayer(); // Call switchPlayer when player--0 rolls a 1
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    // Add current score to the active player's score
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    if (scores[activePlayer] >= 100) {
      // Finish the game
      playing = false;
      diceEl.classList.add('hidden');

      // Add the 'player--winner' class and remove 'player--active' class for the winning player
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');

      // Display the congratulations modal
      const openModal = function () {
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
      };

      const closeModal = function () {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
      };

      if (player0El.classList.contains('player--winner')) {
        document.querySelector(
          '.modal-paragraph'
        ).innerHTML = `<span class="nameStyle">You</span> - have won the game!🍾🤩 <br> <span class="closingDescription">(you can close this window by clicking on the outside area of the window, by clicking the 'X' button, or by pressing the 'Escape' key.)</span>`;
      } else if (player1El.classList.contains('player--winner')) {
        document.querySelector('.modal-title').textContent =
          'You lost the game';
        document.querySelector(
          '.modal-paragraph'
        ).innerHTML = `<span class="nameStyle">I</span> - am winner, try again! 😋😉 <br> <span class="closingDescription">(you can close this window by clicking on the outside area of the window, by clicking the 'X' button, or by pressing the 'Escape' key.)</span>`;
      }

      openModal();
      body.addEventListener('click', function (e) {
        if (e.target === body) {
          closeModal();
        }
      });
      btnCloseModal.addEventListener('click', closeModal);

      overlay.addEventListener('click', closeModal);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
          closeModal();
        }
      });
    } else {
      switchPlayer(); // Call switchPlayer to switch to the other player
    }
  }
});

btnNew.addEventListener('click', init);

// Start the game with Player 0's turn
autoPlayer();
