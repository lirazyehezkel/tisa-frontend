import * as axios from "axios";
import Cookies from 'js-cookie';

export default class Api {
    constructor() {
        this.api_token = null;
        this.client = null;
        this.api_url = "http://localhost:5000/api/";
    }

    init = () => {
        this.api_token = JSON.parse(Cookies.get("tisaAuth"))?.token;

        let headers = {
            Accept: "application/json",
        };

        // if (this.api_token) {
        //     headers.Authorization = `Bearer ${this.api_token}`;
        // }

        this.client = axios.create({
            baseURL: this.api_url,
            timeout: 31000,
            headers: headers,
        });

        return this.client;
    };

    login = async (username, password) => {
        const response = await this.init().post("/Authenticate/SignIn", {username, password});
        return response.data;
    }

    signUp = async (username, password, email) => {
        const response = await this.init().post("/Authenticate/SignUp", {username, password, email});
        return response.data;
    }

    getAirlines = async () => {
        console.log(this.api_token);
        const response = await this.init().get("/Airline/All");
        return response.data;
    };

    getAirplanes = async (airlineId) => {
        const response = await this.init().get(`/Airline/${airlineId}/Airplanes`);
        return response.data;
    }

    setAirplanes = async (airlineId, airplanes) => {
        const response = await this.init().put(`/Airline/${airlineId}/Airplanes`, airplanes);
        return response.data;
    }

    addAirline = async (airlineName, managerEmail) => {
        const response = await this.init().put(`/Airline`, {name: airlineName, airlineManagerEmail: managerEmail});
        return response.data;
    }
}