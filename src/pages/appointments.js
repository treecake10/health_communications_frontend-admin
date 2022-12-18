import React, {useEffect, useState, useRef} from 'react';
import Select from 'react-select';
import DatePicker from "react-datepicker";

import axios from 'axios';
import moment from 'moment';

import { DataGrid } from '@mui/x-data-grid';
import { CalendarToday } from '@mui/icons-material';

import Navbar from '../components/navbar';
import Leftbar from '../components/leftBar';
import Popup from '../components/popup';
import timeList from '../lists/timeList.json';
import statusList from '../lists/statusList.json';
import authUserObject from '../middleware/authUserObject';
import './appointments.css';


const Appointments = () => {


  /**************************************************
                  Declarations
  ***************************************************/

  const reloadCount = Number(sessionStorage.getItem('reloadCount')) || 0;

  var docId = authUserObject.userID;

  const [appointmentID, setAppointmentID] = useState("");
  const [rowID, setRowID] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [currentTimeValue, setCurrentTimeValue] = useState(0);
  const [currentStatusValue, setCurrentStatusValue] = useState(0);
  const [appntType, setAppntType] = useState();

  const [selectedDate,setSelectedDate] = React.useState(new Date());
  const [dateStr, setDateStr] = useState("Select Date");
  const [dateStrFormat, setDateStrFormat] = useState("");

  const [dataGridRows, setDataGridRows] = useState([]);

  const [editPopup, setEditPopup] = useState(false);
  const [cancelPopup, setCancelPopup] = useState(false);

  const datepickerRef = useRef(null);


  /**************************************************
                  Handlers
  ***************************************************/

  // Reload the page once
  useEffect(() => {

    if(reloadCount <= 0) {
        sessionStorage.setItem('reloadCount', String(reloadCount + 1));
        window.location.reload();
    } else {
        sessionStorage.removeItem('reloadCount');
    }

  }, []);

  useEffect(() => {

    getAppointmentsFunction();
    
  }, []);


  /**************************************************
                  Non-Axios Functions
  ***************************************************/

  // When the calendar icon is clicked for the input field, the DatePicker is opened 
  function handleClickDatepickerIcon() {

     const datepickerElement = datepickerRef.current;
     datepickerElement.setFocus(true);
    
  }

  const handleTimeChange = e => {
    setCurrentTimeValue(e.value);
  }

  const handleStatusChange = e => {
    setCurrentStatusValue(e.value);
  }

  const dayClicked = ( event ) => {
    
    setSelectedDate(event);
    
    var temp = moment(event).format("MM-DD-YYYY")
    var dateFormat = temp;

    setDateStr(temp);
    setDateStrFormat(dateFormat);
    
  }

  const checkType = (e) => {

    const target = e.target;

    if (target.checked) {
      setAppntType(target.value);
    } 

  };

  const handleEdit = (eAppntId, eFirstName, eLastName, eDate, eTime, eType, eStatus) => {
    
    setAppointmentID(eAppntId);
    setFirstName(eFirstName);
    setLastName(eLastName);
    setCurrentTimeValue(eTime);
    setDateStr(eDate);
    setDateStrFormat(eDate);
    setAppntType(eType);
    setCurrentStatusValue(eStatus);

    setEditPopup(true);
    
  };

  const handleDelete = (eAppntId, eRowId, eFirstName, eLastName, eDate, eTime) => {
    
    setAppointmentID(eAppntId);
    setRowID(eRowId);
    setFirstName(eFirstName);
    setLastName(eLastName);
    setDateStr(eDate);
    setCurrentTimeValue(eTime);
    
    setCancelPopup(true);
    
  };


  /**************************************************************
      Axios Functions for deleting and updating appointments
  ***************************************************************/

  const editAppointment = () => {

    setEditPopup(false);

    axios.post(`https://health-communications-backend.onrender.com/appointments/updateApptInfo/${appointmentID}`, {

      time: currentTimeValue,
      date: dateStr,
      type: appntType,
      status: currentStatusValue

    }).then(response => {

      window.location.reload();

      console.log(response);

    }).catch((err) => {
      console.log(err)
    });

  }

  const deleteAppointment = () => {

    setCancelPopup(false);

    // Remove the selected appointment row from the data grid
    setDataGridRows(dataGridRows.filter((item) => item.rowID !== rowID));

    axios.post(`https://health-communications-backend.onrender.com/appointments/cancelAppt/${appointmentID}`);
    
    window.location.reload();
 
  }

  /*
     Get all the appointments assigned to the particular doctor. Loop to get the fields
     of each appointment and assign the value of each field to each property of a new 
     row in the grid data table.
  */
  const getAppointmentsFunction = async() => {

    const resp = axios.get(`https://health-communications-backend.onrender.com/appointments/getAppointment/${docId}`);

    resp.then((response) => {

      if(response.data != "No appointments for the user") {

          var data = response.data;

          var id = 0;
          var apptId = "";
          var firstName = "";
          var lastName = "";
          var date = "";
          var time = "";
          var type = "";
          var status = "";

          for(var i = 0; i < data.length; i++) {

            id++;
            apptId = response.data[i]._id;
            firstName = response.data[i]["firstName"];
            lastName = response.data[i]["lastName"];
            date = response.data[i]["date"];
            time = response.data[i]["time"];
            type = response.data[i]["type"];
            status = response.data[i]["status"];
            
            
            setDataGridRows(dataGridRows => [
              ...dataGridRows, 
              {
                'id': id, 
                'apptId': apptId,
                'firstName': firstName, 
                'lastName': lastName, 
                'date': date, 
                'time': time, 
                'type': type,
                'status': status
              },
            ])
 
          }

      }

    })

    .catch((err) => {
      console.log(err, "error");
    });

  }


  const columns = [

    { 
      field: 'id', 
      headerName: 'ID', 
      width: 50 
    },

    {
      field: 'firstName',
      headerName: 'First Name',
      width: 150,
      editable: true,
    },

    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 150,
      editable: true,
    },

    {
      field: 'date',
      headerName: 'Date',
      width: 90,
      editable: true,
    },

    {
      field: 'time',
      headerName: 'Time',
      width: 90,
      editable: true,
    },

    {
      field: 'type',
      headerName: 'Type',
      width: 90,
      editable: true,
    },

    {
      field: 'status',
      headerName: 'Status',
      width: 90,
      renderCell: (params) => {
        return (
          <>
            <div className={`${params.row.status}`}>{params.row.status}</div>
          </>
        )
      }
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {

        return (

          <>
          
            <div className="cell-container">

              <div className='editBtn' 
                 onClick={() => {
                   handleEdit(
                     params.row.apptId, 
                     params.row.firstName,
                     params.row.lastName,
                     params.row.date, 
                     params.row.time, 
                     params.row.type, 
                     params.row.status
                   )
                 }}> 
                 Edit
              </div>

              <div className="deleteBtn" 
                onClick={() => {
                  handleDelete(
                    params.row.apptId, 
                    params.row.id, 
                    params.row.firstName, 
                    params.row.lastName, 
                    params.row.date, 
                    params.row.time
                  )
                }}>
                Cancel
              </div>
            
            </div>

            <Popup trigger={editPopup} setTrigger={setEditPopup}>

              <h3>Edit Appointment Info for {firstName} {" "} {lastName}</h3>

              <label className='modal-label'>Date:</label>
              <div>
                <DatePicker
                  value={dateStrFormat}                            
                  selected={selectedDate}
                  onChange={e=>dayClicked(e)}
                  ref={datepickerRef}
                />
                  
                <CalendarToday className="date-picker-icon" onClick={() => handleClickDatepickerIcon()}/>
                  
              </div>

              <br/>

              <label className='modal-label'>Time:</label>
              <div>
              <Select 
                  options={timeList}
                  value={timeList.find(obj => obj.value === currentTimeValue)} 
                  onChange={handleTimeChange}
              />
              </div>

              <br/>

              <label className='modal-label'>Type:</label>
              <br/>
              <input type="radio" value="person" checked={appntType == 'person'} onChange={e=>checkType(e)}/>
              {" "}
              <span>In Person</span>
              <br/>
              <input type="radio" value="online" checked={appntType == 'online'} onChange={e=>checkType(e)}/>
              {" "}
              <span>Online</span>
              <br/>
              <br/>

              <label className='modal-label'>Status:</label>
              <div>
              <Select 
                  options={statusList}
                  value={statusList.find(obj => obj.value === currentStatusValue)} 
                  onChange={handleStatusChange}
              />
              </div>
              
              <br/>

              <button className="create-btn" onClick={() => editAppointment()} >
                  Submit
              </button>

            </Popup>

            
            <Popup trigger={cancelPopup} setTrigger={setCancelPopup}>

              <h3>Are you sure you want to cancel this appointment?</h3>
              <p>{"With "}{firstName}{" "}{lastName}{" for "}{dateStr}{" at "}{currentTimeValue}</p>
              <button className="yes-Modal" onClick={() => deleteAppointment()}>Yes</button>
              <button className="no-Modal" onClick={() => setCancelPopup(false)}>No</button>

            </Popup>
    
          </>
          
        )
      }
    }

  ];

    
  return (

      <div>

          <Navbar/>

          <div className="container">

              <Leftbar/>

              <div style={{ height: 400, width: '85%', marginTop: 75 }}>

                <h1>Appointments</h1>
    
                <DataGrid
                    rows={dataGridRows}
                    columns={columns}
                    loading={!dataGridRows.length}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                />


              </div>

          </div>

      </div>

  );

}

export default Appointments;