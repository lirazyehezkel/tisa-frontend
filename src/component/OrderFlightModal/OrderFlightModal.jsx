import Api from "../../helpers/api";
import React, {useEffect, useState} from "react";
import Modal from "@material-ui/core/Modal";
import '../LoginModal/LoginModal.css';
import './OrderFlightModal.css';
import spinner from "../../assets/images/spinner.svg";
import {FlightDisplay} from "../Browse/Browse";
import {Button, Radio} from "@material-ui/core";
import minusIcon from "../../assets/images/minusIconDark.svg";
import plusIcon from "../../assets/images/plusIconDark.svg";
import * as dateFormat from "dateformat";
import {toast} from "react-toastify";

const OrderFlightModal = ({isOpen, onClose, flightId}) => {

    const api = new Api();
    const [flightDetails, setFlightDetails] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [passengersCount, setPassengersCount] = useState(1);
    const [isOrderDone, setIsOrderDone] = useState(false);

    useEffect(() => {
        setIsOrderDone(false);
        setSelectedDepartment(null)
        setPassengersCount(1)
    },[isOpen])

    useEffect(() => {
        if(!flightId) return;
        (async () => {
            try {
                setFlightDetails(null)
                const data = await api.getFlightDetails(flightId);
                setFlightDetails(data)
            } catch (e) {
                console.error(e);
            }
        })()
    },[flightId, isOpen])

    const minusPassenger = () => {
        if (passengersCount > 1)
            setPassengersCount(passengersCount - 1);
    }

    const plusPassenger = () => {
        if (passengersCount < selectedDepartment.availableSeats)
            setPassengersCount(passengersCount + 1);
    }

    const onRadioChange = (dep) => {
        setSelectedDepartment(dep)
    }

    const isButtonDisabled = () => {
        return !selectedDepartment || passengersCount === 0;
    }

    const pay = async () => {
        try {
            await api.orderFlight(flightId, selectedDepartment.departmentId, passengersCount);
            setIsOrderDone(true);
        } catch (e) {
            toast.error("Something went wrong, please try again later");
            console.error(e);
        }
    }

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="modal">
                {!flightDetails ? <div style={{textAlign: "center", padding: 20}}><img style={{height: 40}} src={spinner} alt="spinner"/></div> : <>
                <div className="modal-header" style={{fontSize: 16}}>
                    <FlightDisplay flight={flightDetails}/>
                </div>
                {isOrderDone ? <div style={{padding: "20%"}}>
                    <div style={{marginBottom: 40, fontSize: 20, fontWeight: 600}}>Hooray !</div>
                    <div style={{marginBottom: 20}}>Your order was completed successfully!</div>
                    <div style={{marginBottom: 20}}>You can view the list of your future flights at any time on the profile page</div>
                    <div>Enjoy your flight :)</div>
                </div> :
                <div className="modal-content">
                    <div style={{padding: "7% 5%"}}>
                        <table>
                            <thead>
                                <tr>
                                    <th/>
                                    <th>Department</th>
                                    <th>Price</th>
                                    <th>Passengers</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flightDetails.departmentsData.map(department => <tr key={department.departmentId}>
                                    <td>
                                        <Radio checked={department.departmentId === selectedDepartment?.departmentId} onChange={() => onRadioChange(department)} name="radio-button-dep"/>
                                    </td>
                                    <td>{department.displayName}</td>
                                    <td>{`${department.price} $`}</td>
                                    <td style={{width: 200}}>
                                        {department.departmentId === selectedDepartment?.departmentId && <div className="passengers">
                                            <img style={{height: 18}} src={minusIcon} alt={"minus"} onClick={minusPassenger}/>
                                            <div className="passengersAccount" style={{fontSize: 13}}><span
                                                className="passengersAccountNumber" style={{fontSize: 17}}>{passengersCount}</span>adult{passengersCount > 1 && "s"}
                                            </div>
                                            <img style={{height: 18}} src={plusIcon} alt={"plus"} onClick={plusPassenger}/>
                                        </div>}
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                    {selectedDepartment && <div style={{padding: "7% 5%"}}>
                        <div className="summaryPart">
                            <div className="summaryTitle">Depart</div>
                            <div>{dateFormat(flightDetails.departureTime, 'mmmm dd HH:MM')}</div>
                            <div>{flightDetails.srcAirport.name} ({flightDetails.srcAirport.city} ,{flightDetails.srcAirport.country})</div>
                        </div>
                        <div className="summaryPart">
                            <div className="summaryTitle">Arrive</div>
                            <div>{dateFormat(flightDetails.arrivalTime, 'mmmm dd HH:MM')}</div>
                            <div>{flightDetails.destAirport.name} ({flightDetails.destAirport.city} ,{flightDetails.destAirport.country})</div>
                        </div>
                        <div className="summaryPart">
                            <div className="summaryTitle">Total Price</div>
                            <div>{passengersCount} passengers for {selectedDepartment?.displayName}</div>
                            <div><b>{passengersCount*selectedDepartment.price} $</b></div>
                        </div>
                    </div>}
                    <div style={{display: "flex", justifyContent: "center", marginTop: 20, marginBottom: 20}}>
                        <Button disabled={isButtonDisabled()} variant="contained" color="primary" onClick={pay}>PAY</Button>
                    </div>
                </div>}
                </>}
            </div>
        </Modal>
    );
}

export default OrderFlightModal;
