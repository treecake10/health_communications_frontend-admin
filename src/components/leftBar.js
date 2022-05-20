import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/authContext';
import { DateRange, Schedule, PersonAddAlt1, Edit, PersonAddAlt, Logout } from "@mui/icons-material";
import "./leftBar.css";

const Leftbar = () => {

   const {setAuthState} = useContext(AuthContext);
   let navigate = useNavigate();

   const logout = () => {

      var lougoutIsTrue = window.confirm("Are you sure you want to logout?");

      if(lougoutIsTrue == true) {

         localStorage.removeItem("accessToken");
         localStorage.removeItem("fullname");
         localStorage.removeItem("userID");
         
         setAuthState({ ...setAuthState, status: false });

         navigate('/');
         
      }
 
   }

   return (

      <div className="leftbar">
         <div className="leftbarWrapper">
            <div className="leftbarMenu">

               <h3 className="leftbarTitle">Dashboard</h3>

               <ul className="leftbarList">

                     <li className="leftbarListItem" onClick={() => navigate("/schedule")}>
                        <DateRange className="leftbarIcon"/>
                        Schedule
                     </li>

                     <li className="leftbarListItem" onClick={() => navigate("/appointments")}>
                        <Schedule className="leftbarIcon"/>
                        Appointments
                     </li>

                     <li className="leftbarListItem" onClick={() => navigate("/patients")}>
                        <PersonAddAlt1 className="leftbarIcon"/>
                        New Patient
                     </li>

                     <li className="leftbarListItem" onClick={() => navigate("/editpatient")}>
                        <Edit className="leftbarIcon"/>
                        Edit Patient
                     </li>

                     <li className="leftbarListItem" onClick={() => navigate("/staff")}>
                        <PersonAddAlt className="leftbarIcon"/>
                        Add Staff
                     </li>

               </ul>

               <h3 className="leftbarTitle">User</h3>
               
               <ul className="leftbarList">
                  <li className="leftbarListItem" onClick={logout}>
                     <Logout className="leftbarIcon"/>
                     Logout
                  </li>    

               </ul>

            </div>

         </div>

      </div>

   );

};

export default Leftbar;