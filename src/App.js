import { useState, useEffect } from 'react';
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom';

import axios from "axios";

import { AuthContext } from './helpers/authContext';
import Dashboard from './pages/admin-dashboard/dashboard';
import Staff from './pages/staff';
import Patients from './pages/patients';
import EditPatient from './pages/editPatient';
import Appointments from './pages/appointments';
import SignIn from './pages/SignOn/signin';
import Schedule from './pages/schedule';

import './App.css';


function App() {

  const [authState, setAuthState] = useState({

    fullname: "",
    id: 0, 
    status: false,

  });

  // Authenticate the user with the access token set in local storage
  useEffect(() => {

    /* 
      Verify the token. This is done by haveing a fetch
      request call a verification function in the back end.
    */
    axios.get("https://health-communications-backend.onrender.com/api/protected", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {

      if (localStorage.getItem("accessToken")) {

        setAuthState({
          fullname: response.data.fullname,
          id: response.data.id,
          status: true,
        });
        
      } 

    })
    
  }, []);
  

  return (

    <AuthContext.Provider value={{ authState, setAuthState}}>

      <Router>

        <div className="App">

          <Routes>   
            <Route exact path='/' element={< SignIn />}></Route>
            <Route exact path='/staff' element={< Staff />}></Route>
            <Route exact path='/patients' element={< Patients />}></Route>
            <Route exact path='/editpatient' element={< EditPatient />}></Route>
            <Route exact path='/appointments' element={< Appointments />}></Route>
            <Route exact path='/dashboard' element={< Dashboard />}></Route>
            <Route exact path='/schedule' element={<Schedule />}></Route>
          </Routes>

        </div>

      </Router>

    </AuthContext.Provider>
  );
}

export default App;
