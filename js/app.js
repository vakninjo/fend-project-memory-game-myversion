const deck = document.querySelector('.deck');
const cards = ["fa fa-diamond","fa fa-diamond",
                "fa fa-paper-plane-o", "fa fa-paper-plane-o",
                "fa fa-anchor", "fa fa-anchor",
                "fa fa-bolt", "fa fa-bolt",
                "fa fa-bomb", "fa fa-bomb",
                "fa fa-cube", "fa fa-cube",
                "fa fa-leaf","fa fa-leaf",
                "fa fa-bicycle", "fa fa-bicycle"]

const resetGame = document.querySelector('#restart');
const moveCounter = document.querySelector('.moves');
const timerDisplay = document.querySelector('#timer');
const starList = document.querySelector('.stars').querySelectorAll('i');
let moves= 0;
let openCards = [];
let timeCount = 0;
let gameStarted = false;
let timerLoop;
let matchedCounter = 0;
let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

/*
* start game and build deck
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/
function initCards() {
  let cardSet = cards;
  let cardHTML = shuffle(cardSet).map(function(card){
    return createCard(card);
  });
  deck.innerHTML = cardHTML.join('');
}

function createCard(card){
  return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

//game logic
function initGame(){
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(function(card){
    card.addEventListener('click', function(e){
      //start timer
      if (!gameStarted){
        gameStarted = true;
        timeCount = 0;
        setTimeout(startTimer, 1000);
      }
      //open cards while preventing opening more than two cards
      if (openCards.length <= 1){
        openCard(card);
        // check if cards matched
        if (openCards.length == 2){
          checkOpenCards();
        }
      }


    });
  });
}

function openCard(e){
  if (!e.classList.contains('open') && !e.classList.contains('show') && !e.classList.contains('match')){
      openCards.push(e)
      e.classList.add('open', 'show');
    }
}

//For the following function I was not able to get animationend eventlistener integrated in a reasonbale time therefore I used setTimeout to stay on track. Need to refactor this later.
//maybe use: https://teamtreehouse.com/community/shake-effect-with-javascript-only or https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
// animvations using anmimate-css https://github.com/daneden/animate.css/#usage
function checkOpenCards(){
  if (openCards.length == 2) {
    if (openCards[0].dataset.card == openCards[1].dataset.card){
      openCards.forEach(function(card){
        card.classList.add('animated', 'tada');
        card.classList.add('match');
      });
      matchedCounter ++;
      //debug: console.log("matchedCounter is: ", matchedCounter);
      clearOpenCards ()
    } else {
      openCards.forEach(function(card){
        card.classList.add('animated', 'shake');
      });
      setTimeout(function(){
        openCards.forEach(function(card){
          card.classList.remove('open', 'show');
          card.classList.remove('animated', 'shake');
        });
        clearOpenCards ()
      }, 750);

    }
    //update game moves
    gameMoves();
    //check gamescore
    removeStar();
    //check game end
    endGame();
    // debug: console.log("Moves counter in checkOpenCards:", moves);
  }
}

function endGame (){
  if (matchedCounter == 1 && openCards.length == 0 ) {
    clearTimeout(timerLoop);
    setTimeout(function(){
      alert (`you won! and your time was ${timeCount}`);

    }, 1000);
  }
}

function gameMoves(){
  moves ++;
  moveCounter.innerText = moves;
}

function clearOpenCards (){
  openCards = [];
}

resetGame.addEventListener('click', function(e){
  clearOpenCards ();
  moves= 0;
  console.log("Moves counter when restart is clicked:", moves);
  moveCounter.innerText = moves;
  initCards();
  initGame();
  resetTimer();
});

// start the timer
function startTimer(){
    timeCount += 1;
    timerDisplay.innerHTML = timeCount;
    timerLoop = setTimeout(startTimer, 1000);
}

function resetTimer(){
  gameStarted = false;
  timeCount = 0;
  timerDisplay.innerHTML = timeCount;
  clearTimeout(timerLoop);
}

function removeStar(){
  if (moves == 12){
    starList[0].classList.add('fa-star-o');
  } else if (moves ==20) {
    starList[1].classList.add('fa-star-o');
  }
}

// function gameOver(){
//
// }

//supporting functions
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}




//main
initCards();
initGame();

//
// TODO :
// wrong card animation - V
// correct card animation - V
//start track V
// complete game
//  -add pop-up and reset game
//  -display score
//
// popup winner message and option to reset game
//review udacity guidelines
//https://gomakethings.com/automatically-detecting-when-transitions-end-with-vanilla-javascript/

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
