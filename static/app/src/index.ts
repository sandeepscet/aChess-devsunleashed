// @ts-nocheck
/* eslint-disable */

import { invoke, view, router } from '@forge/bridge';

const issueTypes = {   "EPIC": "10000", "BUG": "10004", "STORY": "10001", "SUBTASK": "10003" , "TASK": "10002" };
const gameTypS = {   "EPIC": "EPIC",  "STORY": "STORY", "SUBTASK": "SUBTASK" ,"OTHER" : "OTHER" };
const gameModes = { "TODO" : "TODO" , "EDIT" : "EDIT" , "VIEW" : "VIEW" , "HIGHLIGHT" : "HIGHLIGHT"};
const gameLabel = "a-chess";
let whiteteam = [], blackteam = [];
const context = await view.getContext();
const accountId = context.accountId;
const currentDate = new Date(Date.now()).toLocaleString();
const issue = context.extension.issue;
const siteurl = context.siteUrl;
const project = context.extension.project;


const userdetails = await invoke('getCurrentUserDetails');
const issuedetails = await invoke('getIssueDetails', {issueKey : issue.key}); 
const parentdetails = { isGameIssue : false , 'parentKey' : '' , 'parentKeyType' : '' , 'hasSubtasks' : false};

if(!$.isEmptyObject(issuedetails) && !$.isEmptyObject(issuedetails.fields)){
  const fields = issuedetails.fields;

  parentdetails['isGameIssue'] = fields.labels.indexOf(gameLabel) !== -1;
  if(!$.isEmptyObject(fields.parent))
  {
    parentdetails['parentKey'] = fields.parent.key;
    parentdetails['parentKeyType'] = fields.parent.fields.issuetype.id;
    parentdetails['hasSubtasks'] = fields.subtasks.length > 0;
    
  }
}


const gameType = get_gameType(issue.typeId , parentdetails);
const gameMode = get_gameMode(gameType , parentdetails, issuedetails);

let parentfullDetails =  {};
if(gameType === gameTypS.SUBTASK)
{
  parentfullDetails = await invoke('getIssueDetails', {issueKey : parentdetails['parentKey']});

}

const epicKey = gameType == gameTypS.EPIC ? issue.key : (gameType == gameTypS.STORY ? parentdetails.parentKey : (gameType === gameTypS.SUBTASK ? parentfullDetails.fields.parent.key : ''));
const storageKeys = {"CONFIG" : 'config'+epicKey , "HISTORY" : "history"+epicKey, "VOTES" : "votes"+epicKey};

const gamedetails = await getGamedetails();
const gameHistory = await getGameHistory(); 

let currentMove = {};
if(gameType === gameTypS.SUBTASK)
{
  currentMove = gameHistory.filter((element) => { if(element.subtaskKey === issue.key){ return element; } });
  currentMove = currentMove.length > 0 ? currentMove[0] : {};
}

$('#loader').addClass('d-none');// todo remove later and uncomment document ready
console.log({context});
console.log({epicKey});
console.log({issuedetails});
console.log({parentdetails});
console.log({gameMode});
console.log({gameType});
console.log({gamedetails});
console.log({gameHistory});
console.log({currentMove});






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
  if(gameMode !== gameModes.EDIT) return;

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
  
 updatemove(source, target);
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
        let subtaskKey = '';

        const invokeResponse =  await invoke('createStory', { title:title , accountId : accountId , projectKey : project.id , parentKey : issue.key , issueType : issueTypes.SUBTASK});
        
        if(invokeResponse && invokeResponse.status && invokeResponse.status.status === 201)
        {
            const issueData = JSON.parse(invokeResponse.data);
            subtaskKey = issueData.key;
            show_success('Sub-Task ('+issueData.key + ") has been created succesfully of your move");
        }
        else
        {
          show_error("Unable to create subtask, please try again or check for permission with admin");
        }
        return subtaskKey;

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
 draggable: gameMode === gameModes.EDIT ? true :false,
 position: gameMode === gameModes.TODO ? 'start' : (gameType === gameTypS.SUBTASK ? currentMove.FEN: (gamedetails.FEN ? gamedetails.FEN: 'start')),
 onDragStart: onDragStart,
 onDrop: onDrop,
 onMouseoutSquare: onMouseoutSquare,
 onMouseoverSquare: onMouseoverSquare,
 onSnapEnd: onSnapEnd
}
board = Chessboard('myBoard', config);
if(gamedetails.FEN)
{
  game = new Chess(gamedetails.FEN);
}

updateStatus();

$(document).ready(function(){
    initializeGame();    

    $('#hightlightMove').click(function(){
        highlightMove('w' , 'c2' , 'c4', 'c4');
    });   

    $('#approve').click(async function(){
      updateFenDetails();
      const gameStatus = getGameStatus();
      const title = `${gameStatus === 'MOVE_BLACK' ? "Black" : "White"} to Move`;
      const invokeResponse =  await invoke('createStory', { title:title , accountId : accountId , projectKey : project.id , parentKey : epicKey , issueType : issueTypes.STORY});
      console.log(invokeResponse);
      if(invokeResponse && invokeResponse.status && invokeResponse.status.status === 201)
      {
        const issueData = JSON.parse(invokeResponse.data);
        show_success('Story(' + issueData.key + ") created succesfully for another Team to move");
        $('#action').addClass('d-none');
      }
      else
      {
        show_error("Unable to create Story, Please try again or check permission with admin");
      }
      //const res = await invoke("completeTask" , { issueKey : issue.key});
      
  });   
    

    $(".team").autocomplete({
      minLength: 2,
      source: async function( request, response ) {
        const invokeResponse =  await invoke('userSearchByProject', { query: request.term , issueKey : epicKey })
        if(invokeResponse && invokeResponse.status && invokeResponse.status.status === 200)
        {
          const userdata = JSON.parse(invokeResponse.data);
          console.log(userdata);
          const automcompleteData = userdata.map(item => {return  {"value" : item.accountId , "label" :  item.displayName + '(' + item.emailAddress   + ')' }});
          response(automcompleteData);
        }else{
          response([]);
        }        
      },
      select: function( event, ui ) {
        const eleId = $($(this)[0]).attr('id');
        const $eleIdResult =  $('#'+eleId+'Info');

        if(eleId === 'whiteteam')
        {
          whiteteam.push(ui.item.value);
        }
        else
        {
          blackteam.push(ui.item.value);
        }
        const currentValues =  $eleIdResult.data('values') ? $eleIdResult.data('values') : []; 
        currentValues.push(ui.item.value);

        $eleIdResult.append(ui.item.label + ',').data('values' , currentValues);
        return false;
      }
    });

    $('#startgame').click(async function(){
        if(isStartConfigValid())
        {
          const gameStatus = getGameStatus();
          const title = `${gameStatus === 'MOVE_BLACK' ? "Black" : "White"} to Move`;

          const gamedetails = {"whiteteam" : whiteteam, "blackteam" : blackteam, "startDate" : currentDate , "createdBy" :accountId , voteCount : $('#votecount').val()};

          const gameRes = saveGamedetails(gamedetails);
          const invokeResponse =  await invoke('createStory', { title:title , accountId : accountId , projectKey : project.id , parentKey : issue.key , issueType : issueTypes.STORY});
          console.log(invokeResponse);
          if(invokeResponse && invokeResponse.status && invokeResponse.status.status === 201)
          {
            const updateIssueRes =  await invoke('updateIssue', {summary : `Game#${issue.key} Started` , label: gameLabel , issueKey:issue.key});
            const issueData = JSON.parse(invokeResponse.data);
            show_success('Story(' + issueData.key + ") created succesfully for your Team to move");
            $('#config').addClass('d-none');
            $('#startgame').addClass('d-none');
            $('#myBoard').removeClass('d-none');
          }
          else
          {
            show_error("Unable to create Story, Please try again or check permission with admin");
          }
        }
        else
        {
          show_error("Please add required info to start the Game");
        }
    });

    $('#history').click(function (){
      router.open($(this).attr('href'));
      return false;
    });
});

function show_error(msg){
  $('#notification').find('.alert').addClass('d-none');
  $('#notification').find('.alert-danger').removeClass('d-none').html(msg);  
}

function show_success(msg){
  $('#notification').find('.alert').addClass('d-none');
  $('#notification').find('.alert-success').removeClass('d-none').html(msg);  
}

function show_info(msg){
  $('#notification').find('.alert').addClass('d-none');
  $('#notification').find('.alert-info').removeClass('d-none').html(msg);  
}

function isStartConfigValid (){
  return true;
}

function get_gameType(issueType , parentdetails){
  let gameType;
  switch (issueType) {
    case issueTypes.EPIC:
      gameType = gameTypS.EPIC;
      break;
    case issueTypes.STORY:
      gameType = parentdetails.isGameIssue ? gameTypS.STORY : gameTypS.OTHER;
      break;
    case issueTypes.SUBTASK:
      gameType = parentdetails.isGameIssue ? gameTypS.SUBTASK : gameTypS.SUBTASK;
      break;  
    default:
      gameType = gameTypS.OTHER;
      break;
  }
  return gameType;
}

function get_gameMode(gametype , parentdetails, issuedetails){
  let gameMode;
  switch (gametype) {
    case gameTypS.EPIC:    
      gameMode = issuedetails.fields.labels.indexOf(gameLabel) > -1 ? gameModes.VIEW : gameModes.TODO ;
      break;
    case gameTypS.STORY:
      gameMode = parentdetails.isGameIssue ? (parentdetails.hasSubtasks? gameModes.EDIT : gameModes.EDIT) : gameModes.VIEW;
      break;
    case gameTypS.SUBTASK:
      gameMode = parentdetails.isGameIssue ? gameModes.HIGHLIGHT : gameModes.VIEW;
      break;  
    default:
      gameMode = gameModes.VIEW;
      break;
  }
  return gameMode;  
}

function initializeGame(){

  //$('#loader').addClass('d-none');

  if(gameMode === gameModes.TODO)
  {
    $('#game').removeClass('d-none');
    $('#config').removeClass('d-none');
    $('#action').removeClass('d-none');
    $('#action').find('.btn').addClass('d-none');
    $('#action').find('#startgame').removeClass('d-none');
    
  }

  if(gameMode === gameModes.VIEW && gameType === gameTypS.EPIC)
  {
    $('#game').removeClass('d-none');
    $('#info').removeClass('d-none');
    $('#myBoard').removeClass('d-none');
    $('#history').parents('.row').removeClass('d-none');
  }

  if(gameMode === gameModes.VIEW && (gameType === gameTypS.STORY || gameType === gameTypS.SUBTASK))
  {
    $('#game').removeClass('d-none');
    $('#myBoard').removeClass('d-none');
  }

  if(gameMode === gameModes.EDIT && gameType === gameTypS.STORY)
  {
    $('#info').removeClass('d-none');
    $('#game').removeClass('d-none');
    $('#myBoard').removeClass('d-none');
  }

  if(gameMode === gameModes.HIGHLIGHT)
  {
    if(gameType === gameTypS.STORY)
    {
      $('#game').removeClass('d-none');
      $('#myBoard').removeClass('d-none');
      $('#action').removeClass('d-none');
      $('#action').find('.btn').addClass('d-none');
      $('#hightlightMove').removeClass('d-none');
    }
    else if(gameType === gameTypS.SUBTASK)
    {
      $('#game').removeClass('d-none');
      $('#myBoard').removeClass('d-none');
      $('#action').removeClass('d-none');
      $('#action').find('.btn').addClass('d-none');
      $('#hightlightMove').removeClass('d-none');
      $('#approve').removeClass('d-none');
      $('#votemove').removeClass('d-none');     

    }
  }

  $('#reload').click(async function(){
    const res = await view.refresh();
    console.log(res);
  });

  $('#history').attr('href' , `${siteurl}/issues/?jql=type%3D%20%22Story%22%20and%20parentEpic%20%3D%20%22${issue.key}%22%20order%20by%20created%20DESC`);
  
}

async function saveGamedetails(gamedetails)
{
    const res = await invoke("setStorage" , {key : storageKeys.CONFIG , value : gamedetails})
    return res;
}

async function getGamedetails()
{
    return await invoke("getStorage" , {key : storageKeys.CONFIG})
}

async function saveGameHistory(gamedetails)
{
    let gamehistory = [];
    let prevGameHistory = await getGameHistory();
    if(!$.isEmptyObject(prevGameHistory))
    {
      gamehistory = prevGameHistory;      
    }
    gamehistory.push( gamedetails);
    let res = await invoke("setStorage" , {key : storageKeys.HISTORY , value :gamehistory })
    return res;
}

async function updateFenDetails()
{
    let prevgamedetails = await getGamedetails();
    let currentgameDetails = prevgamedetails;
    currentgameDetails['FEN'] = gamedetails.FEN;
    const res = await saveGamedetails(currentgameDetails); 
    return res;
}

async function getGameHistory()
{
    return await invoke("getStorage" , {key : storageKeys.HISTORY})
}

async function updatemove(source, target)
{
  const subtaskKey = await createSubtask(source,target);
  const currentgamedetails = {source,target, FEN : game.fen() ,previousFEN : gamedetails.FEN, moveBy: accountId, storyKey : issue.key, subtaskKey , createdDate : currentDate}
  const res = await saveGameHistory(currentgamedetails);
  const viewFreshRes = await view.refresh();
  return res;
}