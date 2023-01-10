import React from "react";

import { render } from "react-dom";
import { invoke } from '@forge/bridge';

/*
async function invoke(method , {}){
  return {

  }
}
*/

class App extends React.Component {
  state = {
    rows: [],
    issue : ''
  };
  
  componentDidMount() {
    invoke('getStorage', { key: 'diyconfig' }).then((returnedData) => {
        let  issue = ''  
        let rows = [{
            type: "jql",
            ql: "issuetype = Story AND status = Done AND created >= -15d and assignee = currentUser() order by created DESC",
            category : "BLOCK",
            multiple : 2
          },
          {
            type: "jql",
            ql: "issuetype = Story AND status = Done AND created >= -15d and assignee = currentUser() order by created DESC",
            category : "BAR",
            multiple : 2
          },
          {
            type: "jql",
            ql: "issuetype = Story AND status = Done AND created >= -15d and assignee = currentUser() order by created DESC",
            category : "SPECIAL",
            multiple : 1
          }];

          let initStat = returnedData;
        if(!returnedData ||  Object.keys(returnedData).length === 0)
        {
            rows = rows;        
            issue = issue;
            initStat = { rows: rows , issue };
        }
        this.setState(initStat);       
    });
  }

  handleChange = idx => e => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];

    rows[idx][name] = value;
    
    this.setState({
      rows
    });
  };

  handleIssueChange= issue => e => {
    const {  value } = e.target;
    this.setState({
      issue : value
    });
  };
  

  onSubmitHandler = (e) => {
    e.preventDefault();
    document.getElementById("submit").innerHTML = "Saving";
    console.log(this.state);
    invoke('setStorage', { key: 'diyconfig', value: this.state }).then((returnedData) => {
      document.getElementById("submit").innerHTML = "Saved";
      setTimeout(() => document.getElementById("submit").innerHTML = "Save" , 2000);
    }); 
   }

   render() {

    if (Object.keys(this.state.rows).length === 0) {
        return (<div><p>Loading...</p></div>)
    }

    return (
      <div>
         <form onSubmit={this.onSubmitHandler}>
        <div className="container">
          <div className="row clearfix">
            <div className="col-md-12 column">
              <table
                className="table table-bordered table-hover"
                id="tab_logic"
              >
                <thead>
                  <tr>
                    <th className="text-center"> # </th>
                    <th className="text-center"> Type </th>
                    <th className="text-center"> JQl/CQL </th>
                    <th className="text-center"> Block Category </th>
                    <th className="text-center"> Multiple </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.rows.map((item, idx) => (
                    <tr id="addr0" key={idx}>
                      <td>{idx}</td>
                      <td>
                      <select name="type"
                          value={this.state.rows[idx].type}
                          onChange={this.handleChange(idx)}
                          className="form-control" required>
                        <option value="jql" >JQL</option>
                        <option value="cql">CQL</option>
                      </select>                       
                      </td>
                      <td>
                        <input
                          type="text"
                          name="ql"
                          value={this.state.rows[idx].ql}
                          onChange={this.handleChange(idx)}
                          className="form-control"
                          required
                        />
                      </td>
                      <td>
                      <select readOnly disabled name="type"
                          value={this.state.rows[idx].category}
                          onChange={this.handleChange(idx)}
                          className="form-control" required>
                        <option value="SPECIAL" >SPECIAL</option>
                        <option value="BAR">BAR</option>
                        <option value="BLOCK">BLOCK</option>
                      </select> 
                      </td> 
                      <td>
                        <input
                          type="text"
                          name="multiple"
                          value={this.state.rows[idx].multiple}
                          onChange={this.handleChange(idx)}
                          className="form-control"
                          required
                        />
                      </td>                     
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="container d-none">
                <div className="row" >
                  <div className="col-2">
                  Issue Link : 
                  </div>
                  <div className="col-2">
                  <input
                          type="text"
                          name="issue"
                          value={this.state.issue}
                          onChange={this.handleIssueChange()}
                          className="form-control"
                        />     
                  </div>
                  <div  className="col-8">
                  <div className="alert alert-info" role="alert">
                     All the Saved Canvas will be create under this Issue if added.
                  </div>
                  </div>
                  
                </div>
             
                              

               </div>      
               <button id="submit"
                onSubmit={this.onSubmitHandler}
                type="submit"  className="btn btn-primary float-right">
                    Save
                </button>
            </div>
          </div>
        </div>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));