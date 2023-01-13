# Idea

Create EPIC to start the Game
Two fields which allows multiple people represent the Teams.
Story will be assumed as day move and tille will be final move
Every Task will Have approve button , Max approve will convert to story as final move
Reject the task if not valid move or valid move not allow at all
Keep on adding history in epic description as Table
One Day - one move by any Team - whoever quickly approve 10 (admin config) will convert issue into story
Notification to all the people on their move time and to all on win - or mention on their move
- Mentioned verybody when game over
- Keep on changing the status of epic , story and task based on move
- whover has jira-project-settings-page or jira-admin-page can Intialize the game and play the game
- EPIC : isSiteAdmin isAdmin isProjectAdmin canAdministerProjects
- Story : canCreateChildren canCreateSubtasks and parent has already game started 
      displayConditions:
        and:
          canCreateChildren: true
          and
          canCreateSubtasks: true
          and 
            issueType: Epic
            or:
            issueType: Story
            or:
            issueType: Sub-task        
Name - AChess- Atlassian Chess



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
        - whitteam
        - blackteam
        - startDate
        - createdBy
        - config (autoapprove on vote)
    - History
        - gameid
        - moveId
        - Move 
        - FEN  position
        - moveBy
        - subtaskKey
        - date
    - votes
        - epicKey
        - taskKey
        - votes
            - createdBy
            - createdDate
### coding
    - EPIC Mode - Read Only - current stage or config
    - Story Mode - Play (TODO) , Last movement (Done)
    - Tasks Mode - Read only with last movement animation


## TODO
- [x] Attach label to epic once start game
- [x] Convert to view mode story once task finalized
- [x] App enble only if valid
- [x] Stop drag and drop mouse over on story in view mode
- [] On Invalid move, confirm should not be appear in edit mode on story
- [] Show/hide config on epic
- [] over over test 8/1p2rr2/8/8/8/8/1kn2bpn/5qKq w - - 0 1 and condition rn2k1nr/pp4pp/3p4/b1pP4/P1P2p1q/1b2pPRP/1P1NP1PQ/2B1KBNR w Kkq - 0 13
- [x] Remove achess label logic for start game
- [x]  First person added in both team will be elected as leader
- [x] Link all the success message with key
- [x] Vote Feature


### Credit
    - (Loader Gif)[https://levelup.gitconnected.com/9-different-css-only-animated-loader-with-font-awesome-a479894f7676]
    - https://github.com/timburgan/timburgan
    - https://github.com/jhlywa/chess.js
    - https://github.com/oakmac/chessboardjs/

