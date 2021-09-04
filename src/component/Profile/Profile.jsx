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
import NewFlightModal from "../NewFlightModal/NewFlightModal";
import download from '../../assets/images/downloadFile.svg';
import {exportToCSV} from "../../helpers/helpers";

const Profile = () => {

    const api = new Api();

    const [cookies, setCookie, removeCookie] = useCookies();
    const username = cookies?.tisaAuth?.username;
    const email = cookies?.tisaAuth?.email;
    const role = cookies?.tisaAuth?.role;
    const airlineId = cookies?.tisaAuth?.airlineId;
    const airlineName = cookies?.tisaAuth?.airlineName;
    const isAirlineWorker = role === Role.AirlineAgent || role === Role.AirlineManager;

    const [isNewFlightModalOpen, setIsNewFlightModalOpen] = useState(false);

    const [selectedTab, setSelectedTab] = useState(0);
    const [newAirline, setNewAirline] = useState("");
    const [newAirlineManager, setNewAirlineManager] = useState("");
    const [newAgent, setNewAgent] = useState("");
    const [airlineFlights, setAirlineFlights] = useState([]);

    const [airlines, setAirlines] = useState([]);
    const [airplanes, setAirplanes] = useState([]);
    const [agents, setAgents] = useState([]);
    const [upcomingFlights, setUpcomingFlights] = useState([]);
    const [historyFlights, setHistoryFlights] = useState([]);

    const getAirplanes = async () => {
        try {
            const planes = await api.getAirplanes(airlineId);
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

    const getAgents = async () => {
        try {
            const agents = await api.getAgents(airlineId);
            setAgents(agents);
        } catch(e) {
            console.error(e)
        }
    }

    const getAirlineFlights = async () => {
        try {
            const flights = await api.getAirlineFlights(airlineId);
            setAirlineFlights(flights.map(flight => {return {source: flight.srcAirport.alphaCode, destination: flight.destAirport.alphaCode, departureTime: flight.departureTime, airplane: flight.airplaneType}}));
        } catch(e) {
            console.error(e)
        }
    }

    const getUserFlights = async () => {
        try {
            const historyFlights = await api.getHistoryFlights();
            const upcomingFlights = await api.getUpcomingFlights();
            setHistoryFlights(historyFlights.map(flight => {return {source: flight.srcAirport.alphaCode, destination: flight.destAirport.alphaCode, departureTime: flight.departureTime}}));
            setUpcomingFlights(upcomingFlights.map(flight => {return {source: flight.srcAirport.alphaCode, destination: flight.destAirport.alphaCode, departureTime: flight.departureTime}}));
        } catch(e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if(!role) return;
        getUserFlights();
        switch (role) {
            case Role.Admin:
                getAirlines();
                break;
            case Role.AirlineManager:
                getAirplanes(airlineId);
                getAgents(airlineId);
                getAirlineFlights(airlineId);
                break;
            case Role.AirlineAgent:
                getAirplanes(airlineId);
                getAirlineFlights(airlineId);
                break;
        }
    },[role])

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const addAirline = async () => {
        if(newAirline.length === 0)  {toast.error("Airline name is not valid"); return;}
        if(!validator.isEmail(newAirlineManager))  {toast.error("Email is not valid"); return;}

        try {
            await api.addAirline(newAirline, newAirlineManager);
            await getAirlines();
            setNewAirline("");
            setNewAirlineManager("");
        } catch (e) {
            console.error(e);
            toast.error("Something went wrong, please check the console");
        }
    }

    const addAirplane = (type) => {
        const newAirplanes = airplanes.map(plane => {
            if(plane.name === type)
                return {id: plane.id ,name: type, count: plane.count + 1}
            return plane;
        })
        setAirplanes(newAirplanes);
    }

    const saveAirplanes = async () => {
        try {
            await api.setAirplanes(airlineId, airplanes.filter(airplane => airplane.count));
            await getAirplanes();
            toast.success("Saved successfully");
        } catch(e) {
            console.error(e);
            toast.error("Something went wrong, please check the console");
        }
    }

    const addAgent = async () => {
        try {
            await api.addAgent(airlineId, newAgent);
            await getAgents();
            setNewAgent("");
        } catch(e) {
            console.error(e);
            toast.error("Something went wrong, please check the console");
        }
    }

    const downloadFlightsReport = async () => {
        try {
            const response = await api.getAirlineFlightsReport(airlineId);
            const fileName = `TISA - Flights Report - ${airlineName}`;

            response.flightsData?.push({flightId: "SUMMARY", totalOfIncome: response.totalOfIncome, occupancyPercentage: response.averageOccupancyPercentage});
            const csvData = response.flightsData?.map(flight => {
                flight.totalOfIncome += "$";
                flight.occupancyPercentage += "%"
                return flight
            }) ?? [];
            exportToCSV(csvData, fileName);
        } catch (e) {
            console.error(e);
        }
    }

    const downloadAdminReport = async () => {
        try {
            const response = await api.getAdminAirlinesReport();
            const fileName = "TISA - Airlines Report";
            exportToCSV(response.filter(row => row).map(row => {
                delete row.flightsData;
                row.averageOccupancyPercentage += "%";
                row.totalOfIncome += "$";
                return row;
            }), fileName);
        } catch (e) {
            console.error(e);
        }
    }

    const downloadUsersReport = async () => {
        try {
            const response = await api.getAdminUsersReport();
            const fileName = "TISA - Users Report";
            exportToCSV(response, fileName);
        } catch (e) {
            console.error(e);
        }
    }

    const downloadAirlineOrdersReport = async () => {
        try {
            const response = await api.getAirlineOrdersReport(airlineId);
            const fileName = `TISA - Orders Report - ${airlineName}`;
            exportToCSV(response.flightsOrdersData, fileName);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="user-profile">
            <NewFlightModal isOpen={isNewFlightModalOpen} onClose={() => setIsNewFlightModalOpen(false)}
                            airplanes={airplanes.filter(airplane => airplane.count > 0)} airlineId={airlineId} getAirlineFlights={getAirlineFlights}/>
            <div className="profileBkg"/>
            <div className="profileHeader">
                <img alt="profileIcon" src={profileIcon}/>
                <span style={{color: "#002071"}}>{username}</span>
            </div>

            <div className="profileCubes">
                {(role === Role.AirlineManager || role === Role.Admin) && <div className="profile-section">
                    <div className="content" style={{border: "none", padding: 0, marginRight: 40, display: "flex"}}>
                        {role === Role.AirlineManager && <div><Button endIcon={<img alt={"download"} src={download}/>} variant={"outlined"} size={"small"} color={"primary"} onClick={downloadFlightsReport}>Flights Report</Button></div>}
                        {role === Role.AirlineManager && <div style={{marginLeft: 10}}><Button endIcon={<img alt={"download"} src={download}/>} variant={"outlined"} size={"small"} color={"primary"} onClick={downloadAirlineOrdersReport}>Orders Report</Button></div>}
                        {role === Role.Admin && <div><Button endIcon={<img alt={"download"} src={download}/>} variant={"outlined"} size={"small"} color={"primary"} onClick={downloadAdminReport}>Airlines Report</Button></div>}
                        {role === Role.Admin && <div style={{marginLeft: 10}}><Button endIcon={<img alt={"download"} src={download}/>} variant={"outlined"} size={"small"} color={"primary"} onClick={downloadUsersReport}>Users Report</Button></div>}
                    </div>
                </div>}
                <div className="profile-section">
                    <div className="content">
                        <div className="profileCubeTitle">General Account Settings</div>
                        <div className="row"><div className="label">Username</div> <div className="label-value">{username}</div> </div>
                        <div className="row"><div className="label">Email</div> <div className="label-value">{email}</div> </div>
                        <div className="row"><div className="label">Authentication</div> <div className="label-value">{role}</div> </div>
                        {isAirlineWorker && <div className="row"><div className="label">Airline</div> <div className="label-value">{airlineName}</div> </div>}
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
                            {historyFlights?.length === 0 ? <div className="emptyMessage">
                            You don't have any previous flights
                        </div> : <FlightsTable flights={historyFlights}/>}
                        </div>}
                    </div>
                </div>

                {role === Role.Admin && <div className="profile-section">
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

                {(role === Role.AirlineManager || role === Role.AirlineAgent) && <div className="profile-section">
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
                                {airplanes.map(airplane => <tr key={airplane.id}>
                                    <td>{airplane.name}</td>
                                    <td style={{display: "flex", alignItems: "center"}}> <span style={{width: 15}}>{airplane.count}</span> <img style={{marginLeft: 10, height: 18}} className="addButton" alt="add" src={plusIcon} onClick={() => addAirplane(airplane.name)}/></td>
                                </tr>)}
                                </tbody>
                            </table>
                            <div style={{display: "flex", justifyContent: "flex-end"}}>
                                <Button variant={"outlined"} size={"small"} color={"primary"} onClick={saveAirplanes}>SAVE</Button>
                            </div>
                        </div>
                    </div>
                </div>}

                {role === Role.AirlineManager && <div className="profile-section">
                    <div className="content">
                        <div className="profileCubeTitle">Manage Agents</div>
                        <div>
                                {agents.map(agentEmail => <div className="agentRow" key={agentEmail}>{agentEmail}</div>)}
                                <div style={{display: "flex", marginTop: 15}}>
                                    <input className="manageAirlineInput" value={newAgent} onChange={(event) => setNewAgent(event.target.value)} onKeyDown={(e) => {if(e.key === 'Enter') addAgent()}}/>
                                    <img style={{marginLeft: 15}} className="addButton" alt="add" src={plusIcon} onClick={addAgent}/>
                                </div>
                        </div>
                    </div>
                </div>}

                {isAirlineWorker && <div className="profile-section">
                    <div className="content">
                        <div className="profileCubeTitle">Manage Airline Flights</div>
                        <div>
                            <FlightsTable flights={airlineFlights}/>
                            <div style={{display: "flex", justifyContent: "flex-end", marginTop: 20}}>
                                <Button variant={"outlined"} size={"small"} color={"primary"} onClick={() => setIsNewFlightModalOpen(true)}>NEW FLIGHT</Button>
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
                    {flights[0]?.airplane && <th>Airplane</th>}
                </tr>
            </thead>
            <tbody>
            {flights.map(flight => <tr key={flight.departureTime.toString()}>
                <td>{flight.source}</td>
                <td>{flight.destination}</td>
                <td>{new Date(flight.departureTime).toLocaleString()}</td>
                {flight?.airplane && <td>{flight.airplane}</td>}
            </tr>)}
            </tbody>
        </table>
    </div>}