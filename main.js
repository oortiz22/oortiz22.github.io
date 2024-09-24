// Initialize the chessboard
var board = Chessboard('board', {
    draggable: true,   // Allow pieces to be dragged
    position: 'start', // Set the board to the starting position
    onDrop: handleMove // Function to call when a piece is dropped
});

// Initialize the chess.js library (or similar) for chess logic
var game = new Chess();

// Function to handle moves
function handleMove(source, target, piece, newPos, oldPos, orientation) {
    // Check if the move is valid
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Always promote to a queen for simplicity
    });

    // If the move is illegal, snap the piece back to its original square
    if (move === null) return 'snapback';

    // Update the board position
    updateStatus();
}

// Function to update the game status
function updateStatus() {
    var status = '';

    if (game.in_checkmate()) {
        status = 'Checkmate! Game over.';
    } else if (game.in_draw()) {
        status = 'Draw! Game over.';
    } else {
        var moveColor = game.turn() === 'b' ? 'Black' : 'White';

        // Check for check
        if (game.in_check()) {
            status = moveColor + ' is in check!';
        } else {
            status = moveColor + ' to move.';
        }
    }

    // Display the status on the webpage
    document.getElementById('status').innerText = status;
}

// Button to reset the game
document.getElementById('resetBtn').addEventListener('click', function() {
    game.reset();       // Reset the game logic
    board.start();      // Reset the board to the starting position
    updateStatus();     // Update the status display
});

// Initial status display
updateStatus();