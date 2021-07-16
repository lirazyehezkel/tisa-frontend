import React, {useState} from 'react';
import profileIcon from '../../assets/images/user.png';
import './Profile.css';
import {Paper, Tab, Tabs} from "@material-ui/core";

const Profile = () => {

    const [selectedTab, setSelectedTab] = useState(0);

    const upcomingTrips = [{source: "Tel Aviv", destination: "New York", departureTime: new Date()}, {source: "New York", destination: "Tel Aviv", departureTime: new Date()}]
    const flightHistory = [];

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <div className="user-profile">

            <div className="profileBkg">

            </div>
            <div className="profileHeader">
                <img alt="profileIcon" src={profileIcon}/>
                <span style={{color: "#002071"}}>Liraz Yehezkel</span>
            </div>

            <div className="profile-section account">
                <div className="content">
                    <div className="row"><div className="label">Username</div> <div className="label-value">722lirazy</div> </div>
                    <div className="row"><div className="label">Email</div> <div className="label-value">722lirazy@gmail.com</div> </div>
                    <div className="row"><div className="label">Full Name</div> <div className="label-value">Liraz Yehezkel</div> </div>
                    <div className="row"><div className="label">Authentication</div> <div className="label-value">Admin</div> </div>
                </div>
            </div>

            <div className="userTablesContainer">
                <div className="userTables">
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="UPCOMING TRIPS" />
                        <Tab label="FLIGHT HISTORY" />
                    </Tabs>
                    {selectedTab === 0 && <div>
                        {upcomingTrips?.length === 0 ? <div className="emptyMessage">
                            You don't have any upcoming trips
                        </div> : <TripsTable trips={upcomingTrips}/>}
                    </div>}
                    {selectedTab === 1 && <div>
                        {flightHistory?.length === 0 ? <div className="emptyMessage">
                        You don't have any previous trips
                    </div> : <TripsTable trips={flightHistory}/>}
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default Profile;

const TripsTable = ({trips}) => {return <div style={{marginTop: 20}}>
        <table>
            <tr>
                <th>Source</th>
                <th>Destination</th>
                <th>Departure Time</th>
            </tr>
            <tbody>
            {trips.map(trip => <tr>
                <td>{trip.source}</td>
                <td>{trip.destination}</td>
                <td>{trip.departureTime.toLocaleString()}</td>
            </tr>)}
            </tbody>
        </table>
    </div>}