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
    const [isSearchClicked, setIsSearchClicked] = useState(false);

    const [airports, setAirports] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);

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
        const flights = await api.getFilteredFlights(filterObj);
        setFilteredFlights(flights)
        console.log(flights)
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

    // const search = () => {
    //
    //     setIsSearchClicked(true);
    // }

    return (<>
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
                                    <input className="date-input" type="date" value={minDepartDate}
                                           onChange={(event) => setMinDepartDate(event.target.value)}/>
                                    {/*<img style={{height: "12px"}} alt="arrow" src={rightArrow}/>*/}
                                    <span> ... </span>
                                    <input className="date-input" type="date" value={maxDepartDate}
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
                {filteredFlights.map(flight => <div>
                    <div style={{display: "flex"}}>
                        <div>{flight.srcAirport.alphaCode}</div>
                        <div><img alt={"arrow"} src={arrow}/></div>
                        <div>{flight.destAirport.alphaCode}</div>
                    </div>
                    <div>{new Date(flight.departureTime).toLocaleString()}</div>
                </div>)}
            </div>
        </>
    );
}

export default Browse;
