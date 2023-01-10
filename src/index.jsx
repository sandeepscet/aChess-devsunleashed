import api, { route } from "@forge/api";
import ForgeUI, { render, Fragment, Text, AdminPage , Heading, Code ,SectionMessage,Image  } from "@forge/ui";



const App = () => {
  return (
    <Fragment>
      <SectionMessage title="How to Play" appearance="info">
       <Text>
          Help text will be here
      </Text>
    
      </SectionMessage>
    </Fragment>
  );
};
 
export const run = render(
  <AdminPage>
    <App />
   </AdminPage>
);