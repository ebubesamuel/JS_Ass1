var Cards = document.querySelectorAll('.memory_card');

var hasFlippedCard = false;
var firstCard;
var secondCard;
var lockBoard = false;

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this

        return; 
    }
    
        //hasFlippedCard = false;
        secondCard = this;
        // console.log(firstCard.dataset.framework);
        // console.log(secondCard.dataset.framework);

        checkForMatchingCards(); 
    
}

function checkForMatchingCards() {
    if (firstCard.dataset.framework ===
        secondCard.dataset.framework) {
           matchDisabler();
        }
        //console.log('Function was executed successfully!')
        else{
           unflipNonMatchingCards(); 
        }
}

function unflipNonMatchingCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
    }, 700);
}

function matchDisabler(){
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
    //console.log('Function was executed successfully!')

}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false,false];
    [firstCard, secondCard] = [null, null];

}

(function shuffleCards() {
    Cards.forEach(card => {
        let randomPosition = Math.floor(Math.random()*12);
        card.style.order = randomPosition;
    });
}) ();
Cards.forEach(Card => Card.addEventListener('click',flipCard));

// const ArrayCards= [
//     {
//         name: 'cat',
//         img:'images/cat.png'

//     },

//     {
//         name: 'dog',
//         img: 'images/dog.png'
//     },

//     {
//         name: 'dinosaur',
//         img: 'images/dinosaur.png'
//     },

//     {
//         name: 'blank',
//         img: 'images/white_card.png'
//     },

//     {
//         name: 'question card',
//         img: 'images/question_card.png'
//     },
// ]