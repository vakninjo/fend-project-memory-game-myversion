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
let numOfStars = 3;
let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
//modal library
//http://github.hubspot.com/vex/api/themes/
vex.defaultOptions.className= 'vex-theme-flat-attack';
vex.dialog.buttons.YES.text = 'Yes!';
vex.dialog.buttons.NO.text = 'No';

//build board
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

function checkOpenCards(){
  if (openCards.length == 2) {
    if (openCards[0].dataset.card == openCards[1].dataset.card){
      matchedCards(openCards);
      matchedCounter ++;
      //debug: console.log("matchedCounter is: ", matchedCounter);
      clearOpenCards ();
    } else {
      noMatch(openCards);
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

//For the following two functions I was not able to get animationend eventlistener integrated in a reasonbale time therefore I used setTimeout to stay on track. Need to refactor this later.
//maybe use: https://teamtreehouse.com/community/shake-effect-with-javascript-only or https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
// animvations using anmimate-css https://github.com/daneden/animate.css/#usage

function matchedCards(openCards) {
  openCards.forEach(function(card){
    card.classList.add('animated', 'tada');
    card.classList.add('match');

  });
}
function noMatch(openCards){
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

function endGame (){
  if (matchedCounter == 8 && openCards.length == 0 ) {
    clearTimeout(timerLoop);
    vex.dialog.confirm({
      message: `Nice! You won the game in ${timeCount} seconds with a total of ${moves} moves. Your rating: ${numOfStars} stars. Play again?`,
      callback: function (value) {
          if (value){
            startNewGame();
          }
        }
    });
  }
}

function startNewGame(){
  clearOpenCards ();
  resetTimer();
  moves= 0;
  matchedCounter = 0;
  //debug console.log("Moves counter when restart is clicked:", moves);
  moveCounter.innerText = moves;
  starList.forEach(function (star){
    star.classList.remove('fa-star-o');
  });
  numOfStars = 3;
  initCards();
  initGame();
}

function gameMoves(){
  moves ++;
  moveCounter.innerText = moves;
}

function clearOpenCards (){
  openCards = [];
}

resetGame.addEventListener('click', function(e){
  startNewGame()
});

// timer feature
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

//tracking game stars
function removeStar(){
  if (moves == 12){
    starList[0].classList.add('fa-star-o');
    numOfStars --;
  } else if (moves ==20) {
    starList[1].classList.add('fa-star-o');
    numOfStars --;
  }
}

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
// complete game V
//  -add pop-up and reset game V
//  -display score V
// make responsive V
// popup winner message and option to reset game V
// fix readme file V
// add leaderboard? will be added in version 2
// add event listener for key game restart? will be added in version 2
//review udacity guidelines V
//https://gomakethings.com/automatically-detecting-when-transitions-end-with-vanilla-javascript/
