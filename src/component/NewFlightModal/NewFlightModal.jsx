import Api from "../../helpers/api";
import React, {useEffect, useState} from "react";
import Modal from "@material-ui/core/Modal";
import {
    Button,
    createStyles,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import '../LoginModal/LoginModal.css';
import {toast} from "react-toastify";

const useStyles = makeStyles(() =>
    createStyles({
        formControl: {
            minWidth: 220,
        }
    }),
);

const NewFlightModal = ({isOpen, onClose, airplanes, airlineId, getAirlineFlights}) => {

    const api = new Api();
    const classes = useStyles();

    const [source, setSource] = useState("");
    const [dest, setDest] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [arrivalTime, setArrivalTime] = useState("");
    const [departmentPrices, setDepartmentPrices] = useState([]);
    const [selectedAirplane, setSelectedAirplane] = useState("");
    const [airports, setAirports] = useState([]);

    useEffect(() => {
        clearForm();
        (async () => {
            try {
                const airportsRes = await api.getAirports();
                setAirports(airportsRes);
            } catch (e) {
                console.error(e);
            }
        })()
    },[isOpen])

    useEffect(() => {
        if(!selectedAirplane?.id) return;
        (async () => {
            try {
                const deps = await api.getAirplaneDepartments(selectedAirplane.id);
                setDepartmentPrices(deps.map(dep => {
                    return {departmentId: dep.id, displayName: dep.name, price: 0}
                }))
            } catch(e) {
                console.error(e);
            }
        })()
    },[selectedAirplane?.id])

    const clearForm = () => {
        setSource("");
        setDest("");
        setDepartureTime("");
        setArrivalTime("");
        setDepartmentPrices([]);
        setSelectedAirplane("");
    }

    const changeDepPrices = (event, dep) => {
        setDepartmentPrices(departmentPrices.map(department => {
            if(department.departmentId === dep) {
                department.price = event.target.value;
            }
            return department;
        }))
    }

    const createFlight = async () => {
        const flightObj = {
            airplaneTypeId: selectedAirplane.id,
            departmentPrices: departmentPrices,
            departureTime: new Date(departureTime),
            arrivalTime: new Date(arrivalTime),
            srcAirportId: source.id,
            destAirportId: dest.id
        }
        try {
            await api.createFlight(airlineId, flightObj);
            await getAirlineFlights();
            onClose();
        } catch(e) {
            console.error(e);
            toast.error("Something went wrong, please check the console");
        }
    }

    const isButtonDisabled = () => {
        let isDisabled = false;
        if(!departureTime || !arrivalTime || new Date(departureTime) >= new Date(arrivalTime)) isDisabled = true;
        if(!source || !dest || !selectedAirplane) isDisabled = true;
        departmentPrices.forEach(dep => {
            if(!dep.price || isNaN(dep.price)) isDisabled = true;
        })
        return isDisabled;
    }

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="modal">
                <div className="modal-header">
                    <div>New Flight</div>
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "calc(100% - 160px)"}}>
                    <div>
                        <div style={{display: "flex", marginTop: 20}}>
                           <div style={{padding: 20}}>
                               <TextField
                                   className={classes.formControl}
                                   id="datetime-local"
                                   label="Departure Time"
                                   type="datetime-local"
                                   onChange={e => {setDepartureTime(e.target.value); setArrivalTime(e.target.value)}}
                                   value={departureTime}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                               />
                           </div>
                           <div style={{padding: 20}}>
                               <TextField
                                   className={classes.formControl}
                                   id="datetime-local"
                                   label="Arrival Time"
                                   type="datetime-local"
                                   onChange={e => setArrivalTime(e.target.value)}
                                   value={arrivalTime}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                               />
                           </div>
                        </div>
                        <div style={{display: "flex", marginTop: 20}}>
                            <div style={{padding: 20}}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-label">Source Airport</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={source?.alphaCode}
                                        onChange={(e) => setSource(e.target.value)}
                                    >
                                        {airports.map(airport => <MenuItem key={airport.id} value={airport}>{airport.alphaCode}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{padding: 20}}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-label">Destination Airport</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={dest?.alphaCode}
                                        onChange={(e) => setDest(e.target.value)}
                                    >
                                        {airports.map(airport => <MenuItem key={airport.id} value={airport}>{airport.alphaCode}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div style={{display: "flex", marginTop: 20}}>
                            <div style={{padding: 20}}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-label">Airplane</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedAirplane?.name}
                                        onChange={(e) => setSelectedAirplane(e.target.value)}
                                    >
                                        {airplanes.map(airplane => <MenuItem key={airplane.id} value={airplane}>{airplane.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </div>
                            {selectedAirplane && <div style={{padding: 20, textAlign: "center"}}>
                                <div style={{color: "rgba(0,0,0,0.5)", textAlign: "center"}}>Departments Prices</div>
                                {departmentPrices.map((dep) => <div key={dep.departmentId} style={{display: "flex", alignItems: "center", marginTop: 15}}>
                                    <span style={{width: 150, fontSize: 14}}>{dep.displayName}</span>
                                    <FormControl style={{width: 80}}>
                                        <Input
                                            id="standard-adornment-amount"
                                            value={dep.price}
                                            onChange={(event) => changeDepPrices(event, dep.departmentId)}
                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        />
                                    </FormControl>
                                </div>)}
                            </div>}
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", marginTop: 20}}>
                        <Button disabled={isButtonDisabled()} variant="contained" color="primary" onClick={createFlight}>ADD</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default NewFlightModal;
