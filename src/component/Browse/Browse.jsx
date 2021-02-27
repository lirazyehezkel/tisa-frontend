import React, {useState} from 'react';
import bkg from '../../assets/images/tisa-bkg.svg';
import './Browse.css';
import switchIcon from '../../assets/images/switch.svg';
import rightArrow from '../../assets/images/right-arrow.svg';
import plusIcon from '../../assets/images/plusIcon.svg';
import minusIcon from '../../assets/images/minusIcon.svg';

const sectionStyle = {
    width: "100%",
    height: "607px",
    backgroundImage: `url(${bkg})`
};


const Browse = ()  => {

    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [departDate, setDepartDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [passengersAccount, setPassengersAccount] = useState(1);
    
    const switchFromTo = () => {
        const from = source;
        setSource(destination);
        setDestination(from);
    }

    const minusPassenger = () => {
        if(passengersAccount > 1)
            setPassengersAccount(passengersAccount - 1);
    }

    const plusPassenger = () => {
        if(passengersAccount < 8)
            setPassengersAccount(passengersAccount + 1);
    }

    return (
        <div style={sectionStyle}>
            <div className="browse-content">
                <div className="blue-bkg">
                </div>
                <div className="filter-box">
                    <div>
                        <div className="top-filter-box-layout">
                            <div className="top-filter-box-layout-left">
                                <div className="from-filter">
                                    <div style={{fontSize: 20, width: 80}}>From</div> <input style={{marginLeft: 15, width: "100%"}} className="date-input" value={source} onChange={(event) => setSource(event.target.value)}/>
                                </div>
                                <div className="to-filter">
                                    <div style={{fontSize: 20, width: 80}}>To</div> <input style={{marginLeft: 15, width: "100%"}} className="date-input" value={destination} onChange={(event) => setDestination(event.target.value)}/>
                                </div>
                            </div>
                            <div>
                                <img className="switch-img" alt="switch" src={switchIcon} onClick={switchFromTo}/>
                            </div>
                        </div>
                        <div>
                            <div className="boarding-date-title">Boarding Date</div>
                            <div className="boarding-date-box">
                                <input className="date-input" type="date" value={departDate} onChange={(event) => setDepartDate(event.target.value)}/>
                                <img style={{height: "12px"}} alt="arrow" src={rightArrow}/>
                                <input className="date-input" type="date" value={returnDate} onChange={(event) => setReturnDate(event.target.value)}/>
                            </div>
                        </div>
                        <div style={{marginTop: 30}}>
                        <div className="boarding-date-title">Passengers</div>
                        <div className="passengers">
                            <div><img src={minusIcon} alt={"minus"} onClick={minusPassenger}/></div>
                            <div className="passengersAccount"><span className="passengersAccountNumber">{passengersAccount}</span>adult{passengersAccount > 1 && "s"}</div>
                            <div><img src={plusIcon} alt={"plus"} onClick={plusPassenger}/></div>
                        </div>
                    </div>
                    </div>
                    <div className="searchContainer">
                        <button className="blueButton searchButton">Search</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Browse;
