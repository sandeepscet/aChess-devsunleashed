// @ts-nocheck
/* eslint-disable */

import { invoke } from '@forge/bridge';
import { view } from '@forge/bridge';

const issueTypes = {   "EPIC": "10000", "BUG": "10004", "STORY": "10001", "SUBTASK": "10003" , "TASK": "10002" };
const context = await view.getContext();
const accountId = context.accountId;
const userdetails = await invoke('getCurrentUserDetails');
const currentDate = new Date(Date.now()).toLocaleString();
const issue = context.extension.issue;
const project = context.extension.project;






var board = null
var $board = $('#myBoard')
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'
var squareClass = 'square-55d63'
var squareToHighlight = null
var colorToHighlight = null


function removeGreySquares () {
 $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square) {
 var $square = $('#myBoard .square-' + square)

 var background = whiteSquareGrey
 if ($square.hasClass('black-3c85d')) {
   background = blackSquareGrey
 }

 $square.css('background', background)
}


function onDragStart (source, piece, position, orientation) {
 // do not pick up pieces if the game is over
 if (game.game_over()) return false

 // only pick up pieces for the side to move
 if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
     (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
   return false
 }
}

function onDrop (source, target) {
  const confirmed = confirm('Sure?');
  if(!confirmed) return 'snapback';

 // see if the move is legal
 var move = game.move({
   from: source,
   to: target,
   promotion: 'q' // NOTE: always promote to a queen for example simplicity
 })

 // illegal move
 if (move === null) return 'snapback'
  
 createSubtask(source, target);
 updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
 board.position(game.fen())
}



function onMouseoverSquare (square, piece) {
 // get list of possible moves for this square
 var moves = game.moves({
   square: square,
   verbose: true
 })

 // exit if there are no moves available for this square
 if (moves.length === 0) return

 // highlight the square they moused over
 greySquare(square)

 // highlight the possible squares for this piece
 for (var i = 0; i < moves.length; i++) {
   greySquare(moves[i].to)
 }
}

function onMouseoutSquare (square, piece) {
 removeGreySquares()
}

const gamestatus = ["GAMEOVER_CHECKMATE" , "GAMEOVER_DRAWPOSITION" , "MOVE_BLACK" , "MOVE_WHITE" , "MOVE_BLACK_CHECK" , "MOVE_WHITE_CHECK" ];

function getGameStatus(){
 var status = ''

 // checkmate?
 if (game.in_checkmate()) {
   status = "GAMEOVER_CHECKMATE";
 }

 // draw?
 else if (game.in_draw()) {
   status = "GAMEOVER_DRAWPOSITION"
 }

 // game still on
 else {
   if (game.turn() === 'b') {
     status = "MOVE_BLACK"
   }else{
     status = "MOVE_WHITE"
   }

   // check?
   if (game.in_check()) {
     if (game.turn() === 'b') {
       status = "MOVE_BLACK_CHECK"
     }else{
       status = "MOVE_WHITE_CHECK"
     }
   }
 }
   return status;
}

async function createSubtask(source, target){
        const title = `${userdetails.displayName} moved from ${source} to ${target}`;

        const invokeResponse =  await invoke('createStory', { title:title , accountId : accountId , projectKey : "10000" , parentKey : "COM-17" , issueType : issueTypes.SUBTASK});
        if(invokeResponse && invokeResponse.status && invokeResponse.status.status === 201)
        {
            const issueData = JSON.parse(invokeResponse.data);
            alert(issueData.key + " created succesfully for your move");
        }
        else
        {
          alert("Unable to create subtask");
        }

}

function updateStatus () {
 var status = ''

 var moveColor = 'White'
 if (game.turn() === 'b') {
   moveColor = 'Black'
 }

 // checkmate?
 if (game.in_checkmate()) {
   status = 'Game over, ' + moveColor + ' is in checkmate.'
 }

 // draw?
 else if (game.in_draw()) {
   status = 'Game over, drawn position'
 }

 // game still on
 else {
   status = moveColor + ' to move'

   // check?
   if (game.in_check()) {
     status += ', ' + moveColor + ' is in check'
   }
 }


 $status.html(status)
 $fen.html(game.fen())
 $pgn.html(game.pgn())
}


function highlightMove (team , source, target , san) {
  // exit if the game is over
 if (game.game_over()) return


 if (team === 'w') {
   $board.find('.' + squareClass).removeClass('highlight-white')
   $board.find('.square-' + source).addClass('highlight-white')
   $board.find('.square-' + target).addClass('highlight-green')
   squareToHighlight = target
   colorToHighlight = 'white'
 } else {
   $board.find('.' + squareClass).removeClass('highlight-black')
   $board.find('.square-' + source).addClass('highlight-black')
   $board.find('.square-' + target).addClass('highlight-green')
   squareToHighlight = target
   colorToHighlight = 'black'
 }
 game.move(san)
 board.position(game.fen())

}

function onMoveEnd () {
 $board.find('.square-' + squareToHighlight)
   .addClass('highlight-' + colorToHighlight)
}

var config = {
 draggable: true,
 position: 'start',
 onDragStart: onDragStart,
 onDrop: onDrop,
 onMouseoutSquare: onMouseoutSquare,
 onMouseoverSquare: onMouseoverSquare,
 onSnapEnd: onSnapEnd
}
board = Chessboard('myBoard', config)

updateStatus();

$(document).ready(function(){
    $('#hightlightMove').click(function(){
        highlightMove('w' , 'c2' , 'c4', 'c4');
    });      
    
    $(".team").autocomplete({
      minLength: 2,
      source: async function( request, response ) {
        const invokeResponse =  await invoke('userSearchByProject', { query: request.term , issueKey : "COM-15" })
        if(invokeResponse && invokeResponse.status && invokeResponse.status.status === 200)
        {
          const userdata = JSON.parse(invokeResponse.data);
          console.log(userdata);
          const automcompleteData = userdata.map(item => {return  {"value" : item.accountId , "label" :  item.displayName + '(' + item.emailAddress   + ')' }});
          console.log(automcompleteData);
          response(automcompleteData);
        }else{
          response([]);
        }        
      },
      select: function( event, ui ) {
        const eleId = $($(this)[0]).attr('id');
        const $eleIdResult =  $('#'+eleId+'result');
        const currentValues =  $eleIdResult.data('values') ? $eleIdResult.data('values') : []; 
        currentValues.push(ui.item.value);
        $eleIdResult.append(ui.item.label + ',').data('values' , currentValues);
        return false;
      }
    });

    $('#startgame').click(async function(){
        const gameStatus = getGameStatus();
        const title = `${gameStatus === 'MOVE_BLACK' ? "Black" : "White"} to Move`;
        const invokeResponse =  await invoke('createStory', { title:title , accountId : accountId , projectKey : "10000" , parentKey : "COM-15" , issueType : issueTypes.STORY});
        console.log(invokeResponse);
        if(invokeResponse && invokeResponse.status && invokeResponse.status.status === 201)
        {
            //no
        }
        else
        {
          alert("Unable to create Story");
        }
    });

    
});