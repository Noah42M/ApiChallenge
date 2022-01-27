import React from 'react';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import './App.css';
var csvjson = require('csvjson');

function App() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState('');
  const userInfoInput = useRef();
  const scaleTeamsInput = useRef();
  const openUserInput = useRef();
  const listProjectsInput = useRef();
  const idProject = useRef();

  console.log(process.env);

  //Get token
  useEffect(() => {
    axios.post("https://api.intra.42.fr/oauth/token", {
      "grant_type": "client_credentials", 
      "client_id": process.env.REACT_APP_CLIENT_ID, 
      "client_secret":process.env.REACT_APP_SECRET_ID
    })
    .then(function(response) {
      setToken(response.data.access_token);
    })
    .catch(error => console.log(error));
  }, []);

  //UserInfo
  const handleUserInfo = (e) => {
    e.preventDefault();
    axios.get('https://api.intra.42.fr/v2/users/' + userInfoInput.current.value, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(response => setResult(JSON.stringify(response.data)))
    .catch(error => console.log(error));
  }

  //List of users with at least one active cursus
  const handleListOfUsersWithAtLeastOneActiveCursus = (e) => {
    e.preventDefault();
    axios.get('https://api.intra.42.fr/v2/cursus_users?&filter[active]=true&filter[campus_id]=37', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(response => {
      let arr = [];
      for(let a = 0; a < response.data.length; a++){
        arr.push(response.data[a].user.login);
      }
      setResult(JSON.stringify(arr));
    })
    .catch(error => console.log(error));
  }

  //List of open scale teams of a given user
  const handleListOfOpenScaleTeamsOfAGivenUser = (e) => {
    e.preventDefault();
    axios.get('https://api.intra.42.fr/v2/users/' + scaleTeamsInput.current.value + '/scale_teams', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(response => {
      setResult(JSON.stringify(response.data))
    })
    .catch(error => console.log(error));
  }

    //List of open teams of a given user
    const handleListOfOpenTeamsOfAGivenUser = (e) => {
      e.preventDefault();
      axios.get('https://api.intra.42.fr/v2/users/' + openUserInput.current.value + '/teams', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then(response => setResult(JSON.stringify(response.data)))
      .catch(error => console.log(error));
    }

    //List of open projects of a given user
    const handleListOfOpenProjectsOfAGivenUser = (e) => {
      e.preventDefault();
      axios.get('https://api.intra.42.fr/v2/users/' + listProjectsInput.current.value + '/projects_users', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then(response => setResult(JSON.stringify(response.data)))
      .catch(error => console.log(error));
    }

    //Average retry number of a given project
    const handleAverageRetryNumberOfAGivenProject = (e) => {
      e.preventDefault();
      axios.get('https://api.intra.42.fr/v2/projects/' + idProject.current.value + '/projects_users?filter[campus]=37', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then(response => setResult(JSON.stringify(response.data)))
      .catch(error => console.log(error));
    }

    const handleDownloadCSV = (e) => {
      e.preventDefault();
      let fileCSV = csvjson.toCSV(result, {key: 'none'});
      var pom = document.createElement('a');
      var blob = new Blob([fileCSV],{type: 'text/csv;charset=utf-8;'});
      var url = URL.createObjectURL(blob);
      pom.href = url;
      pom.setAttribute('download', 'data.csv');
      pom.click();
    }

    const handleDownloadJSON = (e) => {
      e.preventDefault();
      let fileCSV = result;
      var pom = document.createElement('a');
      var blob = new Blob([fileCSV],{type: 'text/csv;charset=utf-8;'});
      var url = URL.createObjectURL(blob);
      pom.href = url;
      pom.setAttribute('download', 'data.json');
      pom.click();
    }

  return (
    <>
      <section style={{ display: "flex" }}>
        <div style={{ width: "50%" }}>
          <div>
            <form id="saveUserInformation">
              <p style={{ marginBottom: "0" }}>User information</p>
              <input id="userInformation" type="text" ref={userInfoInput} />
              <button type="submit" id="sUserInformation" onClick={(e) => handleUserInfo(e)}>
                Search
              </button>
            </form>
          </div>
          <div>
            <p style={{marginBottom: "0"}}>
              List of users with at least one active cursus
            </p>
            <input type="text" disabled/>
            <button id="sListOfUsersWithAtLeastOneActiveCursus" onClick={(e) => handleListOfUsersWithAtLeastOneActiveCursus(e)}>Search</button>
          </div>
          <div>
            <p style={{marginBottom: "0"}}>
              List of open scale teams of a given user
            </p>
            <input id="listOfOpenScaleTeamsOfAGivenUser" type="text" ref={scaleTeamsInput}/>
            <button id="sListOfOpenScaleTeamsOfAGivenUser" onClick={(e) => handleListOfOpenScaleTeamsOfAGivenUser(e)}>Search</button>
          </div>
          <div>
            <p style={{marginBottom: "0"}}>List of open teams of a given user</p>
            <input id="listOfOpenTeamsOfAGivenUser" type="text" ref={openUserInput}/>
            <button id="sListOfOpenTeamsOfAGivenUser" onClick={(e) => handleListOfOpenTeamsOfAGivenUser(e)}>Search</button>
          </div>
          <div>
            <p style={{marginBottom: "0"}}>
              List of open projects of a given user
            </p>
            <input id="listOfOpenProjectsOfAGivenUser" type="text" ref={listProjectsInput}/>
            <button id="sListOfOpenProjectsOfAGivenUser" onClick={(e) => handleListOfOpenProjectsOfAGivenUser(e)}>Search</button>
          </div>
          <div>
            <p style={{marginBottom: "0"}}>
              Average retry number of a given project
            </p>
            <input id="averageRetryNumberOfAGivenProject" type="text" ref={idProject}/>
            <button id="sAverageRetryNumberOfAGivenProject" onClick={(e) => handleAverageRetryNumberOfAGivenProject(e)}>Search</button>
          </div>
          <div>
            <button id="sDownloadCSV" onClick={(e) => handleDownloadCSV(e)}>Donwload CSV</button>
          </div>
          <div>
            <button id="sDownloadJSON" onClick={(e) => handleDownloadJSON(e)}>Donwload JSON</button>
          </div>
          <div>
            <a href="https://www.notion.so/Documentation-ApiChallenge-40017b2134404765a073f8044e272c8d">Help command</a>
          </div>
        </div>
        <div style={{width: "50%"}}>
          <p style={{marginBottom: "0"}}>Result</p>
          <textarea type="text" id="textareaValue" style={{width: "95%", height: "85vh", boxSizing: "border-box", resize: "none", padding:"10px"}} value={result} disabled />
        </div>
      </section>
    </>
  );
}

export default App;
