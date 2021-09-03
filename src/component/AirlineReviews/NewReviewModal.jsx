import React, {useState} from 'react';
import Modal from "@material-ui/core/Modal";
import '../LoginModal/LoginModal.css';
import Api from "../../helpers/api";
import StarRatings from "react-star-ratings";
import './AirlineReviews.css';
import {useCookies} from "react-cookie";
import {toast} from "react-toastify";
import {Button} from "@material-ui/core";

const NewReviewModal = ({isOpen, onClose, airlineId}) => {

    const api = new Api();
    const [rating, setRating] = useState(0);
    const [reviewContent, setReviewContent] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies();
    const username = cookies?.tisaAuth?.username;

    const sendReview = async () => {
        try {
            await api.writeReview(airlineId, username, reviewContent, rating, new Date())
            onClose()
            toast.success("Review sent successfully");
        } catch (e) {
            toast.error("Something went wrong, please try again later");
            console.error(e);
        }
    }

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="modal">
                <div className="modal-header">
                    <div>Write a Review</div>
                </div>
                <div style={{height: "calc(700px - 140px)", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                   <div className="login-modal-content">
                       <div style={{display: "flex", justifyContent: "center"}}>
                           <StarRatings
                               rating={rating}
                               starRatedColor="#f1c40f"
                               starHoverColor="#f1c40f"
                               changeRating={(rate) => setRating(rate)}
                               numberOfStars={5}
                               name='total-ranking'
                               starDimension={"20px"}
                               starSpacing={"3px"}
                           />
                       </div>
                       <div style={{display: "flex", justifyContent: "center", fontSize: 14, paddingTop: 5, color: "rgba(0,0,0,0.5)"}}>
                           Tap a star to rate
                       </div>
                       <div style={{marginTop: 30}}>
                           <textarea id="story" name="story" rows="10" placeholder={"Review..."} value={reviewContent} onChange={(event) => setReviewContent(event.target.value)}/>
                       </div>
                   </div>
                    <div style={{display: "flex", justifyContent: "center", width: "100%", marginBottom: 25}}>
                        <Button disabled={!rating} variant="contained" color="primary" onClick={sendReview}>Send</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default NewReviewModal;
