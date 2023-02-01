# A-Chess (Atlassian Chess)

## Goal
- Build a game that can improve team *collaboration* using the Atlassian platform

### Why
- Collaboration is crucial for building and maintaining a successful team. Since more and more teams are now moving towards remote work, this is the primary issue everyone is facing. This game will help to increase collaboration using the most popular project platform. The reason to choose Chess is its popularity globally so the effort of training will be less.

### How to Play
- Chess is mostly played as an individual game. but the flavor of this chess can be played with the team. 
- Project admin can add team members with game configuration and start the game
- For every Team's move , a new story will be created automatically for the Team.
- Assigned team members can play a move for their respective team and a subtask as a snapshot of that perticular move will be created.
- Team members can vote on subtasks and the move will be finalized if the vote count matches with configured vote-count
- Team Leader can also approve the subtask and finalize the move without a voting process, for initial traction.
- on approval of the subtask, a story for another team will be automatically created and they can start their move.

## Features
- Two teams, Black and White
- Vote Count game config, for auto approve the move
- Nice Chess UI with FEN 
- App button visible only to valid users
- Leader can approve
- The team can vote to finalize the move
- Valid Team members can only take actions
- Snapshot saved with respective story/subtask
- EPIC to show the current stage of the game
- History of game


## Demo
- [Youtube](https://youtu.be/GWKi9FesqWU)
- [Screenshots](https://devpost.com/software/a-chess-atlassian-chess)

## Forge Features 
- Modules (JIRA, Admin)
- UI (UIKit for Getting Started, App using Static Resources)
- Storage API
- Resolver, Bridge
- Permission (Scope, Display Conditions,  External CSS/JS, External Domains, Backend)
- Rest API(JIRA)



## Install
### Getting Started
```
npm install
npx forge deploy
npx forge install
npm forge tunnel
```

### APP
```
cd  static/app
npx yarn install
npx yarn serve
```

## Future Scope
- [] Rewrote code with  Performance  Focus
- [] Highlight move Snapshot in story and subtask
- [] Team info and config as View Mode in EPIC
- [] Transition Issue on game status change(only if performance not much get impact)
- [] Start Game with FEN Position
- [] Notification for move and game status

## Credit
- [chess.js](https://github.com/jhlywa/chess.js)
- [chessboard UI](https://github.com/oakmac/chessboardjs/)
- [Loader Gif](https://levelup.gitconnected.com/9-different-css-only-animated-loader-with-font-awesome-a479894f7676)
