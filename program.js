var form = document.querySelector("form");
var submitButton = document.querySelector(".button-submit");

function startGame(cardSet, gridSize, players) {
  var Game = document.querySelector(".memory_game");
  Game.innerHTML = "";
  var hasFlippedCard = false;
  var firstCard;
  var secondCard;
  var lockBoard = false;
  var newCard;
  var fieldSize = gridSize * 4;
  var maxTurn = Math.floor(fieldSize / players);
  var winnerModal = document.getElementById("winner-modal");
  var closeButton = document.querySelector(".close");

  closeButton.addEventListener("click", function () {
    function resetGame() {
      // Reset the variables and properties of the game
      currentPlayer = 1;
      playersArray.forEach(function (player) {
        player.turns = 0;
        player.score = 0;
      });
      // Clear the memory game field
      var memoryGame = document.querySelector(".memory_game");
      memoryGame.innerHTML = "";
      var playerList = document.getElementById("players-list");
      playerList.innerHTML = "";
      // Close the winner modal
      winnerModal.style.display = "none";
    }
    resetGame();
  });

  function displayWinner(winner) {
    var winnerName = document.getElementById("winner-name");
    var winnerScore = document.getElementById("winner-score");
    winnerName.innerHTML = winner.name;
    winnerScore.innerHTML = winner.score;
    winnerModal.style.display = "block";
  }

  var currentPlayer = 1; // keep track of the current player
  var playersArray = []; // array to hold players' names

  // Create an array of players based on the number of players selected
  for (var i = 1; i <= players; i++) {
    playersArray.push({
      name: "Player " + i,
      turns: 0,
      score: 0,
    });
  }

  function displayPlayers() {
    var playersList = document.getElementById("players-list");
    playersList.innerHTML = "";
    playersArray.forEach(function (player, index) {
      var playerListItem = document.createElement("li");
      var playerListItemScore = document.createElement("span");
      playerListItem.innerHTML = player.name + " Score: ";
      playerListItem.setAttribute("id", "player-" + (index + 1));
      playerListItemScore.innerHTML = player.score;
      playerListItemScore.setAttribute("id", `player-${index + 1}-score`);
      playerListItem.appendChild(playerListItemScore);
      playersList.appendChild(playerListItem);
    });
  }

  function updatePlayers() {
    var currentPlayerId = "player-" + currentPlayer;
    var currentPlayerElement = document.getElementById(currentPlayerId);
    var players = document.querySelectorAll("#players-list li");
    players.forEach(function (player) {
      player.classList.remove("active");
    });
    currentPlayerElement.classList.add("active");
  }

  displayPlayers();
  updatePlayers();

  (function createNewCards() {
    // Change the images on the cards based on the card set
    var cardImages;
    switch (cardSet) {
      case "cats":
        cardImages = [
          "images/cat.jpeg",
          "images/cat2.jpeg",
          "images/cat3.jpeg",
          "images/cat4.jpg",
          "images/cat5.png",
          "images/cat6.png",
          "images/cat7.png",
          "images/cat8.png",
          "images/cat9.png",
          "images/cat10.png",
        ];
        break;
      case "dogs":
        cardImages = [
          "images/dog.png",
          "images/dog2.jpeg",
          "images/dog3.jpeg",
          "images/dog4.jpg",
          "images/dog5.png",
          "images/dog6.png",
          "images/dog7.png",
          "images/dog8.jpeg",
          "images/dog9.png",
          "images/dog10.jpeg",
        ];
        break;
      case "dinosaurs":
        cardImages = [
          "images/dinosaur.png",
          "images/dino2.png",
          "images/dino3.png",
          "images/dino4.png",
          "images/dino5.png",
          "images/dino6.jpg",
          "images/dino7.jpeg",
          "images/dino8.png",
          "images/dino9.png",
          "images/dino10.jpeg",
        ];

        break;
      default:
        cardImages = [
          "images/cat.jpeg",
          "images/cat2.jpeg",
          "images/cat3.jpeg",
          "images/cat4.jpg",
          "images/cat5.png",
          "images/cat6.png",
          "images/cat7.png",
          "images/cat8.png",
          "images/cat9.png",
          "images/cat10.png",
        ];
    }
    // Create new card elements based on gridSize value
    var cardImagesSlice = cardImages.slice(0, fieldSize / 2);
    for (var i = 0; i < fieldSize; i++) {
      newCard = document.createElement("div");
      newCard.classList.add("memory_card");
      newCard.innerHTML = `<img class="front-face_card" src="${
        cardImagesSlice[i % (fieldSize / 2)]
      }" alt="front-face"/><img class="question_card" src="images/question_card.png" alt="back-face" />`;
      newCard.addEventListener("click", flipCard);
      Game.appendChild(newCard);
    }
    shuffleCards();
  })();

  function allCardsFlipped() {
    var flippedCards = document.querySelectorAll(".memory_card.flip");
    return flippedCards.length === fieldSize;
  }

  function getWinner() {
    var winner = playersArray[0];
    if (playersArray.length > 1)
      playersArray.forEach(function (player) {
        if (player.score > winner.score) {
          winner = player;
        }
        if (player.score === winner.score && player !== winner) {
          winner.name = "all players";
        }
      });
    return winner;
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (playersArray[currentPlayer - 1].turns >= maxTurn) {
      playersArray[currentPlayer - 1].turns = 0;
      currentPlayer = (currentPlayer % playersArray.length) + 1;
      return;
    }
    playersArray[currentPlayer - 1].turns += 1; // increment the player's turns
    this.classList.add("flip");

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }
    secondCard = this;
    checkForMatchingCards();
  }

  function checkForMatchingCards() {
    if (
      firstCard.querySelector("img").src === secondCard.querySelector("img").src
    ) {
      playersArray[currentPlayer - 1].score++;
      var playerScore = document.getElementById(
        `player-${currentPlayer}-score`
      );
      playerScore.innerHTML = playersArray[currentPlayer - 1].score;
      matchDisabler();
    } else {
      unflipNonMatchingCards();
    }

    if (allCardsFlipped()) {
      var winner = getWinner();
      displayWinner(winner);
    }
  }

  function unflipNonMatchingCards() {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
      currentPlayer = (currentPlayer % playersArray.length) + 1;
      updatePlayers();
    }, 700);
  }

  function matchDisabler() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetBoard();
    currentPlayer = (currentPlayer % playersArray.length) + 1;
    updatePlayers();
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function shuffleCards() {
    Game.querySelectorAll(".memory_card").forEach((card) => {
      let randomPosition = Math.floor(Math.random() * fieldSize);
      card.style.order = randomPosition;
    });
  }
}

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  var formData = new FormData(form);
  var gridSize = formData.get("grid");
  var players = formData.get("players");
  var cardSet = formData.get("card-set");

  console.log("Grid size: " + gridSize);
  console.log("Number of players: " + players);
  console.log("Card set: " + cardSet);

  startGame(cardSet, gridSize, players);
});
