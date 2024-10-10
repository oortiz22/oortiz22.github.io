cinnamonCommand = Module.cwrap('command', 'string', ['string','string'])

var init = function() {

/* Initialize */
var board,
  game = new Chess(),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn');

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
      makeMove(spokenWords[spokenWords.length-1]);

    } else {
      interimTranscript += transcript;
      spokenWords.push(interimTranscript);
    }
  }
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
};

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
