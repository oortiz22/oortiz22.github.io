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
    transcript = transcript.toLowerCase();
    if (event.results[i].isFinal) {
      finalTranscript += transcript + '<br>';

      // Listen for color choice
      if (transcript.includes('play as white') || transcript.includes('i want to play white') 
        || transcript.includes('white')) {
          chooseColor('w');
          return;
      } else if (transcript.includes('play as black') || transcript.includes('i want to play black') 
        || transcript.includes('black')) {
          chooseColor('b');
          return;
        } else if (transcript.includes('knight') || transcript.includes('night') || transcript.includes('bishop') || transcript.includes('rook') || transcript.includes('queen') || transcript.includes('king') || transcript.includes('pawn')) {
          console.log(spokenWords[spokenWords.length-1]);
          let pieceMove = extractPieceMove(spokenWords[spokenWords.length-1]);
          var please = extractCharNumCharNum(pieceMove);
          console.log("final:",please);
          makeMove(please);
        } else if (transcript.includes('restart') || transcript.includes('reset')) {
          restartGame();
          return; // Exit the loop after restarting the game
        } else{
          /* Make move */
          console.log(spokenWords[spokenWords.length-1]);

          var please = extractCharNumCharNum(spokenWords[spokenWords.length-1]);
          please = please.replace(/\s/g, ''); // remove spaces
          please = please.toLowerCase();
          console.log(please);
          makeMove(please);
        }
    } else {
      interimTranscript += transcript;
      spokenWords.push(interimTranscript);
    }
  }
} 

// Restart recognition when it ends
recognition.onend = () => {
  console.log("Speech recognition service disconnected, restarting...");
  recognition.start();
};

// Function to extract piece and target square from voice input (e.g., "knight to a5")
function extractPieceMove(transcript) {
  console.log(transcript);
  const pieceNames = {
    night: 'n',
    knight: 'n',
    bishop: 'b',
    rook: 'r',
    queen: 'q',
    king: 'k',
    pawn: 'p'
  };
  let actual = null;
  let piece = null;

  for (let key in pieceNames) {
    if (transcript.includes(key)) {
      actual = key;
      piece = pieceNames[key];
      break;
    }
  }

  const targetSquare = extractTargetSquare(transcript); // Get the target square from the transcript (e.g., "a5")
  console.log("tar:",targetSquare);
  const sourceSquare = findPieceLocation(piece, targetSquare); // Get the piece's location on the board
  console.log("source",sourceSquare);
  console.log("piece:",actual);
  const updatedTranscript = transcript.replace(actual, sourceSquare);
  return updatedTranscript;  // Return the updated transcript with the piece location replaced

}

// Function to find the target square in the transcript (e.g., "a3", "a 3")
function extractTargetSquare(transcript) {
  // Regular expression to match a square like 'a3' or 'a 3' (with or without space)
  const regex = /([a-h])\s*([1-8])/i;
  const match = transcript.match(regex);
  return match ? match[1] + match[2] : null;  // Return concatenated target square, e.g., 'a3'
}
// Function to find the location of the piece that can legally move to targetSquare
function findPieceLocation(piece, targetSquare) {
  const fen = game.fen().split(' ')[0]; // Get the board part of the FEN
  const rows = fen.split('/'); // FEN rows are separated by '/'
  let pieceColor = game.turn() === 'w' ? piece.toUpperCase() : piece; // Capitalize if it's white's turn
  let location = null;

  // Iterate through each row in the FEN string to find all pieces of the given type
  for (let row = 0; row < rows.length; row++) {
    let col = 0;
    for (let char of rows[row]) {
      if (isNaN(char)) { // If it's a piece (not a number indicating empty spaces)
        if (char === pieceColor) {
          const squarePosition = String.fromCharCode(97 + col) + (8 - row); // Convert to board notation, e.g., 'e4'
          // Check if the piece at squarePosition can legally move to targetSquare
          const moves = game.moves({ square: squarePosition, verbose: true });
          
          if (moves.some(move => move.to === targetSquare)) {
            return squarePosition; // Return the first valid piece that can move to the target square
          }
        }
        col++;
      } else {
        col += parseInt(char); // Skip empty spaces based on the number
      }
    }
  }
  return null; // Return null if no piece is found that can move to the target square
}

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
  pgnEl.html(game.pgn());
  document.getElementById('welcomePage').style.display = 'block'
  document.getElementById('mainPage').style.display = 'none'
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

function engineGo() {
	cinnamonCommand("setMaxTimeMillsec","1000")
	cinnamonCommand("position",game.fen())
	var move=cinnamonCommand("go","")
  makeMove(move);
}

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
    // Hide the welcome page and show the main page
    document.getElementById('welcomePage').style.display = 'none'
    document.getElementById('mainPage').style.display = 'block'
  } else {
    statusEl.html("You are playing as Black. The engine will move first.");
    // Hide the welcome page and show the main page
    document.getElementById('welcomePage').style.display = 'none'
    document.getElementById('mainPage').style.display = 'block'
    engineGo(); // Let engine make the first move if player is black
  }
}

var cfg = {
  position: 'start',
  moveSpeed: 'slow',
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
