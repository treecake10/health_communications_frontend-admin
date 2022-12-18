import React from 'react';
import { useEffect, useState } from 'react';
import Select from 'react-select';

import axios from 'axios';

import Navbar from '../components/navbar';
import Leftbar from '../components/leftBar';
import makeAnimated from 'react-select/animated';
import familyList from '../lists/familyList.json';
import './staff.css';


const EditPatient = () => {


    /**************************************************
                     Declarations
    ***************************************************/

    let userId = '';

    var emptyPatientError = false;
    var noPcpSelected = false;

    const animatedComponents = makeAnimated();

    const [patientsList, setPatientsList] = React.useState([]);
    const [patient, setPatient] = React.useState("");

    const [doctorsList, setDoctorsList] = React.useState([]);
    const [PCPDoc, setPcpDoc] = React.useState("");

    const [selectedDocFamList, setSelectedDocFamList] = React.useState([]);

    const initialValues = { patient: "", pcp: "", docFamily: "" };
    
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    
    const [currentDocValue, setCurrentDocValue] = useState(0);
    const [patientValue, setPatientValue] = useState(0);


    /**************************************************
                     Handlers
    ***************************************************/

    useEffect(() => {

        getPatientNames();
        getDoctorsList();

    }, []);


    /**************************************************
                    Non-Axios Functions
    ***************************************************/

    const docSelect = ( event ) => {
        
        setPcpDoc(event.value);
        setField('pcp', event.label);
        
    }

    const updateDocFamilyList = (event) => {

        setSelectedDocFamList(event);

    }

    const setField = (field, value) => {

        setFormValues({
            ...formValues,
            [field]: value,
        })

    }

    const patientSelect = ( event ) => {
        
        setPatient(event.value);
        setField('patient', event.label);

    }

    const validate = (values) => {

        const errors = {};

        if (!values.patient || values.patient === '') {
            errors.patient = "Patient selection is required";
            emptyPatientError = true;
        }

        if (!values.pcp || values.pcp === '') {
            errors.pcp = "PCP doctor selection is required";
            noPcpSelected = true;
        }
        
        return errors;
    };


    /**************************************************
            Axios Functions to update patient info
    ***************************************************/

    // Get all existing patients
    const getPatientNames = () => {
        
        axios.get('https://health-communications-backend.onrender.com/users/getPatients')
            .then((response) => {      

                let data = response.data;           
                
                data.forEach(e=>{setPatientsList(patientsList => [
                    ...patientsList, 
                    {
                        label: e.firstName + " " + e.middleName + " " + e.lastName,
                        value: e.userUID,
                    }]
                )});

            }).catch((err) => {
                console.log(err, "Cannot get patient names");
            });

    }


    // Get all existing doctors
    const getDoctorsList = () => {

        axios.get('https://health-communications-backend.onrender.com/doctors/getDoctors')
            .then((response) => {  
                              
                let data = response.data;           
                
                data.forEach(e=>{setDoctorsList(doctorsList => [
                    ...doctorsList, 
                    {
                        label: e.fullname,
                        value: e._id,
                    }]
                )});

            }).catch((err) => {
                console.log(err, "Cannot get doctors");
            });

    }


    const handleClick = async e => {

        e.preventDefault();
        setFormErrors(validate(formValues));
        

        userId = patient;
        let sendDocFamilyList = [];

        selectedDocFamList.forEach(e=> {sendDocFamilyList=[...sendDocFamilyList, e.label]});

        // If no validation errors exist, update information for the patient
        if(!emptyPatientError && !noPcpSelected) {

            axios.post(`https://health-communications-backend.onrender.com/users/updateUserInfo/${userId}`, { 

                pcpDoc: PCPDoc,
                approvedDocFamilies: sendDocFamilyList

            }).then((response) => {
                
                userId = '';
                sendDocFamilyList = [];

                setPatient("");
                setPcpDoc("");
                setSelectedDocFamList([]);
                setFormValues({ patient: "", pcp: "", docFamily: "" });

                window.location.reload();

            }).catch((err) => {
                console.log(err, "error");
            });

            var stringConfirmation = "Info for " + formValues.patient + " successfully updated";
            alert(stringConfirmation);
            
        }

    }


    return (

        <div>

            <Navbar/>

            <div className="container">
                
               <Leftbar/>
              
               <div style={{ height: 400, width: '85%' }}>

                    <h1 className="newUserTitle">Edit Patient</h1>

                    <form className="newUserForm">

                        <div className="newUserItem">
                            <label>Patient</label> 
                            <Select
                                options={patientsList}
                                value={patientsList.find(obj => obj.label === patientValue)}
                                onChange={e=>patientSelect(e)}
                            />
                        </div>
                        <div style={{ color: 'red' }}>{formErrors.patient}</div>

                        <div className="newUserItem">
                            <label>PCP Doctor</label>
                            <Select
                                options={doctorsList}
                                value={doctorsList.find(obj => obj.label === currentDocValue)} 
                                onChange={e=>docSelect(e)}
                            />
                        </div>
                        <div style={{ color: 'red' }}>{formErrors.pcp}</div>

                        <div className="newUserItem">
                            <label>Doctor Family</label>
                            <Select 
                                options={familyList} 
                                components={animatedComponents} 
                                isMulti 
                                onChange={e=>updateDocFamilyList(e)}
                            /> 
                        </div>
                        
                        <button className="newUserButton" onClick={handleClick}>Submit</button>

                    </form>
                    
                </div>
                
            </div>
            
        </div>  
       
    );
}

export default EditPatient;