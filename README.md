# Idea

Create EPIC to start the Game
Two fields which allows multiple people represent the Teams.
Story will be assumed as day move and tille will be final move
Every Task will Have approve button , Max approve will convert to story as final move
Reject the task if not valid move or valid move not allow at all
Keep on adding history in epic description as Table
One Day - one move by any Team - whoever quickly approve 10 (admin config) will convert issue into story
Notification to all the people on their move time and to all on win
- Keep on changing the status of epic , story and task based on move
- whover has jira-project-settings-page or jira-admin-page can Intialize the game and play the game
- EPIC : isSiteAdmin isAdmin isProjectAdmin canAdministerProjects
- Story : canCreateChildren canCreateSubtasks and parent has already game started
Name - AChess- Atlassian Chess

https://github.com/timburgan/timburgan
https://github.com/jhlywa/chess.js
https://github.com/oakmac/chessboardjs/

Forge POC
 - Check roles based action in app
 - Check update/creation of issue under epic and stories
 - Cron functionlity
 - update fields apis

# Game
## User
### EPIC
 - EPIC with required permission will have Start Game button
    - Validation : Both team should have atleast1 player
    - Automcomplete input box for users and start button
 - Once get started , History Table with pagination with move by step and tasks link or jql link , created on desc
    - Chess of current status
 - Once game completed, replay button 
### Story
    - Auto story crated on start of the game
    - Mulptiple user can play from story.
    - On each Move, confirmation and create task
    - Keep on updateing story title on each started
        - White Team Move with todo
        - White Team move completed from A1 to D6 with status closed
### Subtask
    - Vote button on each subtask that is in progress
    - Once tasks selected as final move , complete it to done
    - rest of the not selection , reject
    - last step to this step animation on board
- use emoji to display movement and status in title


## Admin

## Technical
### Database
    - game 
        - id
        - epicId
        - teama
        - teamb
        - startDate
        - createdBy
        - config (autoapprove on vote)
    - History
        - gameid
        - Move 
        - FEN  position
        - moveBy
        - taskId
        - date
    - votes
        - gameid
        - taskid
        - votecount
        - updatedDate
### coding
    - EPIC Mode - Read Only - current stage
    - Story Mode - Play (TODO) , Last movement (Done)
    - Tasks Mode - Read only with last movement animation
