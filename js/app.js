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
let moves= 0;
let openCards = [];
let timeCount = 0;
let gameStarted = false;
let timerLoop;

/*
* start game and build deck
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
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
        checkOpenCards(card);
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

function checkOpenCards(e){
  if (openCards.length == 2) {
    if (openCards[0].dataset.card == openCards[1].dataset.card){
      openCards.forEach(function(card){
        card.classList.add('match');
      });
      clearOpenCards ()
    } else {
      setTimeout(function(){
        openCards.forEach(function(card){
          card.classList.remove('open', 'show');
        });
        clearOpenCards ()
      }, 1050);
    }
    moves ++;
    console.log("Moves counter in checkOpenCards:", moves);
  }
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
