import React from 'react';
import {Switch, Route} from "react-router-dom";
import {Redirect} from "react-router";
import Browse from "./Browse/Browse";
import Profile from "./Profile/Profile";
import AirlineReviews from "./AirlineReviews/AirlineReviews";
import {Routes} from "../helpers/consts";

const AppSwitchRoutes = () => {
    return <Switch>
        <Route exact path="/">
            <Redirect to={Routes.BROWSE}/>
        </Route>
        <Route exact path={Routes.BROWSE}>
            <Browse/>
        </Route>
        <Route path={Routes.PROFILE}>
            <Profile/>
        </Route>
        <Route path={Routes.AIRLINE}>
            <AirlineReviews/>
        </Route>
    </Switch>
}

export default AppSwitchRoutes;