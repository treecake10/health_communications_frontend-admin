import React, { useState, useRef } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import makeAnimated from 'react-select/animated';

import axios from 'axios';
import moment from 'moment';

import { CalendarTodayOutlined } from '@mui/icons-material';

import Navbar from '../components/navbar';
import Leftbar from '../components/leftBar';
import timeList from '../lists/timeList.json';

import './appointments.css';
import './staff.css';


const Schedule = () => {


    /**************************************************
                     Declarations
    ***************************************************/

    var emptyDateError = false;
    var noTimeSelected = false;

    var timeSelectedArray = [];

    const animatedComponents = makeAnimated();

    const [selectedDate, setSelectedDate] = useState(null)
    const [timeSelectedList, setTimeSelectedList] = React.useState([]);

    const initialValues = { date: "", time: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});

    const datepickerRef = useRef(null); 


    /**************************************************
                    Non-Axios Functions
    ***************************************************/

    // When the calendar icon is clicked for the input field, the DatePicker is opened 
    function handleClickDatepickerIcon() {

       const datepickerElement = datepickerRef.current;
       datepickerElement.setFocus(true);

    }
    
    const setField = (field, value) => {

        setFormValues({
            ...formValues,
            [field]: value,
        })

    }

    const updateTimeList = (event) => {

        setTimeSelectedList(event);
        setField('time', event);

    }

    const validate = (values) => {

        const errors = {};

        if (!values.date || values.date === '') {
            errors.date = "Date selection is required";
            emptyDateError = true;
        }

        if (!values.time || values.time === '') {
            errors.time = "Time selection is required";
            noTimeSelected = true;
        }

        return errors;

    };


    /**************************************************
                    Axios Function 
    ***************************************************/

    const handleClick = async e => {

        e.preventDefault();
        setFormErrors(validate(formValues));
        
        
        timeSelectedList.forEach(e=>{timeSelectedArray=[...timeSelectedArray, e.label]});

        // If no form validation errors exist, post date and time off
        if(!emptyDateError && !noTimeSelected) {

            axios.post(`https://health-communications.herokuapp.com/schedule/datesOff/${localStorage.getItem("userID")}`, { 

                docID: localStorage.getItem("userID"),
                date: moment(selectedDate).format("MM-DD-YYYY"),
                time: timeSelectedArray
                
            }).then((response) => {
                
                timeSelectedArray = [];

                setSelectedDate(null);
                setTimeSelectedList([]);
                setFormValues({ date: "", time: "" });
                

            }).catch((err) => {
                console.log(err, "error");
            });

            var stringConfirmation = "Successfully scheduled off for " + moment(selectedDate).format("MM/DD/YYYY") + " at " + timeSelectedArray;
            alert(stringConfirmation);

            window.location.reload();

        }

    }


    return (

        <div>

            <Navbar/>

            <div className="container">
                
               <Leftbar/>

               <div style={{ height: 400, width: '85%' }}>

                   <form className="newUserForm">

                        <h1>Schedule</h1>

                        <div className="newUserItem">
                        <label>Select Day</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                                setSelectedDate(date)
                                setField('date', date)
                            }}
                            ref={datepickerRef}
                        />
                        </div>
                        <CalendarTodayOutlined className="date-picker-icon2" onClick={() => handleClickDatepickerIcon()}/>
                        <div style={{ color: 'red' }}>{formErrors.date}</div>
                        
                        <div className="newUserItem">
                        <label>Select all times off for {moment(selectedDate).format("MM/DD/YYYY")}</label>
                        <Select 
                            options={timeList} 
                            components={animatedComponents} 
                            isMulti 
                            onChange={e=>updateTimeList(e)}
                        />
                        </div>
                        <div style={{ color: 'red' }}>{formErrors.time}</div>

                   </form>

                   <button className="newUserButton" onClick={handleClick}>Submit</button>

               </div>

            </div>
            
        </div>

    )

}

export default Schedule