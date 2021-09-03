import React, {useEffect, useState} from 'react';
import bkg from '../../assets/images/tisa-bkg.svg';
import './Browse.css';
import plusIcon from '../../assets/images/plusIcon.svg';
import minusIcon from '../../assets/images/minusIcon.svg';
import {Link} from 'react-scroll';
import Api from "../../helpers/api";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {TextField} from "@material-ui/core";
import arrow from '../../assets/images/right-arrow.svg';
import airplane from '../../assets/images/airplane.png';
import * as dateFormat from 'dateformat';
import spinner from '../../assets/images/spinner.svg';
import OrderFlightModal from "../OrderFlightModal/OrderFlightModal";
import {formatInputRangeDate} from "../../helpers/helpers";
import {Routes} from "../../constants/routes";

const sectionStyle = {
    width: "100%",
    height: "607px",
    backgroundImage: `url(${bkg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
};


const todayDate = (d) => {
    return d.getFullYear() + "-" + "0"+(d.getMonth()+1) + "-" + d.getDate();
}

const Browse = () => {

    const api = new Api();
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [minDepartDate, setMinDepartDate] = useState(todayDate(new Date()));
    const [maxDepartDate, setMaxDepartDate] = useState("");
    const [passengersCount, setPassengersCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isOrderFlightModalOpen, setIsOrderFlightModalOpen] = useState(false);
    const [selectedFlightId, setSelectedFlightId] = useState(null);

    const [airports, setAirports] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState(null);

    const searchFlights = async () => {
        const filterObj = {
            srcAirportId: airports.find(airport => airport.name === source)?.id ?? -1,
            destAirportId: airports.find(airport => airport.name === destination)?.id ?? -1,
            numberOfPassengers: passengersCount,
            minDepartureTime: new Date(minDepartDate)
        }
        if(maxDepartDate) {
            filterObj.maxDepartureTime = new Date(maxDepartDate)
        }
        try {
            setIsLoading(true);
            const flights = await api.getFilteredFlights(filterObj);
            setFilteredFlights(flights)
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await api.getAirports();
                setAirports(response.map(airport => {return {id: airport.id, name: `${airport.country} (${airport.alphaCode})`}}))
            } catch (e) {
                console.error(e);
            }
        })()
    },[])

    const minusPassenger = () => {
        if (passengersCount > 1)
            setPassengersCount(passengersCount - 1);
    }

    const plusPassenger = () => {
        if (passengersCount < 8)
            setPassengersCount(passengersCount + 1);
    }

    const selectFlight = async (flightId) => {
        setSelectedFlightId(flightId);
        setIsOrderFlightModalOpen(true);
    }

    return (<>
            <OrderFlightModal isOpen={isOrderFlightModalOpen} onClose={() => setIsOrderFlightModalOpen(false)} flightId={selectedFlightId}/>
            <div style={sectionStyle}>
                <div className="browse-content">
                    <div className="filter-box">
                        <div>
                            <div className="top-filter-box-layout">
                                <div className="top-filter-box-layout-left">
                                    <div className="from-filter">
                                        <Autocomplete
                                            id="choose-airport-from"
                                            options={airports?.map((option) => option.name)}
                                            onSelect={(event) => setSource(event.target.value)}
                                            renderInput={(params) => (
                                                <TextField {...params} label="From" margin="normal" variant="outlined"/>
                                            )}
                                        />
                                    </div>
                                    <div className="to-filter">
                                        <Autocomplete
                                            id="choose-airport-to"
                                            options={airports?.map((option) => option.name)}
                                            onSelect={(event) => setDestination(event.target.value)}
                                            renderInput={(params) => (
                                                <TextField {...params} label="To" margin="normal" variant="outlined"/>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="boarding-date-title">Range of Boarding Date</div>
                                <div className="boarding-date-box">
                                    <input min={formatInputRangeDate(new Date())} className="date-input" type="date" value={minDepartDate}
                                           onChange={(event) => setMinDepartDate(event.target.value)}/>
                                    <span> ... </span>
                                    <input min={formatInputRangeDate(minDepartDate)} className="date-input" type="date" value={maxDepartDate}
                                           onChange={(event) => setMaxDepartDate(event.target.value)}/>
                                </div>
                            </div>
                            <div style={{marginTop: 30}}>
                                <div className="boarding-date-title">Passengers</div>
                                <div className="passengers">
                                    <div><img src={minusIcon} alt={"minus"} onClick={minusPassenger}/></div>
                                    <div className="passengersAccount"><span
                                        className="passengersAccountNumber">{passengersCount}</span>adult{passengersCount > 1 && "s"}
                                    </div>
                                    <div><img src={plusIcon} alt={"plus"} onClick={plusPassenger}/></div>
                                </div>
                            </div>
                        </div>
                        <div className="searchContainer">
                            <Link to="searchResults" smooth={true}><button className="blueButton searchButton" onClick={searchFlights}>Search</button></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div id="searchResults" style={{height: filteredFlights?.length > 0 && "70vh"}}>
                <div className="flightsContainer">
                    {isLoading ? <div style={{textAlign: "center", padding: 20}}><img style={{height: 40}} src={spinner} alt="spinner"/></div> : <>
                        {filteredFlights?.length === 0 && <div className="noResult">No Result match your search criteria</div>}
                        {filteredFlights?.map(flight => <div className="flightCube">
                            <div className="airlineName" onClick={() => window.open(Routes.AIRLINE.replace(":airlineId", flight.airlineId))}>
                                <img style={{height: 18, marginRight: 5}} alt="airplane" src={airplane}/>
                                {flight.airlineName}
                            </div>
                            <div className={"flightCubeLayout"}>
                                <div className="flightCubeLeft">
                                    <FlightDisplay flight={flight}/>
                                </div>
                                <div className="flightCubeRight">
                                    <button className="blueButton" onClick={() => selectFlight(flight.flightId)}>Select</button>
                                </div>
                            </div>
                        </div>)}
                    </>}
                </div>
            </div>
        </>
    );
}

export default Browse;

export const FlightDisplay = ({flight}) => <div style={{width: "100%"}}>
    <div style={{padding: 17}}>
        {dateFormat(flight.departureTime, 'mmmm dd')}
    </div>
    <div style={{display: "flex"}}>
        <div className="sourceAirport">
            <div>{flight.srcAirport.alphaCode}</div>
            <div style={{marginTop: 5}}>{dateFormat(flight.departureTime, 'HH:MM')}</div>
        </div>
        <div className="flightLineContainer" style={{display: "flex"}}>
            <div className="flightLine"/>
            <div><img className="arrowImg" alt={"arrow"} src={arrow}/></div>
        </div>
        <div className="destAirport">
            <div>{flight.destAirport.alphaCode}</div>
            <div style={{marginTop: 5}}>{dateFormat(flight.arrivalTime, 'HH:MM')}</div>
        </div>
    </div>
</div>
