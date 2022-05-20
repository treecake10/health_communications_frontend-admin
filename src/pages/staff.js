import React from 'react';
import { useState } from 'react';
import Select from 'react-select';

import axios from 'axios';

import Navbar from '../components/navbar';
import Leftbar from '../components/leftBar';

import familyList from '../lists/familyList.json';
import './staff.css';


const Staff = () => {


    /**************************************************
                     Declarations
    ***************************************************/

    var noFOSSelected = false;
    var fullNameError = false;
    var emailError = false;
    var passwordError = false;
    
    const [txtFieldStudy, setFieldStudy] = React.useState("");

    const initialValues = { fullname: "", email: "", password: "", fos: ""};
    const [userData, setUserData] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    
    const [currentFOSValue, setCurrentFOSValue] = useState(0);


    /**************************************************
                    Non-Axios Functions
    ***************************************************/

    const handleChange = e => {

        setUserData({...userData, [e.target.name]: e.target.value});
        
    }

    const setField = (field, value) => {
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    const fieldSelect = ( event ) => {
        
        setFieldStudy(event.value);
        setField('fos', event.label);

    }

    const validate = (values) => {

        const errors = {};

        if (!values.fullname) {
            errors.fullname = "Full name is required";
            fullNameError = true;
        }
        
        if (!values.email) {
            errors.email = "Email is required";
            emailError = true;
        } 

        if (!values.password) {
            errors.password = "Password is required";
            passwordError = true;
        } else if (values.password.length < 4) {
            errors.password = "Password must be more than 4 characters";
            passwordError = true;
        } else if (values.password.length > 10) {
            errors.password = "Password cannot exceed more than 10 characters";
            passwordError = true;
        }

        if (!values.fos || values.fos === '') {
            errors.fos = "Selection of field of study is required";
            noFOSSelected = true;
        }

        return errors;

    };


    /**************************************************
            Axios Function to register staff
    ***************************************************/

    const onSubmit = async event => {

        event.preventDefault();
        setFormErrors(validate(userData));
        
        
        // If no form validation errors exists, register new staff
        if(!fullNameError && !emailError && !passwordError && !noFOSSelected) {

            const response = await axios.post('https://health-communications.herokuapp.com/api/addStaff', {
            
                data: userData,
                fieldOfStudy: txtFieldStudy 

            });

            const result = response.data;

            if(result.message == "Email invalid") {
                alert("Invalid email");
            } 
            
            else if(result.message == "User already exists") {
                alert("This user already exists");
            }

            else {

                var stringConfirmation = userData.fullname + " added successfully";
                alert(stringConfirmation);

                setFieldStudy("");
                setUserData({ fullname: "", email: "", password: "", fos: ""});

                window.location.reload();

            }
            

        }

    }
    

    return (

        <div>

            <Navbar/>

            <div className="container">
                
               <Leftbar/>
              
               <div style={{ height: 400, width: '85%' }}>

                    <h1>New Staff</h1>

                    <form className="newUserForm">
                        
                        <div className="newUserItem">
                        <label>Full Name</label>
                        <input 
                            type="fullname"
                            name="fullname"
                            value={userData.fullname}
                            onChange={handleChange}
                        />
                        </div>
                        <div style={{ color: 'red' }}>{formErrors.fullname}</div>

                        <div className="newUserItem">
                        <label>Email</label>
                        <input 
                            type="text" 
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                        />
                        </div>
                        <div style={{ color: 'red' }}>{formErrors.email}</div>

                        <div className="newUserItem">
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                        />
                        </div>
                        <div style={{ color: 'red' }}>{formErrors.password}</div>
                    
                        
                        <div className="newUserItem">
                        <label>Field of Study</label>
                        <Select
                            options={familyList}
                            value={familyList.find(obj => obj.label === currentFOSValue)} 
                            onChange={e=>fieldSelect(e)}
                        />
                        </div>
                        <div style={{ color: 'red' }}>{formErrors.fos}</div>
                        
                    </form>

                    <button className="newUserButton" onClick={e => onSubmit(e)}>Create</button>
                    
                </div>
                
            </div>
            
        </div>  
       
    );
}

export default Staff;