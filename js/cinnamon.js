cinnamonCommand = Module.cwrap('command', 'string', ['string','string'])

var init = function() {

/* Initialize */
var board,
  game = new Chess(),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn');
  capWhiteEl = $('#capWhite');
  capBlackEl = $('#capBlack');

  setInterval(() => {
    // Get the jQuery elements to display captured pieces
    // const capBlackEl = $('#capBlack');  // jQuery object for captured black pieces
    // const capWhiteEl = $('#capWhite');  // jQuery object for captured white pieces
    
    // Call the function with the current FEN string and jQuery objects
    updateCapturedPieces(game.fen(), capBlackEl, capWhiteEl);
}, 1000);

/* Speech Recognition Part */
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
var finalTranscript = '';
var recognition = new window.SpeechRecognition();
recognition.interimResults = true;
recognition.maxAlternatives = 10;
recognition.continuous = true;
recognition.lang = "en-US";
statusEl.html("Please say 'Play as White' or 'Play as Black' to choose your color.");

var spokenWords = [];

recognition.onresult = (event) => {
  let interimTranscript = '';
  for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
    let transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript + '<br>';

      // Listen for color choice
      if (transcript.includes('play as white') || transcript.includes('i want to play white')) {
          chooseColor('w');
          return;
      } else if (transcript.includes('play as black') || transcript.includes('i want to play black')) {
          chooseColor('b');
          return;
        } 
      // Check for "restart game" command
      if (transcript.includes('reset game')) {
        restartGame();
        return; // Exit the loop after restarting the game
      }
      /* Make move */
      console.log(spokenWords[spokenWords.length-1]);

      var please = extractCharNumCharNum(spokenWords[spokenWords.length-1]);
      please = please.replace(/\s/g, ''); // remove spaces
      please = please.toLowerCase();
      console.log(please);
      makeMove(please);

      // makeMove(spokenWords[spokenWords.length-1]);

    } else {
      interimTranscript += transcript;
      spokenWords.push(interimTranscript);
    }
  }
} 

// Restart recognition when it ends
recognition.onend = () => {
  console.log("Speech recognition service disconnected, restarting...");
  recognition.start();  // Restart the recognition service
};

function extractCharNumCharNum(inputString) {
  // Regular expression to match a pattern of char num char num
  const regex = /([a-hA-H][1-8])\s*(?:to|two|too|2)?\s*([a-hA-H][1-8])/i;
  const match = inputString.match(regex);
  return match ? match[1] + match[2] : null;  // If a match is found, return it; otherwise, return null
}
recognition.start();

function restartGame() {
  game.reset(); // Reset the Chess game state
  board.start(); // Reset the board to the starting position
  statusEl.html("Game reset. Please say 'Play as White' or 'Play as Black' to choose your color."); // Show a message to the player
  console.log('Game reset');
}

function makeMove(move) {
  /* PREPROCESSING: "b1a3" */
  move = move.replace(/\s/g, ''); // remove spaces
  move = move.toLowerCase();

  source = move.substring(0, 2);
  target = move.substring(2, 4);

  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' //promote to a queen
  });

  // illegal move
  if (move === null) return 'snapback';
  updateStatus();
  board.position(game.fen());
}

var onDragStart = function(source, piece) {
  // do not pick up pieces if the game is over
  // or if it's not that side's turn
  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
};
var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);
  
  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

var onDrop = function(source, target) {
  removeGreySquares();

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' //promote to a queen
  });

  // illegal move
  if (move === null) return 'snapback';
  updateStatus();
};

// update the board position after the piece snap 
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
};

function engineGo() {
	cinnamonCommand("setMaxTimeMillsec","1000")
	cinnamonCommand("position",game.fen())
	var move=cinnamonCommand("go","")
  makeMove(move);
}
var onMouseoverSquare = function(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

var onMouseoutSquare = function(square, piece) {
  removeGreySquares();
};

var updateStatus = function() {

  if ((game.turn() === 'b' && playerColor === 'w') || (game.turn() === 'w' && playerColor === 'b')) {
    engineGo();
  }

  var status = '';
  var moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  } else if (game.in_draw() === true) { //draw
    status = 'Game over, drawn position';
  } else { // game still on
    status = moveColor + ' to move';

    if (game.in_check() === true) { // check?
      status += ', ' + moveColor + ' is in check';
    }
  }

  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
  updateCapturedPieces(game.fen(),capBlackEl, capWhiteEl )
  capBlackEl.html(capBlack);
  capWhiteEl.html(capWhite);
};

function updateCapturedPieces(fen, capBlackEl, capWhiteEl) {
  // Define the starting set of pieces for each player
  const initialPieceCount = {
      'P': 8, 'N': 2, 'B': 2, 'R': 2, 'Q': 1,  // White pieces
      'p': 8, 'n': 2, 'b': 2, 'r': 2, 'q': 1   // Black pieces
  };

  // Mapping from piece letter to image filename
  const pieceImages = {
      'P': 'wP.png',
      'N': 'wN.png',
      'B': 'wB.png',
      'R': 'wR.png',
      'Q': 'wQ.png',
      'p': 'bP.png',
      'n': 'bN.png',
      'b': 'bB.png',
      'r': 'bR.png',
      'q': 'bQ.png'
  };

  // Extract the board part from the FEN (the first part)
  let board = fen.split(' ')[0];

  // Count the remaining pieces on the board
  let currentPieceCount = {
      'P': 0, 'N': 0, 'B': 0, 'R': 0, 'Q': 0,  // White pieces
      'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0   // Black pieces
  };

  // Loop through the board part of the FEN to count the pieces
  for (let char of board) {
      if (char in currentPieceCount) {
          currentPieceCount[char]++;
      }
  }

  // Clear the previous contents of the captured pieces containers using jQuery
  capBlackEl.empty();  // Use .empty() to clear the content in jQuery
  capWhiteEl.empty();  // Same for the white captured pieces container

  // Calculate and display captured white pieces (captured by black)
  for (let piece of ['P', 'N', 'B', 'R', 'Q']) {
      let capturedCount = initialPieceCount[piece] - currentPieceCount[piece];
      if (capturedCount > 0) {
          for (let i = 0; i < capturedCount; i++) {
              let img = $('<img>', {  // Create an image element using jQuery
                  src: 'img/chesspieces/wikipedia/' + pieceImages[piece],
                  alt: piece,
                  css: { width: '30px', height: '30px' }  // Set the image size
              });
              capBlackEl.append(img);  // Append the image to capBlackEl using jQuery's .append()
          }
      }
  }

  // Calculate and display captured black pieces (captured by white)
  for (let piece of ['p', 'n', 'b', 'r', 'q']) {
      let capturedCount = initialPieceCount[piece] - currentPieceCount[piece];
      if (capturedCount > 0) {
          for (let i = 0; i < capturedCount; i++) {
              let img = $('<img>', {  // Create an image element using jQuery
                  src: 'img/chesspieces/wikipedia/' + pieceImages[piece],
                  alt: piece,
                  css: { width: '30px', height: '30px' }  // Set the image size
              });
              capWhiteEl.append(img);  // Append the image to capWhiteEl using jQuery's .append()
          }
      }
  }
}

/* Function to choose color based on voice command */
function chooseColor(color) {
  playerColor = color;
  if (playerColor === 'w') {
    statusEl.html("You are playing as White. Your move.");
  } else {
    statusEl.html("You are playing as Black. The engine will move first.");
    engineGo(); // Let engine make the first move if player is black
  }
}

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  moveSpeed: 'slow',
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
};
board = new ChessBoard('board', cfg);

updateStatus();
$('#startPositionBtn').on('click', function() {
	board.destroy();
	$(document).ready(init);
});
$('#startListeningBtn').on('click', function() {
	recognition.start();
});
};

$(document).ready(init);
