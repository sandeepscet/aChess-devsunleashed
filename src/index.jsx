import ForgeUI, { render, Fragment, Text, AdminPage , Code ,SectionMessage  } from "@forge/ui";

const App = () => {
  return (
    <Fragment>      
      <SectionMessage title="How to Play" appearance="info">
       <Text> -Chess is mostly played as indivial game. but  flavor of this chess can be play with team. </Text>
       <Text> -Project admin can add team members with game configration and start the game</Text>
       <Text> -For every Team move , story will be created automatically for Team.</Text>
       <Text> -Assigned team member can play move for their respective team and subtask as snapshot of that perticular move will be created.</Text>
       <Text> -Team member can vote on subtask and move will be finalized if votecount matches with configured votecount</Text>
       <Text> -Team Leader can also approve the subtask and finalize the move without voting process, for intial traction.</Text>
       <Text> -on approval of subtask, story for another team will be automatically created and they can start their move.</Text>
    
      </SectionMessage>

      <SectionMessage title="Features" appearance="info">
       <Text> -Two teams , Black and White</Text>
       <Text> -Vote Count game config, for auto approve the move</Text>
       <Text> -Nice Chess UI with FEN </Text>
       <Text> -App button visible only to valid users</Text>
       <Text> -Leader can approve</Text>
       <Text> -Team can vote to finalize the move</Text>
       <Text> -Valid Team members can only take actions</Text>
       <Text> -Snapshot saved with respective story/subtask</Text>
       <Text> -EPIC to show current stage of game</Text>
       <Text> -History of game</Text>
    
      </SectionMessage>
    </Fragment>
  );
};
 
export const run = render(
  <AdminPage>
    <App />
   </AdminPage>
);