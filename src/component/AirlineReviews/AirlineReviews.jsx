import React, {useEffect, useState} from 'react';
import Api from "../../helpers/api";
import {useParams} from "react-router";
import airplaneIcon from "../../assets/images/airplane.png";
import '../Profile/Profile.css';
import StarRatings from 'react-star-ratings';
import * as dateFormat from "dateformat";
import './AirlineReviews.css';
import NewReviewModal from "./NewReviewModal";
import {useCookies} from "react-cookie";

const AirlineReviews = () => {

    const api = new Api();
    const {airlineId} = useParams();
    const [airlineDetails, setAirlineDetails] = useState(null);
    const [isNewReviewModalOpen, setIsNewReviewModalOpen] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies();
    const username = cookies?.tisaAuth?.username;

    useEffect(() => {
        if(!airlineId) return;
        getReviews();
    },[airlineId])

    const getReviews = async () => {
        try {
            const response = await api.getAirlineReviews(airlineId);
            setAirlineDetails(response);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if(isNewReviewModalOpen) return;
        getReviews();
    },[isNewReviewModalOpen])

    return (
        <div>
            <NewReviewModal isOpen={isNewReviewModalOpen} onClose={() => setIsNewReviewModalOpen(false)} airlineId={airlineId}/>
            <div className="profileBkg"/>
            <div className="profileHeader">
                <img alt="profileIcon" src={airplaneIcon}/>
                <div style={{display: "flex", alignItems: "center", paddingBottom: 10}}>
                    <span style={{color: "#002071", marginRight: 10, paddingBottom: 0}}>{airlineDetails?.airlineName}</span>
                    <StarRatings
                        rating={airlineDetails?.ranking}
                        starRatedColor="#f1c40f"
                        isSelectable={false}
                        numberOfStars={5}
                        name='total-ranking'
                        starDimension={"20px"}
                        starSpacing={"3px"}
                    />
                    {airlineDetails?.ranking !== 0 && <div style={{marginLeft: 5}}>({airlineDetails?.ranking})</div>}
                </div>
            </div>
            <div style={{marginRight: "15%", marginLeft: "15%"}}>
                {airlineDetails?.reviews?.sort((a,b) => new Date(b.reviewDate) > new Date(a.reviewDate) ? 1 : -1).map(review => <Review review={review}/>)}
                {airlineDetails?.reviews?.length === 0 && <div className="noReviews">There are no reviews yet. Be the first one to write!</div>}
            </div>
            <div style={{display: "flex", justifyContent: "center", width: "100%", paddingBottom: 20}}>
                <button title={!username ? "Please Sign In to write a review": ""} style={!username ? {opacity: 0.6, fontSize: 14, cursor: "not-allowed"} : {fontSize: 14}} disabled={!username} className="blueButton" onClick={() => setIsNewReviewModalOpen(true)}>Write a review</button>
            </div>
        </div>
    );
};

export default AirlineReviews;

const Review = ({review}) => <div className="reviewCube">
    <div>
        <div className="reviewerName">{review.username ?? "Guest"}</div>
        <div className="reviewDate">{dateFormat(review.reviewDate, 'dd/mm/yyyy')}</div>
        <div className="reviewContent">{review.content}</div>
    </div>
    <div>
        <StarRatings
            rating={review?.ranking}
            starRatedColor="#f1c40f"
            isSelectable={false}
            numberOfStars={5}
            name='total-ranking'
            starDimension={"12px"}
            starSpacing={"3px"}
        />
    </div>
</div>