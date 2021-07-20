import React, {useEffect, useState} from 'react';
import profileIcon from '../../assets/images/user.png';
import plusIcon from '../../assets/images/plusIcon.svg';
import './Profile.css';
import {Button, Tab, Tabs} from "@material-ui/core";
import {toast} from "react-toastify";
import validator from 'validator';
import Api from "../../helpers/api";
import {useCookies} from "react-cookie";
import {Role} from "../../helpers/consts";

const Profile = () => {

    const api = new Api();

    const [cookies, setCookie, removeCookie] = useCookies();
    const username = cookies?.tisaAuth?.username;
    const email = cookies?.tisaAuth?.email;
    const role = cookies?.tisaAuth?.role;
    const isAdmin = role === Role.Admin;

    const [selectedTab, setSelectedTab] = useState(0);
    const [newAirline, setNewAirline] = useState("");
    const [newAirlineManager, setNewAirlineManager] = useState("");
    const [airlines, setAirlines] = useState([{name: "EL AL", airlineManagerEmail: "722lirazy@gmail.com"}, {name: "American Airlines", airlineManagerEmail: "722zuriely@gmail.com"}]);
    const [airplanes, setAirplanes] = useState([{type: "boeing 777", count: 2}, {type: "boeing 787", count: 1}, {type: "f16", count: 0}]);

    const upcomingFlights = [{source: "Tel Aviv", destination: "New York", departureTime: new Date()}, {source: "New York", destination: "Tel Aviv", departureTime: new Date(100021)}]
    const flightHistory = [];
    let isAgent = 1;
    let userAirline= "1";

    const getAirplanes = async () => {
        try {
            const planes = await api.getAirplanes(userAirline);
            setAirplanes(planes);
        } catch(e) {
            console.error(e)
        }
    }

    const getAirlines = async () => {
        try {
            const airlines = await api.getAirlines();
            setAirlines(airlines);
        } catch(e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getAirplanes()
        getAirlines()
    },[])

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const addAirline = async () => {
        if(newAirline.length === 0)  {toast.error("Airline name is not valid"); return;}
        if(!validator.isEmail(newAirlineManager))  {toast.error("Email is not valid"); return;}

        try {
            await api.addAirline(newAirline, newAirlineManager);
            await getAirlines();
        } catch (e) {
            console.error(e);
            toast.error("Something went wrong, please check the console");
        }
        // setAirlines([...airlines, {name: newAirline, airlineManagerEmail: newAirlineManager}]);
        // setNewAirline("");
        // setNewAirlineManager("");
    }

    const addAirplane = (type) => {
        const newAirplanes = airplanes.map(plane => {
            if(plane.type === type)
                return {type: type, count: plane.count + 1}
            return plane;
        })
        setAirplanes(newAirplanes);
    }

    const saveAirplanes = async () => {
        try {
            await api.setAirplanes(userAirline, airplanes.filter(airplane => airplane.count));
            await getAirplanes();
            toast.success("Saved successfully");
        } catch(e) {
            console.error(e);
            toast.error("Something went wrong, please check the console");
        }
    }

    return (
        <div className="user-profile">

            <div className="profileBkg"/>
            <div className="profileHeader">
                <img alt="profileIcon" src={profileIcon}/>
                <span style={{color: "#002071"}}>{username}</span>
            </div>

            <div className="profileCubes">

                <div className="profile-section">
                    <div className="content">
                        <div className="profileCubeTitle">General Account Settings</div>
                        <div className="row"><div className="label">Username</div> <div className="label-value">{username}</div> </div>
                        <div className="row"><div className="label">Email</div> <div className="label-value">{email}</div> </div>
                        <div className="row"><div className="label">Authentication</div> <div className="label-value">{role}</div> </div>
                    </div>
                </div>

                <div className="profile-section">
                    <div className="content">
                        <div className="profileCubeTitle">Flights</div>
                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="UPCOMING" />
                            <Tab label="HISTORY" />
                        </Tabs>
                        {selectedTab === 0 && <div>
                            {upcomingFlights?.length === 0 ? <div className="emptyMessage">
                                You don't have any upcoming flights
                            </div> : <FlightsTable flights={upcomingFlights}/>}
                        </div>}
                        {selectedTab === 1 && <div>
                            {flightHistory?.length === 0 ? <div className="emptyMessage">
                            You don't have any previous flights
                        </div> : <FlightsTable flights={flightHistory}/>}
                        </div>}
                    </div>
                </div>

                {isAdmin && <div className="profile-section">
                    <div className="content">
                        <div className="profileCubeTitle">Manage Airlines</div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Airline</th>
                                        <th>Manager's Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {airlines.map(airline => <tr key={airline.name}>
                                    <td>{airline.name}</td>
                                    <td>{airline.airlineManagerEmail}</td>
                                </tr>)}
                                <tr>
                                    <td><input className="manageAirlineInput" value={newAirline} onChange={(event) => setNewAirline(event.target.value)} onKeyDown={(e) => {if(e.key === 'Enter') addAirline()}}/></td>
                                    <td><input className="manageAirlineInput" value={newAirlineManager} onChange={(event) => setNewAirlineManager(event.target.value)} onKeyDown={(e) => {if(e.key === 'Enter') addAirline()}}/></td>
                                    <td><img className="addButton" alt="add" src={plusIcon} onClick={addAirline}/></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>}

                {isAgent && <div className="profile-section">
                    <div className="content">
                        <div className="profileCubeTitle">Manage Airplanes</div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {airplanes.map(airplane => <tr key={airplane.type}>
                                    <td>{airplane.type}</td>
                                    <td style={{display: "flex", alignItems: "center"}}> <span style={{width: 15}}>{airplane.count}</span> <img style={{marginLeft: 10, height: 18}} className="addButton" alt="add" src={plusIcon} onClick={() => addAirplane(airplane.type)}/></td>
                                </tr>)}
                                </tbody>
                            </table>
                            <div style={{display: "flex", justifyContent: "flex-end"}}>
                                <Button variant={"outlined"} size={"small"} color={"primary"} onClick={saveAirplanes}>SAVE</Button>
                            </div>
                        </div>
                    </div>
                </div>}

            </div>
        </div>
    );
};

export default Profile;

const FlightsTable = ({flights}) => {return <div style={{marginTop: 20}}>
        <table>
            <thead>
                <tr>
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Departure Time</th>
                </tr>
            </thead>
            <tbody>
            {flights.map(flight => <tr key={flight.departureTime.toString()}>
                <td>{flight.source}</td>
                <td>{flight.destination}</td>
                <td>{flight.departureTime.toLocaleString()}</td>
            </tr>)}
            </tbody>
        </table>
    </div>}