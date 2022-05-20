import Navbar from '../../components/navbar';
import Leftbar from '../../components/leftBar';
import './dashboard.css';


const Dashboard = () => {
   
    return (
        <div>
            <Navbar/>
            <div className="container">
                
               <Leftbar/>
               <div style={{ height: 400, width: '100%', marginTop: '250px' }}>
                   <h1>Welcome, {localStorage.getItem("fullname")}</h1>
               </div>
               
                
            </div>
            
        </div>
    );
};

export default Dashboard;