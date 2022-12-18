import { useEffect } from 'react';
import React, {useState} from 'react';
import Select from 'react-select';

import axios from 'axios';

import Navbar from '../components/navbar';
import Leftbar from '../components/leftBar';


const Patients = () => {
    

    /**************************************************
                     Declarations
    ***************************************************/

    var firstNameError = false;
    var middleNameError = false;
    var lastNameError = false;
    var emailError = false;
    var passwordError = false;
    var noPcpSelected = false;

    const [doctorsList, setDoctorsList] = React.useState([]);
    const [PCPDoc, setPcpDoc] = React.useState("");
    const [currentDocValue, setCurrentDocValue] = useState(0);

    const initialValues = { firstName: "", middleName: "", lastName: "", email: "", password: "", pcp: ""};
    const [userData, setUserData] = useState(initialValues);
    
    const [formErrors, setFormErrors] = useState({});


    /**************************************************
                     Handlers
    ***************************************************/

    useEffect(() => {

        getDoctorsList();

    }, []);


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

    const docSelect = ( event ) => {
        
        setPcpDoc(event.value);
        setField('pcp', event.label);
        
    }

    const validate = (values) => {

        const errors = {};

        if (!values.firstName) {
            errors.firstName = "First name is required";
            firstNameError = true;
        }
        if (!values.middleName) {
            errors.middleName = "Middle name or initial is required";
            middleNameError = true;
        }
        if (!values.lastName) {
            errors.lastName = "Last name is required";
            lastNameError = true;
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

        if (!values.pcp || values.pcp === '') {
            errors.pcp = "PCP doctor selection is required";
            noPcpSelected = true;
        }

        return errors;

    };


    /**************************************************
        Axios Functions to register a new patient
    ***************************************************/

    // Get all existing doctors
    const getDoctorsList = () => {
        
        axios.get('https://health-communications-backend.onrender.com/doctors/getDoctors')
            .then((response) => {      

                let data = response.data;           
                
                data.forEach(e=>{setDoctorsList(doctorsList => [...doctorsList, {
                    value: e._id,
                    label: e.fullname
                    
                    }]
                )});

            }).catch((err) => {
                console.log(err, "Cannot get doctors");
            });

    }

    const handleClick = async e => {

        e.preventDefault();
        setFormErrors(validate(userData));
       
        // If there are no form validation errors, register the new patient
        if(!firstNameError && !middleNameError && !lastNameError &&
            !emailError && !passwordError && !noPcpSelected) {

            const response = await axios.post('https://health-communications-backend.onrender.com/api/signup', { 

                data: userData, 
                pcpDoc: PCPDoc

            });

            const result = response.data;

            if(result.message == "Invalid email") {
                alert("Invalid email");
            } 

            else if(result.message == "User already exists") {
                alert("This user already exists");
            }

            else {

                var stringConfirmation = userData.firstName + " " + userData.middleName + " " + userData.lastName + " added successfully";
                alert(stringConfirmation);

                setPcpDoc("");
                
                setUserData({ 
                    firstName: "", 
                    middleName: "", 
                    lastName: "", 
                    email: "", 
                    password: "", 
                    pcp: ""
                });

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

                    <h1 className="newUserTitle">New Patient</h1>

                    <form className="newUserForm">
                        <div className="newUserItem">
                        <label>First Name</label>
                        <input 
                            type="text" 
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleChange} 
                        />
                        </div>
                        <div style={{ color: 'red' }}>{formErrors.firstName}</div>

                        <div className="newUserItem">
                        <label>Middle Name</label>
                        <input 
                            type="text" 
                            name="middleName"
                            value={userData.middleName}
                            onChange={handleChange} 
                        />
                        </div>
                        <div style={{ color: 'red' }}>{formErrors.middleName}</div>

                        <div className="newUserItem">
                        <label>Last Name</label>
                        <input 
                            type="text" 
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleChange} 
                        />
                        </div>
                        <div style={{ color: 'red' }}>{formErrors.lastName}</div>

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
                        <label>PCP Doctor</label>
                        <Select 
                            
                            options={doctorsList}
                            value={doctorsList.find(obj => obj.label === currentDocValue)} 
                            onChange={e=>docSelect(e)}
                            
                        />
                        </div>
                        <div style={{ color: 'red' }}>{formErrors.pcp}</div>
                    
                        <button className="newUserButton" onClick={handleClick}>Create</button>

                    </form>

                </div>

            </div>

        </div>
    );
    
}

export default Patients;